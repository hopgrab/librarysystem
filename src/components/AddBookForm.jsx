import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../backend/supabase-client";
import useAuth from "./hooks/useAuth";

import "./css/FormStyle.css"

const AddBookForm = () => {
    const { session } = useAuth();
    const navigate = useNavigate();

    const [bookData, setBookData] = useState({
        title: "",
        author: "",
        category: "",
        status: "Available",
        description: "",
        copies_total: "",
        copies_available: "",
        remarks: "",
        image: null
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!session) {
        return <p>Access Denied. You need to be logged in to add books.</p>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        setBookData((prevData) => ({ ...prevData, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
    
        let imageUrl = "https://via.placeholder.com/150x200";
    
        if (bookData.image) {
            const fileExt = bookData.image.name.split(".").pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `images/${fileName}`;
    
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from("images")
                .upload(filePath, bookData.image);
    
            if (uploadError) {
                console.error("Error uploading image:", uploadError.message);
                setError("Failed to upload image.");
                setLoading(false);
                return;
            }
    
            imageUrl = `${supabase.storage.from("images").getPublicUrl(filePath).data.publicUrl}`;
        }
    
        const { data: itemData, error: itemError } = await supabase
            .from("items")
            .insert([
                {
                    item_type: "book",  // ✅ Explicitly setting item_type
                    description: bookData.description,
                    copies_total: bookData.copies_total,
                    copies_available: bookData.copies_available,
                    remarks: bookData.remarks,
                    image: imageUrl
                }
            ])
            .select();
    
        if (itemError) {
            console.error("Error adding item:", itemError.message);
            setError("Failed to add item.");
            setLoading(false);
            return;
        }
    
        const { data, error } = await supabase.from("books").insert([
            {
                title: bookData.title,
                author: bookData.author,
                category: bookData.category,
                status: bookData.status,
                book_id: itemData[0].item_id
            }
        ]);
    
        setLoading(false);
    
        if (error) {
            console.error("Error adding book:", error.message);
            setError("Failed to add book.");
        } else {
            alert("Book added successfully!");
            navigate("/lib");
        }
    };    

    return (
        <div className="form-container">
            <h2>Add a New Book</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Title" value={bookData.title} onChange={handleChange} required />
                <input type="text" name="author" placeholder="Author" value={bookData.author} onChange={handleChange} required />
                <input type="text" name="category" placeholder="Category" value={bookData.category} onChange={handleChange} required />
                <select name="status" value={bookData.status} onChange={handleChange}>
                    <option value="Available">Available</option>
                    <option value="Borrowed">Borrowed</option>
                    <option value="Not for borrowing">Not for borrowing</option>
                </select>
                <textarea name="description" placeholder="Description" value={bookData.description} onChange={handleChange}></textarea>
                <input type="number" name="copies_total" placeholder="Total Copies" value={bookData.copies_total} onChange={handleChange} required />
                <input type="number" name="copies_available" placeholder="Available Copies" value={bookData.copies_available} onChange={handleChange} required />
                <input type="text" name="remarks" placeholder="Remarks" value={bookData.remarks} onChange={handleChange} />
                
                {/* Image Upload Field */}
                <input type="file" name="image" accept="image/*" onChange={handleFileChange} />

                <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Book"}</button>
            </form>
        </div>
    );
};

export default AddBookForm;
