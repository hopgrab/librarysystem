import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../backend/supabase-client";
import useAuth from "./hooks/useAuth";
import './css/AddEquipmentForm.css';

const AddEquipmentForm = () => {
    const { session } = useAuth();
    const navigate = useNavigate();

    const [equipmentData, setEquipmentData] = useState({
        name: "",
        description: "",
        copies_total: 0, // ✅ Added copies_total with default value
        status: "Available",
        image: null,
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!session) {
        return <p>Access Denied. You need to be logged in to add equipment.</p>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEquipmentData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        setEquipmentData((prevData) => ({ ...prevData, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        let imageUrl = "https://via.placeholder.com/150x200"; // ✅ Default placeholder image

        // Upload image if provided
        if (equipmentData.image) {
            const fileExt = equipmentData.image.name.split(".").pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `images/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from("images")
                .upload(filePath, equipmentData.image);

            if (uploadError) {
                console.error("Error uploading image:", uploadError.message);
                setError("Failed to upload image.");
                setLoading(false);
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from("images")
                .getPublicUrl(filePath);

            imageUrl = publicUrlData.publicUrl;
        }

        const validStatuses = ["Available", "Unavailable", "For Repair", "Lost", "In Maintenance"];

        // Validate status before inserting
        if (!validStatuses.includes(equipmentData.status)) {
            setError("Invalid status selected. Please choose a valid status.");
            setLoading(false);
            return;
        }

        // ✅ Insert into `items` table
        const { data: itemData, error: itemError } = await supabase
            .from("items")
            .insert([
                {
                    item_type: "equipment", // ✅ Correct item_type
                    description: equipmentData.description,
                    copies_total: equipmentData.copies_total, // ✅ Copies included
                    copies_available: equipmentData.copies_total, // ✅ Initially set equal to total
                    remarks: "", // ✅ Optional remarks field
                    image: imageUrl, // ✅ Image URL or placeholder
                },
            ])
            .select();

        if (itemError) {
            console.error("Error adding item:", itemError.message);
            setError("Failed to add item.");
            setLoading(false);
            return;
        }

        // ✅ Check if `itemData` is returned properly
        if (!itemData || itemData.length === 0) {
            setError("Failed to retrieve item ID.");
            setLoading(false);
            return;
        }

        // ✅ Insert into `equipment` table
        const { error: equipmentError } = await supabase
            .from("equipment")
            .insert([
                {
                    equipment_name: equipmentData.name,
                    status: equipmentData.status, // ✅ Validated status
                    equipment_id: itemData[0].item_id, // ✅ Linking to item_id from items
                },
            ]);

        if (equipmentError) {
            console.error("Error adding equipment:", equipmentError.message);
            setError("Failed to add equipment.");
        } else {
            alert("Equipment added successfully!");
            navigate("/equipment");
        }

        setLoading(false);
    };

    return (
        <div className="form-container">
            <h2>Add New Equipment</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Equipment Name"
                    value={equipmentData.name}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={equipmentData.description}
                    onChange={handleChange}
                    required
                ></textarea>

                <input
                    type="number"
                    name="copies_total"
                    placeholder="Total Copies"
                    value={equipmentData.copies_total}
                    onChange={handleChange}
                    min="1"
                    required
                />

                <select name="status" value={equipmentData.status} onChange={handleChange}>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="For Repair">For Repair</option>
                    <option value="Lost">Lost</option>
                    <option value="In Maintenance">In Maintenance</option>
                </select>

                {/* Image Upload Field */}
                <input type="file" name="image" accept="image/*" onChange={handleFileChange} />

                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Equipment"}
                </button>
            </form>
        </div>
    );
};

export default AddEquipmentForm;
