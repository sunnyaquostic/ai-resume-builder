import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { Button } from './ui/button';
import { LogoutUser } from '@/features/userSlice';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, userInfo } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    try {
      await dispatch(LogoutUser()).unwrap();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AR</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">AI Resume Builder</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700'} hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors`
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/features"
              className={({ isActive }) =>
                `${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700'} hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors`
              }
            >
              Features
            </NavLink>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700'} hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors`
              }
            >
              Pricing
            </NavLink>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {userInfo.name || 'User'}
                </span>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


