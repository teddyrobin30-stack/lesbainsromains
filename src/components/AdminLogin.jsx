import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const AdminLogin = ({ onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1a2e'
    }}>
      <div style={{
        background: '#16213e',
        padding: '2.5rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '380px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        <h2 style={{ color: '#c9a96e', textAlign: 'center', marginBottom: '1.5rem', fontFamily: 'serif' }}>
          Espace Administration
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid #333',
              background: '#0f3460',
              color: '#fff',
              fontSize: '1rem'
            }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid #333',
              background: '#0f3460',
              color: '#fff',
              fontSize: '1rem'
            }}
          />

          {error && (
            <p style={{ color: '#ff6b6b', textAlign: 'center', margin: 0, fontSize: '0.9rem' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              background: '#c9a96e',
              color: '#1a1a2e',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '0.5rem',
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
