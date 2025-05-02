import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, ChefHat, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Tasty Bites</h1>
      </div>
      <div className="navbar-user">
        <div className="user-info">
          {user.role === 'chef' ? (
            <ChefHat size={20} className="user-icon" />
          ) : (
            <User size={20} className="user-icon" />
          )}
          <span>{user.username}</span>
          <span className="user-role">{user.role}</span>
        </div>
        <button onClick={handleLogout} className="btn-logout" aria-label="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;