import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/auth/register', { name, email, password });
      setSuccess('Registration successful! You can now log in.');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: 350, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 16 }}>Register</h2>
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 6, background: 'linear-gradient(90deg, #fbbf24, #22d3ee)', color: '#fff', fontWeight: 600, border: 0, fontSize: 16, cursor: 'pointer' }}>Register</button>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <p>Already have an account?</p>
        <Link to="/login" style={{ margin: 8 }}>Login</Link>
      </div>
    </form>
  );
}

export default Register;
