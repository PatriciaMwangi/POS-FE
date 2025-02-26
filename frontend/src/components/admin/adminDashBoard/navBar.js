import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUserContext } from '../userContext';

const Navbar = () => {
  const navigate = useNavigate();
  const {user} = useUserContext()




  const isAdmin = user === 1 || user === '1'
 console.log('admin?',isAdmin)
  return (
    <>
      <nav className={`navbar navbar-expand-lg ${isAdmin ? 'bg-warning' : 'bg-success'}`}>
        <div className="container-fluid">
          <NavLink className="navbar-brand" to={isAdmin ? "/admin-dashboard" : "/user-dashboard"}>
            {isAdmin ? "Admin Dashboard" : "User Dashboard"}
          </NavLink>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
            console.log()
              {isAdmin ? (
                <>
                  <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={() => navigate('/new-supplier')}>+ Purchases</button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={() => navigate('/new-customer')}
                    >
                      + Sales
                    </button>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/profile">Profile</NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/profile">Profile</NavLink>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={() => navigate('/new-customer')}
                    >
                      + Sales
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

     
    </>
  );
};

export default Navbar;
