import React, { useState, useEffect } from 'react';
import './css/Library.css';
import LogoImage from '../assets/Logo.jpg';
import { FaSearch, FaBook } from 'react-icons/fa';

// Backend
import supabase from '../../backend/supabase-client';
import handleLogout from '../../backend/auth'; 
import { Link } from 'react-router-dom'; 
import useAuth from './hooks/useAuth';

import BookBorrowingImage from '../assets/book_borrowing.jpg';
import AddBookImage from '../assets/add_book.jpg';

import NavBar from "./Nav";

const Library = () => {
    const { session, isAdmin } = useAuth();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const forms = [
        {
            id: 'form1',
            title: 'Book Borrowing Form',
            description: 'Submit this form to borrow a book from the library.',
            link: '/borrow-book',
            image: BookBorrowingImage
        },
        {
            id: 'form3',
            title: 'Add Book Form',
            description: 'Add new books to the library\'s inventory.',
            link: '/add-book',
            image: AddBookImage
        }
    ];    

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
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
                        copies_total,
                        copies_available,
                        remarks,
                        image
                    )
                `);
    
                if (error) throw error;
    
                const formattedBooks = data.map(book => ({
                    id: book.book_id,
                    title: book.title,
                    author: book.author,
                    genre: book.genre,
                    category: book.category,
                    status: book.status,
                    description: book.items?.description,
                    copies_total: book.items?.copies_total,
                    copies_available: book.items?.copies_available,
                    remarks: book.items?.remarks,
                    image: book.items?.image || 'https://via.placeholder.com/150x200'
                }));
    
                setBooks(formattedBooks);
            } catch (err) {
                setError('Failed to fetch books.');
                console.error('Error fetching books:', err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchBooks();
    }, []);    

    const [activeTab, setActiveTab] = useState('Books');
    const [searchQuery, setSearchQuery] = useState('');

    //searching
    const filteredBooks = books.filter(book => {
        if (activeTab === 'Borrowed Books') {
            return book.status === 'Borrowed';
        }
        if (activeTab === 'Reserved') {
            return book.status === 'Reserved';
        }
        return (session || book.status !== 'Archived') && (
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.status.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'Available':
                return '#2a8c63';
            case 'Borrowed':
                return '#f59e0b';
            case 'Not for borrowing':
                return '#6b7280';
            case 'Missing':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    return (
        <div className="books-container"> 
            <NavBar/>

            <div className="dashboard">
                <h2 className="dashboard-title">Dashboard</h2>
                <div className="dashboard-controls">
                    <div className="search-container">
                        <input 
                            type="text" 
                            placeholder="Search..." 
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
                            className={`tab-button ${activeTab === 'Books' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Books')}
                        >
                            <FaBook />
                            Books
                        </button>
                            <button 
                                className={`tab-button ${activeTab === 'Borrowed Books' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Borrowed Books')}
                            >
                                Borrowed Books
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'Reserved' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Reserved')}
                            >
                                Reserved
                            </button>
                        {session && (
                            <>
                                <button 
                                    className={`tab-button ${activeTab === 'Forms' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('Forms')}
                                >
                                    Forms
                                </button>
                                <Link to="/pending-reservations">
                                    <button className="tab-button">Reservation List</button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {loading && <p>Loading books...</p>}
            {error && <p className="error">{error}</p>}

            {activeTab !== 'Forms' && (
                <div className="books-grid">
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map(book => (
                            <Link to={`/book/${book.id}`} key={book.id} className="book-link">
                                <div className="book-card">
                                    <div className="book-image-container">
                                        <img src={book.image} alt={book.title} className="book-image" />
                                    </div>
                                    <div className="book-details">
                                        <div className="book-info">
                                            <div className="book-title">{book.title}</div>
                                        </div>
                                        <div className="book-meta">
                                            <span className="book-genre">{book.category}</span>
                                            <span 
                                                className="book-status"
                                                style={{ backgroundColor: getStatusColor(book.status) }}
                                            >
                                                {book.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="no-books-message">
                            📚 No books found. Try searching for another title or category.
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'Forms' && (
                <div className="books-grid">
                    {forms.map(form => (
                        <div className="book-card" key={form.id}>
                            <div className="book-image-container">
                                <img src={form.image} alt={form.title} className="book-image" />
                            </div>
                            <div className="book-details">
                                <div className="book-info">
                                    <div className="book-title">{form.title}</div>
                                    <br />
                                    <div className="book-author">{form.description}</div>
                                </div>
                                <div className="book-meta">
                                    <Link to={form.link} className="login-button">
                                        Open Form
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Library;
