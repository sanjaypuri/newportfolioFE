import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import './App.css';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Purchase from './pages/Activity';
import Activity from './pages/Activity';

function App() {
  return (
    // <>
    <BrowserRouter>
        <ToastContainer></ToastContainer>
      <div className="container-fluid d-flex flex-column vh-100 m-0 p-0">
        <div>
          <Navbar />
        </div>
        <div className="flex-grow-1 bg-secondary">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/activity" element={<Activity />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
    // </>
  );
}

export default App;
