import React, { useState } from 'react';
import './css/LoginPage.css';
import LogoImage from '../assets/Logo.jpg';

const LoginPage = () => {
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
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Form submitted:', formData);
      // Add your authentication logic here
    };
  
    const toggleMode = (mode) => {
      setIsSignUp(mode === 'signup');
    };
  
    return (
      <div className="login-container">
        <div className="background-content">
          <img src={LogoImage} alt="The Strong Christian Tower Academy Logo" className="logo-image" />
          <h2 className="academy-name">The Strong Christian Tower Academy</h2>
        </div>
        
        <div className="login-form-container">
          <h1 className="welcome-text">Welcome<br/>Back</h1>
          <p className="subtitle">Please enter your details</p>
          
          <div className="toggle-container">
            <div 
              className={`toggle-option ${!isSignUp ? 'active' : ''}`}
              onClick={() => toggleMode('signin')}
            >
              Sign in
            </div>
            <div 
              className={`toggle-option ${isSignUp ? 'active' : ''}`}
              onClick={() => toggleMode('signup')}
            >
              Sign up
            </div>
          </div>
          
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
  
  export default LoginPage;