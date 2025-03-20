import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../backend/supabase-client';
import './css/Book.css';
import LogoImage from '../assets/Logo.jpg';
import BookCoverPlaceholder from '../assets/BookCoverPlaceholder.jpg';

import useAuth from './hooks/useAuth';
import { Link } from 'react-router-dom';
import handleLogout from '../../backend/auth';
import Modal from "./Modal";

import NavBar from "./Nav";

const Book = () => {
    const { session, isAdmin } = useAuth();
    const { id } = useParams();
    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', author: '', category: '', description: '' });

    //For reservation
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reserver, setReserver] = useState({ firstName: "", lastName: "" });
    

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const { data, error } = await supabase
                    .from('books')
                    .select(`
                        book_id,
                        title,
                        author,
                        category,
                        status,
                        items:items (
                            description,
                            image,
                            copies_available,
                            copies_total
                        )
                    `)
                    .eq('book_id', id)
                    .single();

                if (error) throw error;

                setBookData({
                    ...data,
                    coverImage: data.items?.image || BookCoverPlaceholder,
                    copiesAvailable: data.items?.copies_available,
                    copiesTotal: data.items?.copies_total
                });

                setEditForm({
                    title: data.title || '',
                    author: data.author || '',
                    category: data.category || '',
                    description: data.items?.description || ''
                });
            } catch (err) {
                setError('Failed to fetch book details.');
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    //Reservation Button Functionalities
    const handleReserveClick = () => {
        setIsModalOpen(true);
    };

    const handleReserveSubmit = async () => {
        if (!reserver.firstName || !reserver.lastName) {
            setError("Please fill in both fields.");
            return;
        }

        try {
            const { error } = await supabase.from("reservations").insert([
                {
                    book_id: id,
                    reserver_fn: reserver.firstName,
                    reserver_ln: reserver.lastName,
                    reservation_time: new Date().toISOString(),
                    status: "Pending",
                },
            ]);

            if (error) throw error;

            alert("Reservation submitted successfully!");
            setIsModalOpen(false);
            setReserver({ firstName: "", lastName: "" });
        } catch (err) {
            setError("Failed to reserve the book.");
            console.error(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const { error: bookError } = await supabase
                .from('books')
                .update({
                    title: editForm.title,
                    author: editForm.author,
                    category: editForm.category
                })
                .eq('book_id', id);

            const { error: itemsError } = await supabase
                .from('items')
                .update({ description: editForm.description })
                .eq('item_id', id);

            if (bookError || itemsError) throw bookError || itemsError;

            setBookData({ ...bookData, ...editForm });
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update book details.');
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const archiveBook = async () => {
        try {
            setLoading(true);
            
            // Toggle between "Archived" and "Available"
            const newStatus = bookData.status === 'Archived' ? 'Available' : 'Archived';
    
            const { error } = await supabase
                .from('books')
                .update({ status: newStatus })
                .eq('book_id', id);
    
            if (error) throw error;
    
            // Update local state to reflect the change
            setBookData((prevData) => ({ ...prevData, status: newStatus }));
        } catch (err) {
            setError('Failed to update book status.');
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="announcement-container">
            <NavBar/>

            <div className="book-container">
                <div className="book-details">
                    <div className="book-cover">
                        <img src={bookData.coverImage} alt={`${bookData.title} cover`} className="cover-image" />
                    </div>

                    <div className="book-info">
                        {isEditing ? (
                            <div className="edit-form">
                                <input type="text" name="title" value={editForm.title} onChange={handleEditChange} />
                                <input type="text" name="author" value={editForm.author} onChange={handleEditChange} />
                                <input type="text" name="category" value={editForm.category} onChange={handleEditChange} />
                                <textarea name="description" value={editForm.description} onChange={handleEditChange} />
                                <button onClick={handleSave} className="save-button">Save</button>
                                <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
                            </div>
                        ) : (
                            <>
                                <h1 className="book-title">{bookData.title}</h1>
                                <p className="book-author">By {bookData.author}</p>
                                <div className={`book-status ${bookData.status.toLowerCase()}`}>
                                    {bookData.status} ({bookData.copiesAvailable}/{bookData.copiesTotal})
                                </div>
                                <p className="book-synopsis">{bookData.items?.description || 'No synopsis available.'}</p>
                            </>
                        )}

                        <div className="book-actions">
                            {session && isAdmin && (
                                <>
                                    {isEditing ? null : (
                                        <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
                                    )}
                                    <button 
                                        className="archive-button" 
                                        onClick={archiveBook}
                                    >
                                        {bookData.status === 'Archived' ? "Unarchive" : "Archive"}
                                    </button>
                                </>
                            )}
                            {!session && (
                                <>
                                    <button
                                        className="reserve-button"
                                        onClick={handleReserveClick}
                                        disabled={bookData.copiesAvailable === 0}
                                    >
                                        Reserve
                                    </button>

                                    {isModalOpen && (
                                        <Modal
                                            onClose={() => setIsModalOpen(false)}
                                            onSubmit={handleReserveSubmit}
                                            reserver={reserver}
                                            setReserver={setReserver}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="back-button-container">
                <button className="back-button" onClick={() => window.history.back()}>&larr; Back</button>
            </div>
        </div>
    );
};

export default Book;
