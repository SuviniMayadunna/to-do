import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.token);
      alert('Logged in!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 350, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 16 }}>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 6, background: 'linear-gradient(90deg, #22d3ee, #a78bfa)', color: '#fff', fontWeight: 600, border: 0, fontSize: 16, cursor: 'pointer' }}>Login</button>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <p>Don't have an account?</p>
        <Link to="/register" style={{ margin: 8 }}>Register</Link>
      </div>
    </form>

    
    
  );
  
}

export default Login;
