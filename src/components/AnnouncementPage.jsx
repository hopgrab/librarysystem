import React, { useState } from 'react';
import './css/AnnouncementPage.css';
import LogoImage from '../assets/Logo.jpg';
import { FaSearch } from 'react-icons/fa'; 

const AnnouncementPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    
    // Sample announcement data
    const announcements = [
        {
            id: 1,
            date: 'Feb 26',
            year: '2025',
            title: 'Library System Update',
            content: 'Our digital library system will undergo maintenance on Feb 28 from 10 PM - 12 AM.'
        },
        {
            id: 2,
            date: 'Feb 20',
            year: '2025',
            title: 'New Arrivals: March Collection',
            content: 'Excitement! We\'ve added 50+ new books across fiction, self-help...'
        },
        {
            id: 3,
            date: 'Feb 15',
            year: '2025',
            title: 'Reminder: Return Overdue Books',
            content: 'Please return overdue books by Feb 18 to avoid late fees. Check your borrowed...'
        }
    ];

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
        
            <div className="content-wrapper">
                <div className="announcements-section">
                    <h1 className="announcements-title">Announcements</h1>
                    
                    <div className="search-container">
                        <input 
                            type="text" 
                            placeholder="Search here" 
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="search-button">
                            <FaSearch />
                        </button>
                    </div>
                    
                    <div className="announcements-list">
                        {announcements.map(announcement => (
                            <div className="announcement-item" key={announcement.id}>
                                <div className="announcement-date">
                                    <div className="date-month">{announcement.date}</div>
                                    <div className="date-year">{announcement.year}</div>
                                </div>
                                <div className="announcement-content">
                                    <h3 className="announcement-title">{announcement.title}</h3>
                                    <p className="announcement-description">{announcement.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementPage;