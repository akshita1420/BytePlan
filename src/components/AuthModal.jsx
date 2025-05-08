import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root'); // Accessibility requirement

export default function AuthModal({ isOpen, onClose, type }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [isSigningIn, setIsSigningIn] = useState(type === 'signin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = `http://localhost:5000/api/auth/${isSigningIn ? 'signin' : 'signup'}`;
      console.log('Sending request to:', apiUrl);
      console.log('Request data:', { ...formData, password: '[REDACTED]' });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (isSigningIn) {
        if (!data.token || !data.user) {
          throw new Error('Invalid response format');
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Sign in successful, user data:', data.user);
        onClose();
        navigate('/dashboard');
      } else {
        if (!data.token || !data.user) {
          throw new Error('Invalid response format');
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Sign up successful, user data:', data.user);
        onClose();
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err.message === 'Failed to fetch') {
        setError('Unable to connect to server. Please check if the server is running.');
      } else if (err.message === 'Invalid response format') {
        setError('Server returned invalid response. Please try again.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="auth-modal"
      overlayClassName="auth-modal-overlay"
    >
      <div className="auth-container">
        <h2 className="auth-title">{isSigningIn ? 'Welcome Back!' : 'Create Account'}</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          {!isSigningIn && (
            <>
              <div className="input-group">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
            </>
          )}
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>
          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : (isSigningIn ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        <div className="auth-footer">
          <p>
            {isSigningIn ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsSigningIn(!isSigningIn);
                setError('');
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  password: ''
                });
              }}
              className="auth-toggle-btn"
            >
              {isSigningIn ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}
