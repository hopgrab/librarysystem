import React, { useState } from 'react';
import './css/HomePage.css';
import LogoImage from '../assets/Logo.jpg';

const HomePage = () => {
  // Samp data for carousels and announcements
  const newArrivals = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: 3, title: '1984', author: 'George Orwell' },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen' },
    { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien' }
  ];
  
  const catalogue = [
    { id: 1, title: 'Mathematics Textbook', author: 'Grade 10' },
    { id: 2, title: 'Biology: The Living World', author: 'Grade 11' },
    { id: 3, title: 'History of Nations', author: 'Grade 9' },
    { id: 4, title: 'English Literature', author: 'Grade 12' },
    { id: 5, title: 'Computer Science Basics', author: 'Grade 10' }
  ];
  
  const announcements = [
    { 
      id: 1, 
      date: 'Feb 28, 2025', 
      title: 'Library System Update', 
      content: 'Our digital library system will undergo maintenance on Feb 28 from 10 PM - 12 AM.'
    },
    { 
      id: 2, 
      date: 'Feb 20, 2025', 
      title: 'New Arrivals: March Collection', 
      content: 'Exciting news! We\'ve added 50+ new books across fiction and non-fiction categories.'
    },
    { 
      id: 3, 
      date: 'Feb 15, 2025', 
      title: 'Reminder: Return Overdue Books', 
      content: 'Please return overdue books by Feb 18 to avoid late fees. Check your borrowed items list.'
    }
  ];

  // State for carousel index
  const [newArrivalsIndex, setNewArrivalsIndex] = useState(0);
  const [catalogueIndex, setCatalogueIndex] = useState(0);
  
  // Number of items to show in carousel
  const itemsToShow = 5;
  
  // Carousel navigation functions
  const nextNewArrivals = () => {
    setNewArrivalsIndex(prev => 
      prev + itemsToShow >= newArrivals.length ? 0 : prev + 1
    );
  };
  
  const prevNewArrivals = () => {
    setNewArrivalsIndex(prev => 
      prev === 0 ? Math.max(0, newArrivals.length - itemsToShow) : prev - 1
    );
  };
  
  const nextCatalogue = () => {
    setCatalogueIndex(prev => 
      prev + itemsToShow >= catalogue.length ? 0 : prev + 1
    );
  };
  
  const prevCatalogue = () => {
    setCatalogueIndex(prev => 
      prev === 0 ? Math.max(0, catalogue.length - itemsToShow) : prev - 1
    );
  };
  
  // Calculate which items to display in carousels
  const displayedNewArrivals = [];
  const displayedCatalogue = [];
  
  for (let i = 0; i < itemsToShow; i++) {
    const newArrivalIndex = (newArrivalsIndex + i) % newArrivals.length;
    const catalogueItemIndex = (catalogueIndex + i) % catalogue.length;
    
    displayedNewArrivals.push(newArrivals[newArrivalIndex]);
    displayedCatalogue.push(catalogue[catalogueItemIndex]);
  }

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-logo-container">
          <img src={LogoImage} alt="Logo" className="nav-logo" />
          <h2 className="nav-title">The Strong Tower Christian Academy</h2>
        </div>
        <div className="nav-links">
          <a href="#" className="nav-link active">Home</a>
          <a href="#" className="nav-link">Books</a>
          <a href="#" className="nav-link">Equipment</a>
          <a href="#" className="nav-link">Management</a>
          <a href="#" className="login-button">Login</a>
        </div>
      </nav>
      
      {/* Banner Image */}
      <div className="banner-container">
        <div className="banner-image"></div>
      </div>
      
      <div className="content-wrapper">
        <div className="main-content">
          {/* New Arrivals Section */}
          <section className="carousel-section">
            <div className="section-header">
              <h2 className="section-title" style={{ marginTop: '50px' }}>New Arrivals</h2>
              <a href="#" className="view-all">View All</a>
            </div>
            
            <div className="carousel-container">
              <button className="carousel-nav prev" onClick={prevNewArrivals}>
                &#10094;
              </button>
              
              <div className="carousel-items">
                {displayedNewArrivals.map(item => (
                  <div key={item.id} className="carousel-card">
                    <div className="card-image"></div>
                    <div className="card-details">
                      <h3>{item.title}</h3>
                      <p>{item.author}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="carousel-nav next" onClick={nextNewArrivals}>
                &#10095;
              </button>
            </div>
          </section>
          
          {/* Catalogue Section */}
          <section className="carousel-section">
            <div className="section-header">
              <h2 className="section-title">Catalogue</h2>
              <a href="#" className="view-all">View All</a>
            </div>
            
            <div className="carousel-container">
              <button className="carousel-nav prev" onClick={prevCatalogue}>
                &#10094;
              </button>
              
              <div className="carousel-items">
                {displayedCatalogue.map(item => (
                  <div key={item.id} className="carousel-card">
                    <div className="card-image"></div>
                    <div className="card-details">
                      <h3>{item.title}</h3>
                      <p>{item.author}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="carousel-nav next" onClick={nextCatalogue}>
                &#10095;
              </button>
            </div>
          </section>
          
          {/* Announcements Section */}
          <section className="announcements-section">
            <div className="section-header">
              <h2 className="section-title">Announcements</h2>
              <a href="#" className="view-all">View All</a>
            </div>
            
            <div className="announcements-container">
              {announcements.map(announcement => (
                <div key={announcement.id} className="announcement-card">
                  <div className="announcement-date">{announcement.date}</div>
                  <h3 className="announcement-title">{announcement.title}</h3>
                  <p className="announcement-content">{announcement.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;