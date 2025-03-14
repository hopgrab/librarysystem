import React, { useState } from 'react';
import './css/sample.css';
import LogoImage from '../assets/Logo.jpg';

const AnnouncementPage = () => {

    return (
        <div className="announcement-container"> 
            <nav className="navbar">
                <div className="nav-logo-container">
                    <img src={LogoImage} alt="Logo" className="nav-logo" />
                    <h2 className="nav-title">The Strong Tower Christian Academy</h2>
                </div>
                <div className="nav-links">
                    <a href="#" className="nav-link">Home</a>
                    <a href="#" className="nav-link">Books</a>
                    <a href="#" className="nav-link">Equipment</a>
                    <a href="#" className="nav-link">Management</a>
                    <a href="#" className="login-button">Login</a>
                </div>
            </nav>

            <div className="banner-container">
                <div className="banner-image"></div>
            </div>
        
        </div>
    );
};

export default AnnouncementPage;