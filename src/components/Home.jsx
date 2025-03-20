import React, { useState, useEffect } from "react";
import "./css/Home.css";
import LogoImage from "../assets/Logo.jpg";

// Backend
import supabase from "../../backend/supabase-client";
import handleLogout from "../../backend/auth";
import { Link } from "react-router-dom";
import useAuth from "./hooks/useAuth";

import NavBar from "./Nav";

const Home = () => {
  const { session, isAdmin } = useAuth();

  // State for storing fetched books
  const [newArrivals, setNewArrivals] = useState([]);
  const [newArrivalsIndex, setNewArrivalsIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(5);

  const placeholders = [
    { id: 101, title: "Placeholder Book 1", author: "Unknown" },
    { id: 102, title: "Placeholder Book 2", author: "Unknown" },
    { id: 103, title: "Placeholder Book 3", author: "Unknown" },
    { id: 104, title: "Placeholder Book 4", author: "Unknown" },
    { id: 105, title: "Placeholder Book 5", author: "Unknown" },
    { id: 106, title: "Placeholder Book 6", author: "Unknown" },
    { id: 107, title: "Placeholder Book 7", author: "Unknown" },
    { id: 108, title: "Placeholder Book 8", author: "Unknown" },
    { id: 109, title: "Placeholder Book 9", author: "Unknown" },
    { id: 110, title: "Placeholder Book 10", author: "Unknown" },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from("books")
        .select(
          `
          book_id, 
          title, 
          author, 
          items(image)
        `
        )
        .order("date_added", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching books:", error);
      } else {
        const formattedBooks = data.map((book) => ({
          book_id: book.book_id,
          title: book.title,
          author: book.author,
          image: book.items ? book.items.image : null,
        }));

        const filledBooks = [
          ...formattedBooks,
          ...placeholders.slice(formattedBooks.length),
        ];
        setNewArrivals(filledBooks);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setItemsToShow(window.innerWidth <= 950 ? 3 : 5);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("time", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching announcements:", error);
      } else {
        setAnnouncements(data);
      }
    };

    fetchAnnouncements();
  }, []);

  // Carousel navigation
  const nextNewArrivals = () => {
    setNewArrivalsIndex((prev) =>
      prev + itemsToShow >= newArrivals.length ? 0 : prev + 1
    );
  };

  const prevNewArrivals = () => {
    setNewArrivalsIndex((prev) =>
      prev === 0 ? Math.max(0, newArrivals.length - itemsToShow) : prev - 1
    );
  };

  // Get items to display in carousel
  const displayedNewArrivals = [];
  for (let i = 0; i < itemsToShow; i++) {
    const newArrivalIndex = (newArrivalsIndex + i) % newArrivals.length;
    displayedNewArrivals.push(newArrivals[newArrivalIndex]);
  }

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <NavBar />

      <div className="content-wrapper">
        <div className="main-content">
          {/* New Arrivals Section */}
          <section className="carousel-section">
            <div className="section-header">
              <h2 className="section-title" style={{ marginTop: "50px" }}>
                New Arrivals
              </h2>
            </div>

            <div className="carousel-container">
              <button className="carousel-nav prev" onClick={prevNewArrivals}>
                &#10094;
              </button>

              <div className="new-arrivals-list">
                {displayedNewArrivals.map(
                  (item) =>
                    item && (
                      <Link
                        key={item.book_id || item.id}
                        to={`/book/${item.book_id || item.id}`}
                        className="carousel-card-link"
                      >
                        <div
                          key={item.book_id || item.id}
                          className="carousel-card"
                        >
                          <div className="card-image">
                            {item.image ? (
                              <img src={item.image} alt={item.title} />
                            ) : (
                              <div className="placeholder">No Image</div>
                            )}
                          </div>
                          <div className="card-details">
                            <h3>{item.title}</h3>
                            <p>{item.author}</p>
                          </div>
                        </div>
                      </Link>
                    )
                )}
              </div>

              <button className="carousel-nav next" onClick={nextNewArrivals}>
                &#10095;
              </button>
            </div>
          </section>

          {/* Announcements Section */}
          <section className="announcements-section">
            <div className="section-header">
              <h2 className="section-title">Announcements</h2>
            </div>

            <div className="announcements-container">
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <div key={announcement.id} className="announcement-card">
                    <div className="announcement-date">
                      {new Date(announcement.time).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                    <h3 className="announcement-title">{announcement.title}</h3>
                    <p className="announcement-content">
                      {announcement.content}
                    </p>
                  </div>
                ))
              ) : (
                <p>No announcements available.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
