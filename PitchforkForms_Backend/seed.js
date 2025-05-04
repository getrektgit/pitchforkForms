const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const seed = async () => {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await connection.query(`USE \`${DB_NAME}\`;`);

    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        role ENUM('admin','student') NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        profile_pic VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS forms (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        creator_id INT,
        FOREIGN KEY (creator_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS questions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        text VARCHAR(255) NOT NULL,
        type ENUM('radiobutton','checkbox') NOT NULL,
        form_id INT,
        score INT NOT NULL,
        FOREIGN KEY (form_id) REFERENCES forms(id)
      );

      CREATE TABLE IF NOT EXISTS answer_options (
        id INT PRIMARY KEY AUTO_INCREMENT,
        question_id INT,
        text VARCHAR(255) NOT NULL,
        is_right BOOLEAN NOT NULL DEFAULT false,
        FOREIGN KEY (question_id) REFERENCES questions(id)
      );

      CREATE TABLE IF NOT EXISTS submissions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        form_id INT,
        submit_time DATETIME NOT NULL,
        total_score INT NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (form_id) REFERENCES forms(id)
      );

      CREATE TABLE IF NOT EXISTS submission_answers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        submission_id INT,
        answer_id INT,
        FOREIGN KEY (submission_id) REFERENCES submissions(id),
        FOREIGN KEY (answer_id) REFERENCES answer_options(id)
      );

      CREATE TABLE IF NOT EXISTS sent_forms (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        form_id INT,
        sent_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (form_id) REFERENCES forms(id)
      );
    `;

    await connection.query(schema);

    // Seed users
    await connection.query(`
      INSERT INTO users (id, email, username, role, password_hash, profile_pic) VALUES
      (1, 'pitchforkformsnotify@gmail.com', 'Admin', 'admin', '$2b$10$HByptxncW0r0yY6twKEdvewjbd7cK4VBPySIGI.zgxoEZPvETynTW', NULL),
      (2, 'test@example.com', 'Student', 'student', '$2b$10$tYhRWQEjtTDPtvor1zT6NeFMRaYlyB95mypd4ZqYv2BudZ8UV0t9K', 'asd123');
    `);

    // Seed forms
    await connection.query(`
      INSERT INTO forms (id, name, creator_id) VALUES
      (1, 'Sample Form A', 1),
      (2, 'Sample Form B', 1);
    `);

    // Seed questions
    await connection.query(`
      INSERT INTO questions (id, text, type, form_id, score) VALUES
      (1, 'What is 2 + 2?', 'radiobutton', 1, 5),
      (2, 'Select even numbers', 'checkbox', 1, 10),
      (3, 'Is the sky blue?', 'radiobutton', 2, 5);
    `);

    // Seed answer options
    await connection.query(`
      INSERT INTO answer_options (id, question_id, text, is_right) VALUES
      (1, 1, '3', false),
      (2, 1, '4', true),
      (3, 2, '1', false),
      (4, 2, '2', true),
      (5, 2, '4', true),
      (6, 3, 'Yes', true),
      (7, 3, 'No', false);
    `);

    // Seed submissions
    await connection.query(`
      INSERT INTO submissions (id, user_id, form_id, submit_time, total_score) VALUES
      (1, 2, 1, '2024-04-01 10:00:00', 15);
    `);

    // Seed submission_answers
    await connection.query(`
      INSERT INTO submission_answers (id, submission_id, answer_id) VALUES
      (1, 1, 2),
      (2, 1, 4),
      (3, 1, 5);
    `);

    // Seed sent_forms
    await connection.query(`
      INSERT INTO sent_forms (id, user_id, form_id, sent_at) VALUES
      (1, 2, 1, '2024-03-31 12:00:00');
    `);

    console.log("All tables created and seed data inserted successfully.");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await connection.end();
  }
};

seed();
