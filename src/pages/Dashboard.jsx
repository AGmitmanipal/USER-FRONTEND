import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            // Navigation to login will be handled by the protected route or auth state change
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const fetchPendingUsers = async () => {
        if (!currentUser) return;
        const token = await currentUser.getIdToken();
        try {
            const res = await axios.get(`${import.meta.env.VITE_ZONES_API_BASE_URL}/api/admin/pending-users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingUsers(res.data);
        } catch (err) {
            console.error(err);
            alert('Error fetching pending users');
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, [currentUser]);

    const handleApprove = async (uid) => {
        const token = await currentUser.getIdToken();
        try {
            await axios.patch(`${import.meta.env.VITE_ZONES_API_BASE_URL}/api/admin/approve-user/${uid}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPendingUsers(); // Refresh
        } catch (err) {
            alert('Failed to approve');
        }
    };

    const handleReject = async (uid) => {
        if (!confirm("Are you sure you want to reject and remove this user?")) return;
        const token = await currentUser.getIdToken();
        try {
            await axios.patch(`${import.meta.env.VITE_ZONES_API_BASE_URL}/api/admin/reject-user/${uid}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPendingUsers(); // Refresh
        } catch (err) {
            alert('Failed to reject');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Log Out
                </button>
            </div>

            <h2 style={{ marginTop: '20px' }}>Pending Approvals</h2>
            {pendingUsers.length === 0 ? <p>No pending users.</p> : (
                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>UID</th>
                            <th>Joined At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingUsers.map(user => (
                            <tr key={user.uid}>
                                <td>{user.email}</td>
                                <td>{user.uid}</td>
                                <td>{new Date(user.createdAt).toLocaleString()}</td>
                                <td>
                                    <button onClick={() => handleApprove(user.uid)} style={{ marginRight: '10px', backgroundColor: 'lightgreen', padding: '5px 10px', cursor: 'pointer' }}>Approve</button>
                                    <button onClick={() => handleReject(user.uid)} style={{ backgroundColor: 'salmon', padding: '5px 10px', cursor: 'pointer' }}>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
