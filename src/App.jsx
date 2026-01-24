import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import Navbar from "./components/Navbar";
import { auth } from "./services/firebase";
import CollectReservation from "./pages/CollectReservation";
import MyReservations from "./pages/MyReservations";
import PreBooking from "./pages/PreBooking";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState(true); // 'approved', 'pending'

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch User Info from Backend
        try {
          const token = await firebaseUser.getIdToken();
          const res = await axios.get(`${import.meta.env.VITE_ZONES_API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setApprovalStatus(true ? 'approved' : 'pending');
        } catch (err) {
          console.error("Error fetching user status:", err);
          // If 404/Error, assume pending or not synced yet.
          // The backend creates user on first check, but if network fails, we default to pending security-wise
          setApprovalStatus('pending');
        }
      } else {
        setUser(null);
        setApprovalStatus(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>Loading Application...</div>;
  }

  // If logged in but pending approval
  if (user && approvalStatus === 'pending') {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        fontFamily: 'sans-serif'
      }}>
        <h2 style={{ color: '#333' }}>⏳ Account Pending Approval</h2>
        <p style={{ color: '#666', marginTop: 10 }}>Your account needs administrator approval before you can access the app.</p>
        <p style={{ color: '#666' }}>Please contact the admin or check back later.</p>
        <button
          onClick={() => auth.signOut()}
          style={{
            marginTop: 20,
            padding: '10px 20px',
            backgroundColor: '#e53e3e',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/map"
          element={user ? <Map /> : <Navigate to="/" />}
        />
        <Route
          path="/reserve"
          element={user ? <CollectReservation /> : <Navigate to="/" />}
        />
        <Route
          path="/my-reservations"
          element={user ? <MyReservations /> : <Navigate to="/" />}
        />
        <Route
          path="/prebooking"
          element={user ? <PreBooking /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
};

export default App;
