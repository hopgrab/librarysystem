import React, { useState } from 'react';
import './css/BookSpecific.css';
import LogoImage from '../assets/Logo.jpg';
import BookCoverPlaceholder from '../assets/BookCoverPlaceholder.jpg';
const BookSpecific = () => {
    // Sample book data - replace with your actual data or API call
    const bookData = {
        title: "Bald Bearded Boss",
        author: "Alison Holt",
        status: "Available",
        synopsis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        coverImage: BookCoverPlaceholder
    };

    const handleBorrow = () => {
        console.log("Borrow button clicked");
        // Add your borrow functionality here
    };

    const handleReserve = () => {
        console.log("Reserve button clicked");
        // Add your reserve functionality here
    };

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

            <div className="book-container">
                <div className="back-button-container">
                    <button className="back-button" onClick={() => window.history.back()}>
                        &larr; Back
                    </button>
                </div>
                
                <div className="book-details">
                    <div className="book-cover">
                        <img 
                            src={bookData.coverImage} 
                            alt={`${bookData.title} cover`} 
                            className="cover-image"
                        />
                    </div>
                    
                    <div className="book-info">
                        <h1 className="book-title">{bookData.title}</h1>
                        
                        <div className="author-status-container">
                            <p className="book-author">By {bookData.author}</p>
                            <div className={`book-status ${bookData.status.toLowerCase()}`}>
                                {bookData.status}
                            </div>
                        </div>
                        
                        <div className="book-synopsis">
                            <p>{bookData.synopsis}</p>
                        </div>
                        
                        <div className="book-actions">
                            <button 
                                className="borrow-button" 
                                onClick={handleBorrow}
                                disabled={bookData.status !== "Available"}
                            >
                                Borrow
                            </button>
                            <button 
                                className="reserve-button" 
                                onClick={handleReserve}
                                disabled={bookData.status === "Available"}
                            >
                                Reserve
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookSpecific;