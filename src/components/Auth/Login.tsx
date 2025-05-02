import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ChefHat, User } from 'lucide-react';
import '../../styles/main.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (success) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role === 'customer') {
          navigate('/customer');
        } else if (user.role === 'chef') {
          navigate('/chef');
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Tasty Bites</h1>
          <p>Sign in to continue</p>
        </div>

        <div className="role-icons">
          <div className="role-icon">
            <User size={24} />
            <span>Customer</span>
          </div>
          <div className="role-icon">
            <ChefHat size={24} />
            <span>Chef</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          <div className="login-hint">
            <p>Demo accounts:</p>
            <p>Customer: username "customer1", password "1234"</p>
            <p>Chef: username "chef1", password "1234"</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;