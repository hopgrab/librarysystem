import React, { useState } from 'react';
import './css/BooksPage.css';
import LogoImage from '../assets/Logo.jpg';
import { FaSearch, FaBook } from 'react-icons/fa';

const BooksPageStu = () => {
    const [activeTab, setActiveTab] = useState('Books');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Sample book data
    const books = [
        {
            id: 1,
            title: 'Introduction to Physics',
            author: 'Robert Smith',
            genre: 'Science',
            status: 'Available',
            image: 'https://via.placeholder.com/150x200'
        },
        {
            id: 2,
            title: 'Advanced Calculus',
            author: 'John Williams',
            genre: 'Mathematics',
            status: 'Borrowed',
            image: 'https://via.placeholder.com/150x200'
        },
        {
            id: 3,
            title: 'English Grammar Guide',
            author: 'Elizabeth Taylor',
            genre: 'English',
            status: 'Available',
            image: 'https://via.placeholder.com/150x200'
        },
        {
            id: 4,
            title: 'World War II: A History',
            author: 'Michael Johnson',
            genre: 'History',
            status: 'Not for borrowing',
            image: 'https://via.placeholder.com/150x200'
        },
        {
            id: 5,
            title: 'The Great Adventure',
            author: 'Sarah Collins',
            genre: 'Fiction',
            status: 'Available',
            image: 'https://via.placeholder.com/150x200'
        },
        {
            id: 6,
            title: 'Autobiography of Benjamin Franklin',
            author: 'Benjamin Franklin',
            genre: 'Non-fiction',
            status: 'Missing',
            image: 'https://via.placeholder.com/150x200'
        },
    ];

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
            <nav className="navbar">
                <div className="nav-logo-container">
                    <img src={LogoImage} alt="Logo" className="nav-logo" />
                    <h2 className="nav-title">The Strong Tower Christian Academy</h2>
                </div>
                <div className="nav-links">
                    <a href="#" className="nav-link">Home</a>
                    <a href="#" className="nav-link active">Books</a>
                    <a href="#" className="nav-link">Equipment</a>
                    <a href="#" className="nav-link">Management</a>
                    <a href="#" className="login-button">Login</a>
                </div>
            </nav>

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
                        
                    </div>
                </div>
            </div>
            
            <div className="books-grid">
                {books.map(book => (
                    <div className="book-card" key={book.id}>
                        <div className="book-image-container">
                            <img src={book.image} alt={book.title} className="book-image" />
                        </div>
                        <div className="book-details">
                            <div className="book-info">
                                <div className="book-title">{book.title}</div>
                                <br />
                                <div className="book-author">By: {book.author}</div>
                            </div>
                            <div className="book-meta">
                                <span className="book-genre">{book.genre}</span>
                                <span 
                                    className="book-status"
                                    style={{ backgroundColor: getStatusColor(book.status) }}
                                >
                                    {book.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default BooksPageStu;