import React, { useState, useEffect } from 'react';
import './css/Equipment.css';
import LogoImage from '../assets/Logo.jpg';
import { FaSearch } from 'react-icons/fa';

// Backend
import supabase from '../../backend/supabase-client';
import handleLogout from '../../backend/auth';
import { Link } from 'react-router-dom';
import useAuth from './hooks/useAuth';

const Equipment = () => {
    const { session, isAdmin } = useAuth();

    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('All Equipment');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchEquipment = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('equipment')
                    .select(`
                        equipment_id,
                        name,
                        location,
                        category,
                        status
                    `);

                if (error) throw error;

                setEquipment(data);
            } catch (err) {
                setError('Failed to fetch equipment.');
                console.error('Error fetching equipment:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, []);

    const filteredEquipment = equipment.filter(item => {
        if (activeTab === 'Available') {
            return item.status === 'Available';
        }
        return (
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const getStatusColor = (status) => {
        switch (status) {
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
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/lib" className="nav-link">Books</Link>
                    <Link to="/announcements" className="nav-link">Announcements</Link>
                    {session && (
                        <>
                            <a href="#" className="nav-link active">Equipment</a>
                            {isAdmin && <Link to="/manage-account" className="nav-link">Management</Link>}
                        </>
                    )}
                    {session ? (
                        <button onClick={handleLogout}>Logout</button>
                    ) : (
                        <Link to="/login" className="login-button">Login</Link>
                    )}
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
                            {session && (
                                <>
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
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {loading && <p>Loading equipment...</p>}
                {error && <p className="error">{error}</p>}

                <div className="equipment-grid">
                    {filteredEquipment.length > 0 ? (
                        filteredEquipment.map(item => (
                            <div className="equipment-card" key={item.equipment_id}>
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
                        ))
                    ) : (
                        <div className="no-equipment-message">
                            🔍 No equipment found. Try searching for another item.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Equipment;
