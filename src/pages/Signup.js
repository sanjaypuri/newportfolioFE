import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    username:null,
    password:null
  });
  
  const [password, setPassword] = useState(null);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if(!formIsValid()){
      return;
    }
    alert("hello");
    axios.post("http://localhost:5000/api/newuser", user)
    .then(res => {
      if(res.data.success){
        toast.success(res.data.message);
        navigate('/login');
      } else {
        toast.error(res.data.error);
      };
    })
    .catch (err => {
      console.log(err);
      toast.error("Server Error");
    })
  };
  
  const formIsValid = () => {
      if(user.username === '' || user.username === null){
        toast.error("Username cannot be empty");
        return false;
      }
      if(user.username.length < 3){
        toast.error("Username should atleast be three chacters long");
        return false;
      }
      if(user.password === '' || user.password === null){
        toast.error("Password cannot be empty");
      return false;
    }
    let validPassword = true;
    if (8 < user.password.length && user.password.length > 20){
      validPassword = false;
    };
    if(!(user.password.match(".*\\d.*"))){
      validPassword = false;
    };
    if(!(user.password.match(".*[a-z].*"))){
      validPassword = false;
    };
    if(!(user.password.match(".*[A-Z].*"))){
      validPassword = false;
    };
    if((user.password.match(".*[!@#$%^&():;<>,._+-=].*"))){
    }else{
      validPassword = false;
    }
    if(!validPassword){
      toast.error("A valid password must contain atleast one lowercase letter, one uppercase letter, one digit and one special charcter and password must be 8 to 20 characters long");
      return false;
    }
    if(password === '' || password === null){
      toast.error("Confirm Password cannot be empty");
      return false;
    }
    if(!(user.password === password)){
      toast.error("password not matching with Confirm Password");
      return false;
    }
    return true;
  };

  return (
    <div className="row text-bg-Secondary fs-6 pt-5">
      <div className="col-4"></div>
      <div className="col-4">
        <form className="bg-dark text-bg-dark p-3 rounded shadow">
          <div className="fw-bold text-center fs-5">Signup Form</div>
          <div class="mb-3">
            <label htmlFor="username" className="form-label">Username<span className="text-warning ps-1">*</span></label>
            <input type="text" className="form-control mb-3" id="username" onChange={(e) => setUser({ ...user, username: e.target.value })}/>
            <label htmlFor="password1" className="form-label">Password<span className="text-warning ps-1">*</span></label>
            <input type="password" className="form-control mb-3" id="password1" onChange={(e) => setUser({ ...user, password: e.target.value })}/>
            <label htmlFor="password2" className="form-label">Confirm Password<span className="text-warning ps-1">*</span></label>
            <input type="password" className="form-control mb-3" id="password2" onChange={(e) => setPassword(e.target.value)}/>
            <button className="btn btn-warning w-100 mt-3" onClick={handleSubmit}>Submit</button>
          </div>
        </form>
      </div>
      <div className="col-4"></div>
    </div>
  );
}
