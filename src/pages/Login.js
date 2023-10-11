import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: null,
    password: null
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formIsValid()) {
      return;
    }
    axios.post("http://localhost:5000/api/login", user)
      .then(res => {
        if (res.data.success) {
          sessionStorage.setItem("spbysptoken", res.data.data.token);
          sessionStorage.setItem("spbyspuser", res.data.data.user);
          navigate('/');
          toast.success(res.data.message);
          window.location.reload();
        } else {
          toast.error(res.data.error);
        };
      })
      .catch(err => {
        console.log(err);
        toast.error("Server Error");
      })
  };

  const formIsValid = () => {
    if (user.username === '' || user.username === null) {
      toast.error("Username cannot be empty");
      return false;
    }
    if (user.password === '' || user.password === null) {
      toast.error("Password cannot be empty");
      return false;
    }
    return true;
  };

  return (
    <div className="row text-bg-Secondary fs-6 pt-5">
      <div className="col-4"></div>
      <div className="col-4">
        <form className="bg-dark text-bg-dark p-3 rounded shadow">
          <div className="fw-bold text-center fs-5">Login Form</div>
          <div class="mb-3">
            <label htmlFor="username" className="form-label">Username<span className="text-warning ps-1">*</span></label>
            <input type="text" className="form-control mb-3" id="username" onChange={(e) => setUser({ ...user, username: e.target.value })} />
            <label htmlFor="password" className="form-label">Password<span className="text-warning ps-1">*</span></label>
            <input type="password" className="form-control mb-3" id="password" onChange={(e) => setUser({ ...user, password: e.target.value })} />
            <button className="btn btn-warning w-100 mt-3" onClick={handleSubmit}>Login</button>
          </div>
        </form>
      </div>
      <div className="col-4"></div>
    </div>
  );
}
