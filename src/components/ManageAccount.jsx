import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../backend/supabase-client';
import './css/ManageAccount.css';
import useAuth from './hooks/useAuth';

const ManageAccount = () => {
    const { session, isAdmin } = useAuth();
    const [unauthorizedWarning, setUnauthorizedWarning] = useState(false);

    useEffect(() => {
        if (session !== null && isAdmin === false) {
            setUnauthorizedWarning(true);
        }
    }, [session, isAdmin]);

    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newFirstName, setNewFirstName] = useState('');
    const [newMiddleName, setNewMiddleName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newContactNum, setNewContactNum] = useState('');
    const [newRole, setNewRole] = useState('Staff');
    const [newStatus, setNewStatus] = useState('Active');

    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('staff')
                    .select('staff_id, email, is_admin, status');

                if (error) throw error;

                setAccounts(data);
                setFilteredAccounts(data);
            } catch (err) {
                setError('Failed to fetch accounts.');
                console.error('Error fetching accounts:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const handleCreateAccount = async () => {
        const trimmedEmail = newEmail.trim();
        const trimmedPassword = newPassword.trim();
        const trimmedFirstName = newFirstName.trim();
        const trimmedMiddleName = newMiddleName.trim();
        const trimmedLastName = newLastName.trim();
        const trimmedContactNum = newContactNum.trim();

        if (!trimmedEmail || !trimmedPassword || !trimmedFirstName || !trimmedLastName || !trimmedContactNum) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            // Step 1: Create user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: trimmedEmail,
                password: trimmedPassword
            });

            if (authError) throw authError;

            const userId = authData.user.id; // Get user_id from Supabase Auth

            // Step 2: Insert user into `users` table
            const { error: userError } = await supabase
                .from('users')
                .insert([
                    {
                        user_id: userId,
                        first_name: trimmedFirstName,
                        middle_name: trimmedMiddleName || null, // Allow null
                        last_name: trimmedLastName,
                        contact_num: trimmedContactNum
                    }
                ]);

            if (userError) throw userError;

            // Step 3: Insert user into `staff` table
            const { error: staffError } = await supabase
                .from('staff')
                .insert([
                    {
                        staff_id: userId,
                        email: trimmedEmail,
                        is_admin: newRole === 'Admin',
                        status: newStatus
                    }
                ]);

            if (staffError) throw staffError;

            // Refresh account list
            setAccounts(prev => [
                ...prev,
                {
                    staff_id: userId,
                    email: trimmedEmail,
                    is_admin: newRole === 'Admin',
                    status: newStatus
                }
            ]);

            // Clear form
            setNewEmail('');
            setNewPassword('');
            setNewFirstName('');
            setNewMiddleName('');
            setNewLastName('');
            setNewContactNum('');
            setNewRole('Staff');
            setNewStatus('Active');
            setShowCreateForm(false);
        } catch (err) {
            console.error('Error creating account:', err.message);
        }
    };

    const filterByStatus = (e) => {
        const selectedStatus = e.target.value;
        setStatusFilter(selectedStatus);

        setFilteredAccounts(
            selectedStatus === 'all'
                ? accounts
                : accounts.filter(account => account.status === selectedStatus)
        );
    };

    return (
        <div className="manage-account-container">
            {unauthorizedWarning && (
                <div className="unauthorized-warning">
                    ⚠️ Unauthorized: You do not have permission to manage accounts.
                </div>
            )}

            <h2 className="account-title">Manage Accounts</h2>

            {loading && <p>Loading accounts...</p>}
            {error && <p className="error">{error}</p>}

            <div className="filter-controls">
                <label>Show:</label>
                <select value={statusFilter} onChange={filterByStatus}>
                    <option value="all">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            {isAdmin && (
                <div className="admin-actions">
                    {!showCreateForm ? (
                        <button className="new-account-button" onClick={() => setShowCreateForm(true)}>
                            + New Account
                        </button>
                    ) : (
                        <div className="create-account">
                            <h3>Create New Account</h3>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={newFirstName}
                                onChange={(e) => setNewFirstName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Middle Name (Optional)"
                                value={newMiddleName}
                                onChange={(e) => setNewMiddleName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={newLastName}
                                onChange={(e) => setNewLastName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Contact Number"
                                value={newContactNum}
                                onChange={(e) => setNewContactNum(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                                <option value="Staff">Staff</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <div className="create-account-buttons">
                                <button onClick={handleCreateAccount}>Create</button>
                                <button className="cancel-button" onClick={() => setShowCreateForm(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {filteredAccounts.length > 0 ? (
                <table className="account-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAccounts.map(account => (
                            <tr key={account.staff_id}>
                                <td>{account.email}</td>
                                <td>{account.is_admin ? "Admin" : "Staff"}</td>
                                <td>{account.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No accounts found.</p>
            )}

            <div className="back-button-container">
                <Link to="/">
                    <button className="back-button">Home</button>
                </Link>
            </div>
        </div>
    );
};

export default ManageAccount;
