import Navbar from '../src/Components/Navbar'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"; import './App.css'
import MainPage from './Components/Pages/MainPage'
import AdminPage from './Components/Pages/AdminPage';
import StudentPage from './Components/Pages/StudentPage';
import CreateFormPage from './Components/Pages/CreateFormPage';
import FormPage from './Components/Pages/FormPage';


function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />}></Route>
          <Route path='/admin' element={<AdminPage/>}></Route>
          <Route path='/student' element={<StudentPage/>}></Route>
          <Route path='/admin/create-form' element={<CreateFormPage/>}></Route>
          <Route path='/student/form' element={<FormPage/>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App