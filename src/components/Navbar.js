import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {

  const token = sessionStorage.getItem("spbysptoken")
  const navigate = useNavigate();
  
  const [user, setUser] = useState(sessionStorage.getItem("spbyspuser"));

  const handleLogout = () => {
    sessionStorage.removeItem("spbysptoken");
    sessionStorage.removeItem("spbyspuser");
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Portfolio Tracker</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {token ? (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link to="/" className="nav-link" aria-current="page">Investment</Link>
                </li>
                <li className="nav-item">
                  <Link to="activity" className="nav-link" aria-current="page">Activity</Link>
                </li>
              </ul>
            </>
          ) : (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link to="/login" className="nav-link" aria-current="page">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">Signup</Link>
                </li>
              </ul>
            </>
          )}
          <span className="d-flex" role="search">
          {token ? (
          <>
            <span className="text-secondary me-4 fs-2">Welcome {user}</span>
            <button className="btn btn-outline-danger" type="submit" onClick={handleLogout}>Logout</button>
          </>
          ):(
          <>
          </>
          )}
          </span>
        </div>
      </div>
    </nav>
  );
}
