import LogoImage from "../assets/Logo.jpg";
import handleLogout from "../../backend/auth";
import { Link } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { useState } from "react";

import "./css/NavStyle.css";

function NavBar() {
  const { session, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-header">
        <div className="nav-logo-container">
          <Link to="/">
            <img src={LogoImage} alt="Logo" className="nav-logo" />
          </Link>
          <h2 className="nav-title">The Strong Tower Christian Academy</h2>
          <button className="hamburger" onClick={toggleMenu}>
            ☰
          </button>
        </div>
      </div>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/lib" className="nav-link">
          Books
        </Link>
        <Link to="/announcements" className="nav-link">
          Announcements
        </Link>
        {session && (
          <>
            <Link to="/equipment" className="nav-link">
              Equipment
            </Link>
            {isAdmin && (
              <Link to="/management" className="nav-link">
                Management
              </Link>
            )}
          </>
        )}
        {session ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" className="login-button">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
