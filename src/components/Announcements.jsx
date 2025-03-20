import React, { useState, useEffect } from 'react';
import './css/Announcements.css';
import LogoImage from '../assets/Logo.jpg';
import { FaSearch, FaEdit } from 'react-icons/fa';
import supabase from '../../backend/supabase-client';
import handleLogout from '../../backend/auth';
import { Link } from 'react-router-dom';
import useAuth from './hooks/useAuth';

const Announcements = () => {
    const { session, isAdmin } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [editedAnnouncement, setEditedAnnouncement] = useState({ title: '', description: '' });

    // Fetch announcements from Supabase
    useEffect(() => {
        const fetchAnnouncements = async () => {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('time', { ascending: false });

            if (error) console.error('Error fetching announcements:', error);
            else setAnnouncements(data);
        };

        fetchAnnouncements();
    }, []);

    // Add Announcement
    const addAnnouncement = async () => {
        if (!newAnnouncement.title.trim() || !newAnnouncement.description.trim()) {
            alert("Title and description cannot be empty.");
            return;
        }

        const { data, error } = await supabase
            .from('announcements')
            .insert([
                {
                    title: newAnnouncement.title,
                    description: newAnnouncement.description,
                    time: new Date().toISOString(),
                    status: 'Active',
                    staff_id: session?.user?.id
                }
            ])
            .select();

        if (error) {
            console.error('Error adding announcement:', error);
        } else {
            setAnnouncements([data[0], ...announcements]);
            setNewAnnouncement({ title: '', description: '' });
            setShowForm(false);
        }
    };

    // Edit Announcement
    const startEditing = (announcement) => {
        setEditingId(announcement.announcement_id);
        setEditedAnnouncement({ title: announcement.title, description: announcement.description });
    };

    // Save Edited Announcement
    const saveEditedAnnouncement = async (id) => {
        if (!editedAnnouncement.title.trim() || !editedAnnouncement.description.trim()) {
            alert("Title and description cannot be empty.");
            return;
        }

        const { data, error } = await supabase
            .from('announcements')
            .update({
                title: editedAnnouncement.title,
                description: editedAnnouncement.description
            })
            .eq('announcement_id', id)
            .select();

        if (error) {
            console.error('Error updating announcement:', error);
        } else {
            setAnnouncements(
                announcements.map((a) =>
                    a.announcement_id === id ? { ...a, ...editedAnnouncement } : a
                )
            );
            setEditingId(null);
        }
    };

    return (
        <div className="announcement-container">
            <nav className="navbar">
                <div className="nav-logo-container">
                    <img src={LogoImage} alt="Logo" className="nav-logo" />
                    <h2 className="nav-title">The Strong Tower Christian Academy</h2>
                </div>
                <div className="nav-links">
                    <a href="/" className="nav-link">Home</a>
                    <Link to="/lib" className="nav-link">Books</Link>
                    <Link to="#" className="nav-link active">Announcements</Link>
                    {session && (
                        <>
                            <Link to="/equipment" className="nav-link">Equipment</Link>
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
                <div className="announcements-section">
                    <h1 className="announcements-title">Announcements</h1>s

                    {/* Add Announcement Button */}
                    {session && isAdmin && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="add-announcement-toggle"
                        >
                            {showForm ? "Cancel" : "+ Add Announcement"}
                        </button>
                    )}

                    {/* Show Add Announcement Form */}
                    {showForm && (
                        <div className="add-announcement-form">
                            <input
                                type="text"
                                placeholder="Title"
                                value={newAnnouncement.title}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                            />
                            <textarea
                                placeholder="Description"
                                value={newAnnouncement.description}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                            />
                            <button onClick={addAnnouncement} className="add-announcement-button">
                                Submit
                            </button>
                        </div>
                    )}

                    {/* Display Announcements */}
                    <div className="announcements-list">
                        {announcements.map((announcement) => (
                            <div className="announcement-item" key={announcement.announcement_id}>
                                <div className="announcement-date">
                                    <div className="date-month">{new Date(announcement.time).toDateString()}</div>
                                </div>
                                <div className="announcement-content">
                                    {editingId === announcement.announcement_id ? (
                                        // Edit Mode
                                        <div className="edit-form">
                                            <input
                                                type="text"
                                                value={editedAnnouncement.title}
                                                onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, title: e.target.value })}
                                            />
                                            <textarea
                                                value={editedAnnouncement.description}
                                                onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, description: e.target.value })}
                                            />
                                            <button onClick={() => saveEditedAnnouncement(announcement.announcement_id)}>
                                                Save
                                            </button>
                                            <button onClick={() => setEditingId(null)}>Cancel</button>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <>
                                            <h3 className="announcement-title">{announcement.title}</h3>
                                            <p className="announcement-description">{announcement.description}</p>
                                        </>
                                    )}
                                </div>
                                {session && isAdmin && (
                                    <button
                                        className="edit-button"
                                        onClick={() => startEditing(announcement)}
                                    >
                                        <FaEdit />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Announcements;
