import Navbar from '../src/Components/Navbar'
import './App.css'
import MainPage from './Components/MainPage'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"; import './App.css'

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />}></Route>
          {
            /*
              <Route path="/register" element={<RegisterPage />}/>
              <Route path="/login" element={<LoginPage />}/>
            */
          }
        </Routes>
      </Router>
    </>
  )
}

export default App