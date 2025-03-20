import React, { useState } from 'react';
import './css/Login.css';
import { useNavigate } from 'react-router-dom'; 
import LogoImage from '../assets/Logo.jpg';

//backend
import supabase from '../../backend/supabase-client';

const Login = () => {
    const navigate = useNavigate(); 
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
      fullName: '',
      username: '',
      password: '',
      confirmPassword: ''
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.username,  // Assuming username is an email for simplicity
        password: formData.password,
      });
    
      if (error) {
        alert(`Login error: ${error.message}`);
      } else {
        alert('Login successful!');
        navigate('/'); 
      }
    };
    
  
    return (
      <div className="login-container">
        <div className="background-content">
          <img src={LogoImage} alt="The Strong Christian Tower Academy Logo" className="logo-image" />
          <h2 className="academy-name">The Strong Christian Tower Academy</h2>
        </div>
        
        <div className="login-form-container">
          <h1 className="welcome-text">Welcome Staff Members!</h1>
          <br/>
          
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required={isSignUp}
                />
              </div>
            )}
            
            {isSignUp ? (
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required={isSignUp}
                />
              </div>
            ) : (
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required={!isSignUp}
                />
              </div>
            )} 
            
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            {isSignUp && (
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={isSignUp}
                />
              </div>
            )}
            
            <button type="submit" className="continue-button">Continue</button>
          </form>
        </div>
      </div>
    );
  };
  
  export default Login;