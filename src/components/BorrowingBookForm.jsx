import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../backend/supabase-client";
import "./css/BorrowingBookForm.css"

const BorrowBookForm = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);  // Store books for dropdown
    const [filteredBooks, setFilteredBooks] = useState([]); // Filtered for autocomplete
    const [formData, setFormData] = useState({
        recipient_fn: "",
        recipient_ln: "",
        book_id: "",
        action: "Borrow",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch books on component mount
    useEffect(() => {
        const fetchBooks = async () => {
            const { data, error } = await supabase
                .from("books")
                .select("book_id, title, status, items(copies_available)")
                .neq("status", "Archived");  // Exclude archived books

            if (error) {
                console.error("Error fetching books:", error.message);
                setError("Failed to load books.");
            } else {
                // Only show books that have copies available
                setBooks(data);
                setFilteredBooks(data.filter(book => book.items.copies_available > 0));
            }
        };
        fetchBooks();
    }, []);

    // Handle text input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle book search in dropdown, ensuring only available & non-archived books are shown
    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setFormData((prev) => ({ ...prev, book_id: searchValue }));
    
        // Ensure that only non-archived books are searched
        const filtered = books
            .filter((book) => book.status !== "Archived") // Exclude archived books
            .filter((book) => 
                book.title.toLowerCase().includes(searchValue) &&
                book.items.copies_available > 0
            );
    
        setFilteredBooks(filtered);
    };    

    // Handle selecting a book from the dropdown
    const handleSelectBook = (bookId) => {
        setFormData((prev) => ({ ...prev, book_id: bookId }));
        setFilteredBooks(books.filter(book => book.items.copies_available > 0)); // Reset dropdown options
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { recipient_fn, recipient_ln, book_id, action } = formData;

        // Fetch the authenticated user session
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            setError("User authentication failed.");
            setLoading(false);
            return;
        }

        // Fetch the latest book data to ensure it's still available
        const { data: selectedBook, error: fetchError } = await supabase
            .from("books")
            .select("book_id, status, items(copies_available)")
            .eq("book_id", book_id)
            .neq("status", "Archived")  // Ensure the book is not archived
            .single();

        if (fetchError || !selectedBook) {
            setError("Invalid book selection or failed to fetch latest data.");
            setLoading(false);
            return;
        }

        const { copies_available } = selectedBook.items;

        if (action === "Borrow" && copies_available <= 0) {
            setError("No copies available for borrowing.");
            setLoading(false);
            return;
        }

        try {
            // Log the transaction with user ID as staff_id
            const { error: logError } = await supabase
                .from("item_transactions_log")
                .insert([
                    {
                        staff_id: user.id,  // Authenticated user's ID
                        recipient_fn,
                        recipient_ln,
                        action,
                        datetime: new Date().toISOString(),
                        item_id: book_id,
                    },
                ]);

            if (logError) throw logError;

            // Update available copies if the action is "Borrow" or "Return"
            if (action === "Borrow" || action === "Return") {
                const newCopies =
                    action === "Borrow" ? copies_available - 1 : copies_available + 1;

                const { error: updateError } = await supabase
                    .from("items")
                    .update({ copies_available: newCopies })
                    .eq("item_id", book_id);

                if (updateError) throw updateError;
            }

            alert(`Book successfully ${action === "Borrow" ? "borrowed" : "returned"}!`);
            navigate("/lib");
        } catch (err) {
            console.error("Transaction error:", err.message);
            setError("Failed to complete the transaction.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Borrow or Return a Book</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="recipient_fn"
                    placeholder="First Name"
                    value={formData.recipient_fn}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="recipient_ln"
                    placeholder="Last Name"
                    value={formData.recipient_ln}
                    onChange={handleChange}
                    required
                />

                {/* Book Selection with Autocomplete */}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search Book Title"
                        value={formData.book_id}
                        onChange={handleSearch}
                        onBlur={() => setTimeout(() => setFilteredBooks([]), 200)} // Close on blur after delay
                        required
                    />
                    {filteredBooks.length > 0 && formData.book_id.trim() !== "" && (
                        <ul className="dropdown">
                            {filteredBooks.map((book) => (
                                <li key={book.book_id} onMouseDown={() => handleSelectBook(book.book_id)}>
                                    {book.title} (Available: {book.items.copies_available})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Action Selection */}
                <select name="action" value={formData.action} onChange={handleChange}>
                    <option value="Borrow">Borrow</option>
                    <option value="Return">Return</option>
                </select>

                <button type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default BorrowBookForm;
