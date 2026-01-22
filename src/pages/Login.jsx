import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to log in: ' + err.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h2>Admin Login</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    <label>Email</label><br />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>Password</label><br />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" style={{ marginTop: '20px' }}>Log In</button>
            </form>
        </div>
    );
}
