import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../backend/supabase-client';
import './css/ReservationList.css';

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortOrder, setSortOrder] = useState('oldest');
    const [filterDate, setFilterDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleCheckOut = async (reservationId, bookId, itemId, reserverFn, reserverLn) => {
        try {
            const { data: { user }, error: sessionError } = await supabase.auth.getUser();
            if (sessionError) throw sessionError;
            if (!user) throw new Error("No logged-in user found");
    
            const staffId = user.id;  
    
            // Update reservation status to "Checked Out"
            const { error: reservationError } = await supabase
                .from('reservations')
                .update({ status: 'Checked Out' })
                .eq('reservation_id', reservationId);
    
            if (reservationError) throw reservationError;
    
            // Insert a new transaction log entry
            const { error: logError } = await supabase
                .from('item_transactions_log')
                .insert([
                    {
                        staff_id: staffId,
                        item_id: itemId,   
                        action: 'Check Out',
                        recipient_fn: reserverFn,
                        recipient_ln: reserverLn
                    }
                ]);
    
            if (logError) throw logError;
    
            // **Update UI State Properly**
            setReservations(prev =>
                prev.map(reservation =>
                    reservation.reservation_id === reservationId
                        ? { 
                            ...reservation, 
                            status: 'Checked Out',
                            books: {
                                ...reservation.books,
                                items: {
                                    ...reservation.books.items,
                                    copies_available: newCopiesAvailable // Update the available copies
                                }
                            }
                        }
                        : reservation
                )
            );
    
        } catch (err) {
            console.error('Error checking out reservation:', err.message);
        }
    };
    

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('reservations')
                    .select(`
                        reservation_id,
                        reserver_fn,
                        reserver_ln,
                        reservation_time,
                        book_id,
                        status,
                        books (
                            title,
                            author,
                            category,
                            items (image, copies_available)
                        )
                    `);

                if (error) throw error;

                setReservations(data);
                setFilteredReservations(data);
            } catch (err) {
                setError('Failed to fetch reservations.');
                console.error('Error fetching reservations:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const handleApprove = async (reservationId, bookId, itemId) => {
        try {
            // Fetch the current available copies
            const { data: itemData, error: fetchError } = await supabase
                .from('items')
                .select('copies_available')
                .eq('item_id', itemId)
                .single();
    
            if (fetchError) throw fetchError;
    
            if (itemData.copies_available <= 0) {
                console.error("No copies available for reservation.");
                return;
            }
    
            const newCopiesAvailable = Math.max(0, itemData.copies_available - 1);
    
            // Update the items table
            const { error: itemError } = await supabase
                .from('items')
                .update({ copies_available: newCopiesAvailable })
                .eq('item_id', itemId);
    
            if (itemError) throw itemError;
    
            // Update reservation status
            const { error: reservationError } = await supabase
                .from('reservations')
                .update({ status: 'Accepted' })
                .eq('reservation_id', reservationId);
    
            if (reservationError) throw reservationError;
    
            // Update book status
            const { error: bookError } = await supabase
                .from('books')
                .update({ status: 'Reserved' })
                .eq('book_id', bookId);
    
            if (bookError) throw bookError;
    
            // **Update state properly**
            setReservations(prev => {
                const updatedReservations = prev.map(reservation =>
                    reservation.reservation_id === reservationId
                        ? { 
                            ...reservation, 
                            status: 'Accepted',
                            books: {
                                ...reservation.books,
                                items: {
                                    ...reservation.books.items,
                                    copies_available: newCopiesAvailable
                                }
                            }
                        }
                        : reservation
                );
                setFilteredReservations(updatedReservations);  
                return updatedReservations;
            });
    
        } catch (err) {
            console.error('Error approving reservation:', err.message);
        }
    };    

    const handleDeny = async (reservationId) => {
        try {
            const { error } = await supabase
                .from('reservations')
                .update({ status: 'Denied' })
                .eq('reservation_id', reservationId);
            
            if (error) throw error;
    
            // **Update UI State Properly**
            setReservations(prev =>
                prev.map(reservation =>
                    reservation.reservation_id === reservationId
                        ? { ...reservation, status: 'Denied' }
                        : reservation
                )
            );
    
        } catch (err) {
            console.error('Error denying reservation:', err.message);
        }
    };
    
    const toggleSort = () => {
        const newOrder = sortOrder === 'oldest' ? 'newest' : 'oldest';
        setSortOrder(newOrder);

        setFilteredReservations(prev =>
            [...prev].sort((a, b) => {
                return newOrder === 'oldest'
                    ? new Date(a.reservation_time) - new Date(b.reservation_time)
                    : new Date(b.reservation_time) - new Date(a.reservation_time);
            })
        );
    };

    const filterByDate = (e) => {
        const selectedDate = e.target.value;
        setFilterDate(selectedDate);

        setFilteredReservations(
            reservations.filter(reservation => 
                reservation.reservation_time.startsWith(selectedDate)
            )
        );
    };

    const filterByStatus = (e) => {
        const selectedStatus = e.target.value;
        setStatusFilter(selectedStatus);

        setFilteredReservations(
            selectedStatus === 'all'
                ? reservations
                : reservations.filter(reservation => reservation.status === selectedStatus)
        );
    };

    return (
        <div className="reservation-list-container">
            <h2 className="reservation-title">Reservation List</h2>

            {loading && <p>Loading reservations...</p>}
            {error && <p className="error">{error}</p>}

            <div className="filter-controls">
                <label>Filter by Date:</label>
                <input type="date" value={filterDate} onChange={filterByDate} />

                <button id="sort-button" onClick={toggleSort}>
                    Sort: {sortOrder === 'oldest' ? 'Oldest' : 'Newest'}
                </button>

                <label>Show:</label>
                <select value={statusFilter} onChange={filterByStatus}>
                    <option value="all">All</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Checked Out">Checked Out</option>
                    <option value="Denied">Denied</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>

            {filteredReservations.length > 0 ? (
                <table className="reservation-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Available Copies</th>
                        <th>Reserved By</th>
                        <th>Status</th>
                        <th>Time Reservation Made</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReservations.map(reservation => (
                        <tr key={reservation.reservation_id}>
                            <td>
                                <img 
                                    src={reservation.books?.items?.image || 'https://via.placeholder.com/80x100'} 
                                    alt={reservation.books?.title} 
                                    className="book-thumbnail"
                                />
                            </td>
                            <td>{reservation.books?.title}</td>
                            <td>{reservation.books?.author}</td>
                            <td>{reservation.books?.category}</td>
                            <td>{reservation.books?.items?.copies_available ?? "N/A"}</td> {/* Display copies_available */}
                            <td>{reservation.reserver_fn + " " + reservation.reserver_ln}</td>
                            <td>{reservation.status}</td>
                            <td>
                                {reservation.reservation_time 
                                    ? new Date(reservation.reservation_time).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit"
                                    }) 
                                    : "N/A"}
                            </td>
                            <td>
                                {reservation.status === 'Checked Out' || reservation.status === 'Denied' ? null : (
                                    reservation.status === 'Accepted' ? (
                                        <button 
                                            className="checkout-button"
                                            onClick={() => handleCheckOut(
                                                reservation.reservation_id, 
                                                reservation.book_id, 
                                                reservation.books?.items?.item_id, 
                                                reservation.reserver_fn, 
                                                reservation.reserver_ln
                                            )}
                                        >
                                            Check Out
                                        </button>
                                    ) : (
                                        <>
                                            <button 
                                                className="approve-button"
                                                onClick={() => handleApprove(reservation.reservation_id, reservation.book_id)}
                                                disabled={reservation.status === 'Accepted' || reservation.books?.items?.copies_available <= 0}
                                                style={{
                                                    backgroundColor: (reservation.status === 'Accepted' || reservation.books?.items?.copies_available <= 0) ? '#ccc' : '#4CAF50',
                                                    cursor: (reservation.status === 'Accepted' || reservation.books?.items?.copies_available <= 0) ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                className="deny-button"
                                                onClick={() => handleDeny(reservation.reservation_id)}
                                                disabled={reservation.status === 'Denied'}
                                                style={{
                                                    backgroundColor: reservation.status === 'Denied' ? '#ccc' : '#f44336',
                                                    cursor: reservation.status === 'Denied' ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                Deny
                                            </button>
                                        </>
                                    )
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            ) : (
                <p>No reservations found.</p>
            )}

            <div className="back-button-container">
                <Link to="/lib">
                    <button className="back-button">Back to Library</button>
                </Link>
            </div>
        </div>
    );
};

export default ReservationList;
