import React, { useState, useEffect } from 'react';
import './css/Equipment.css';
import LogoImage from '../assets/Logo.jpg';
import { FaSearch } from 'react-icons/fa';

// Backend
import supabase from '../../backend/supabase-client';
import handleLogout from '../../backend/auth';
import { Link } from 'react-router-dom';
import useAuth from './hooks/useAuth';

import NavBar from './Nav';

const Equipment = () => {
    const { session, isAdmin } = useAuth();

    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('All Equipment');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch equipment with item details
    useEffect(() => {
        const fetchEquipment = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('equipment')
                    .select(`
                        equipment_id,
                        equipment_name,
                        status,
                        items (
                            copies_total,
                            copies_available,
                            description,
                            image
                        )
                    `);
                console.log('Fetched Equipment Data:', data);
                if (error) throw error;

                setEquipment(data || []);
            } catch (err) {
                setError('Failed to fetch equipment.');
                console.error('Error fetching equipment:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, []);

    // Filter equipment based on search and status
    const filteredEquipment = equipment.filter((item) => {
        if (activeTab === 'Available' && item.status !== 'Available') {
            return false;
        }

        const query = searchQuery.toLowerCase();
        return (
            item.equipment_name.toLowerCase().includes(query) ||
            (item.items?.description?.toLowerCase().includes(query) ||
                item.items?.remarks?.toLowerCase().includes(query))
        );
    });

    // Get status color for different states
    const getStatusColor = (status) => {
        const statusColors = {
            Available: '#2a8c63',
            'In Use': '#f59e0b',
            Reserved: '#3b82f6',
            Maintenance: '#ef4444',
        };
        return statusColors[status] || '#6b7280';
    };

    return (
        <div className="equipment-container">
            <NavBar />

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
                            {/* Add Equipment Button with Link */}
                            <Link to="/add-equipment" className="tab-button add-equipment-btn">
                                Add Equipment
                            </Link>
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
                        filteredEquipment.map((item) => (
                            <div className="equipment-card" key={item.equipment_id}>
                                <div className="equipment-details">
                                    <h3 className="equipment-name">{item.equipment_name}</h3>
                                    {item.items ? (
                                        <div className="item-details">
                                            <div className="equipment-image">
                                                <img
                                                    src={
                                                        item.items.image ||
                                                        'https://via.placeholder.com/150'
                                                    }
                                                    alt={item.equipment_name}
                                                />
                                            </div>
                                            <p className="equipment-description">
                                                {item.items.description || 'No description available.'}
                                            </p>
                                            <p className="equipment-copies">
                                                Copies Available: {item.items.copies_available || 0} /{' '}
                                                {item.items.copies_total || 0}
                                            </p>
                                            <div className="equipment-meta">
                                                <span
                                                    className="equipment-status"
                                                    style={{
                                                        backgroundColor: getStatusColor(item.status),
                                                    }}
                                                >
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>No item details available.</p>
                                    )}
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
