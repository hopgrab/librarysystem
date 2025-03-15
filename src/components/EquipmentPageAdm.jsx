import React, { useState } from 'react';
import './css/EquipmentPage.css';
import LogoImage from '../assets/Logo.jpg';
import { FaSearch } from 'react-icons/fa';

const EquipmentPageAdm = () => {
    const [activeTab, setActiveTab] = useState('All Equipment');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Sample equipment data
    const equipment = [
        {
            id: 1,
            name: 'Printer HP LaserJet 4350',
            location: 'Main Floor',
            category: 'Printing',
            status: 'Available'
        },
        {
            id: 2,
            name: 'Scanner Epson DS-870',
            location: 'Reference Section',
            category: 'Scanning',
            status: 'In Use'
        },
        {
            id: 3,
            name: 'Study Room A (4 people)',
            location: 'Second Floor',
            category: 'Rooms',
            status: 'Reserved'
        },
        {
            id: 4,
            name: 'Laptop Dell XPS 13',
            location: 'Tech Desk',
            category: 'Computers',
            status: 'Available'
        },
        {
            id: 5,
            name: 'iPad Pro 12.9"',
            location: 'Tech Desk',
            category: 'Tablets',
            status: 'Available'
        },
        {
            id: 6,
            name: 'Noise-Cancelling Headphones',
            location: 'Media Center',
            category: 'Audio',
            status: 'Maintenance'
        },
        {
            id: 7,
            name: 'Projector Epson VS250',
            location: 'Meeting Room',
            category: 'Presentation',
            status: 'Reserved'
        },
        {
            id: 8,
            name: 'Document Camera',
            location: 'Media Center',
            category: 'Presentation',
            status: 'Available'
        },
    ];

    const getStatusColor = (status) => {
        switch(status) {
            case 'Available':
                return '#2a8c63';
            case 'In Use':
                return '#f59e0b';
            case 'Reserved':
                return '#3b82f6';
            case 'Maintenance':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    return (
        <div className="equipment-container"> 
            <nav className="navbar">
                <div className="nav-logo-container">
                    <img src={LogoImage} alt="Logo" className="nav-logo" />
                    <h2 className="nav-title">The Strong Tower Christian Academy</h2>
                </div>
                <div className="nav-links">
                    <a href="#" className="nav-link">Home</a>
                    <a href="#" className="nav-link">Books</a>
                    <a href="#" className="nav-link active">Equipment</a>
                    <a href="#" className="nav-link">Management</a>
                    <a href="#" className="login-button">Login</a>
                </div>
            </nav>

            <div className="content-wrapper">
                <div className="dashboard">
                    <h2 className="dashboard-title">Equipment Dashboard</h2>
                    <div className="dashboard-controls">
                        <div className="search-container">
                            <input 
                                type="text" 
                                placeholder="Search equipment..." 
                                className="search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="search-button">
                                <FaSearch />
                            </button>
                        </div>
                        
                        <div className="tabs-container">
                            <button 
                                className={`tab-button ${activeTab === 'All Equipment' ? 'active' : ''}`}
                                onClick={() => setActiveTab('All Equipment')}
                            >
                                All Equipment
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'Available' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Available')}
                            >
                                Available
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'My Reservations' ? 'active' : ''}`}
                                onClick={() => setActiveTab('My Reservations')}
                            >
                                My Reservations
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'Borrowing History' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Borrowing History')}
                            >
                                Borrowing History
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="equipment-grid">
                    {equipment.map(item => (
                        <div className="equipment-card" key={item.id}>
                            <div className="equipment-image-container">
                                {/* Placeholder for equipment image */}
                            </div>
                            <div className="equipment-details">
                                <h3 className="equipment-name">{item.name}</h3>
                                <p className="equipment-location">Location: {item.location}</p>
                                <div className="equipment-meta">
                                    <span className="equipment-category">{item.category}</span>
                                    <span 
                                        className="equipment-status"
                                        style={{ backgroundColor: getStatusColor(item.status) }}
                                    >
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EquipmentPageAdm;