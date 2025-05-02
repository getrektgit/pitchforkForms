const request = require("supertest")
const express = require("express")
const bcrypt = require("bcryptjs")
const auth = require("../routes/userAuth")
const actions = require("../routes/userActions")
const dbQuery = require("../utils/queryHelper")
const jwt = require("jsonwebtoken");
const db = require("../config/database")

jest.setTimeout(10000);
jest.mock("bcryptjs")
jest.mock('jsonwebtoken', () => ({
    ...jest.requireActual('jsonwebtoken'),
    verify: jest.fn((token, secret, callback) => {
      if (typeof callback === 'function') {
        callback(null, { id: 1, email: 'test@example.com', role: 'user' });
      } else {
        return { id: 1, email: 'test@example.com', role: 'user' };
      }
    }),
    sign: jest.fn(() => 'fake-token')
  }));
jest.mock("../utils/queryHelper", () => jest.fn());
jest.mock("../config/database", () => ({
    query: jest.fn(),
    connect: jest.fn(),
  }));
jest.spyOn(console, "error").mockImplementation(() => {});

const app = express()
app.use(express.json())
app.use("/auth",auth)
app.use("/user",actions)

  
describe("User routes",()=>{
    beforeEach(()=>{
        jest.clearAllMocks()
    })

    describe("POST /auth/register", () => {
        it("201 after successful register", async () => {
            bcrypt.hash.mockResolvedValue("hashedPassword123");
            dbQuery.mockResolvedValue([{ insertId: 1 }]);
        
            const res = await request(app).post("/auth/register").send({
                email: "test@example.com",
                username: "tester",
                password: "password123",
                profile_pic: "none.jpg"
            });
        
            expect(res.status).toBe(201);
            expect(res.body).toEqual({ message: "Sikeres regisztracio!" });
            expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
            expect(dbQuery).toHaveBeenCalled();
            });

            it("should return 400 if not all fields are filled", async () => {
            bcrypt.hash.mockResolvedValue("hashedPassword123");
        
            const response = await request(app).post("/auth/register").send({
                username: "testuser",
                email: "test@example.com",
                password: "password123"
            });
        
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Minden mező kötelező!");
            });
        
            it("should return 500 if dbQuery fails", async () => {
            bcrypt.hash.mockResolvedValue("hashedPassword123");
            dbQuery.mockRejectedValue(new Error("Database error"));
        
            const response = await request(app).post("/auth/register").send({
                email: "test@example.com",
                username: "testuser",
                password: "password123",
                profile_pic: "pic.jpg"
            });
        
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty("message", "Hiba történt a regisztráció során!");
            });
    });

    describe('POST /auth/login', () => {
    
        it('should return 400 if email or password is missing', async () => {
            const response = await request(app)
              .post('/auth/login')
              .send({ email: '', password: '' });
            
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({ message: 'Adj meg emailt és jelszót!' });
            
            expect(db.query).not.toHaveBeenCalled();
          });
        
          it('should return 401 if user is not found', async () => {
            db.query.mockImplementation((sql, params, callback) => {
              callback(null, []);
            });
        
            const response = await request(app)
              .post('/auth/login')
              .send({ email: 'nonexistent@example.com', password: 'password123' });
            
            expect(response.statusCode).toBe(401);
            expect(response.body).toEqual({ message: 'Hibás email vagy jelszó!' });
            
            expect(db.query).toHaveBeenCalledWith(
              'SELECT * FROM users WHERE email = ?',
              ['nonexistent@example.com'],
              expect.any(Function)
            );
            
            expect(bcrypt.compare).not.toHaveBeenCalled();
          });
        
          it('should return 200 with token on successful login', async () => {
            const mockUser = {
              id: 1,
              email: 'test@example.com',
              username: 'testuser',
              role: 'user',
              password_hash: 'hashedpassword'
            };
        
            db.query.mockImplementation((sql, params, callback) => {
              callback(null, [mockUser]);
            });
            
            bcrypt.compare.mockResolvedValue(true);
            
            jwt.sign.mockReturnValueOnce('fake-access-token');
            jwt.sign.mockReturnValueOnce('fake-refresh-token');
            
            const response = await request(app)
              .post('/auth/login')
              .send({ email: 'test@example.com', password: 'correctpassword' });
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
              message: 'Sikeres bejelentkezés!',
              token: 'fake-access-token',
              id: 1,
              username: 'testuser',
              email: 'test@example.com',
              role: 'user'
            });
            
            expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedpassword');
            
            expect(jwt.sign).toHaveBeenCalledWith(
              { id: 1, email: 'test@example.com', role: 'user' },
              expect.any(String),
              { expiresIn: '1h' }
            );
            
            expect(response.headers['set-cookie']).toBeDefined();
            expect(response.headers['set-cookie'][0]).toContain('refreshToken');
          });
    });

    describe('PUT /users/:id', () => {
        const mockUserId = '123';
        const mockRequestBody = {
          email: 'updated@example.com',
          username: 'updateduser',
          profile_pic: 'https://example.com/pic.jpg'
        };
    
        test('should return 400 if email or username is missing', async () => {
          const incompleteRequestBody = {
            email: '',
            username: ''
          };
    
          const response = await request(app)
            .put(`/user/users/${mockUserId}`)
            .set('Authorization', 'Bearer fake-token')
            .send(incompleteRequestBody);
          
          expect(response.statusCode).toBe(400);
          expect(response.body).toEqual({ 
            message: 'Email és felhasználónév megadása kötelező!' 
          });
          
          expect(dbQuery).not.toHaveBeenCalled();
        });
    
        test('should return 404 if user does not exist', async () => {
          dbQuery.mockResolvedValueOnce({ affectedRows: 0 });
    
          const response = await request(app)
            .put(`/user/users/${mockUserId}`)
            .set('Authorization', 'Bearer fake-token')
            .send(mockRequestBody);
          
          expect(response.statusCode).toBe(404);
          expect(response.body).toEqual({ 
            message: 'Felhasználó nem található!' 
          });
          
          expect(dbQuery).toHaveBeenCalledWith(
            'UPDATE users SET email = ?, username = ?, profile_pic = ? WHERE id = ?',
            ['updated@example.com', 'updateduser', 'https://example.com/pic.jpg', mockUserId]
          );
        });
    
        test('should return 200 on successful user update', async () => {
          dbQuery.mockResolvedValueOnce({ affectedRows: 1 });
    
          const response = await request(app)
            .put(`/user/users/${mockUserId}`)
            .set('Authorization', 'Bearer fake-token')
            .send(mockRequestBody);
          
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual({ 
            message: 'Felhasználói adatok sikeresen frissítve!' 
          });
          
          expect(dbQuery).toHaveBeenCalledWith(
            'UPDATE users SET email = ?, username = ?, profile_pic = ? WHERE id = ?',
            ['updated@example.com', 'updateduser', 'https://example.com/pic.jpg', mockUserId]
          );
        });
      });
})