// Pages
import Home from './components/Home';
import Login from './components/Login';
import Announcements from './components/Announcements';
import Library from './components/Library';
import Book from './components/Book';
import Equipment from './components/Equipment';
import AddBookForm from './components/AddBookForm';
import ReservationList from './components/ReservationList';
import BorrowBookForm from './components/BorrowingBookForm';
import ManageAccount from './components/ManageAccount';
import AddEquipmentForm from './components/AddEquipmentForm'; //

// For routing and backend
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import supabase from '../backend/supabase-client';


function App() {
  // Login Persistence
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
        const { data: session, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Error fetching session:', error);
        }

        setSession(session);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Links Routing
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lib" element={<Library />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/book/:id" element={<Book />} />
        <Route path="/add-book" element={<AddBookForm />} />
        <Route path="/pending-reservations" element={<ReservationList />} />
        <Route path="/borrow-book" element={<BorrowBookForm />} />
        <Route path="/manage-account" element={<ManageAccount />} />
        <Route path="/add-equipment" element={<AddEquipmentForm />} /> 
      </Routes>
    </Router>
  );
}

export default App;
