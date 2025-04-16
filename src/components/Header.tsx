import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-200' : 'text-white hover:text-blue-200';
  };

  const navLinks = [
    { path: '/', label: 'Início' },
    { path: '/missing-persons', label: 'Desaparecimentos' },
    { path: '/stolen-vehicles', label: 'Carros Roubados' },
    { path: '/lost-and-found', label: 'Perdidos & Achados' },
    { path: '/report', label: 'Reportar Caso' },
    { path: '/donations', label: 'Doações' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-blue-600 text-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Bell className="h-6 w-6" />
            <span className="text-2xl font-bold">VigiaApp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${isActive(link.path)} transition-colors duration-200`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link
                to="/profile"
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Minha Conta
              </Link>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-blue-500">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block py-2 px-4 hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link
                to="/profile"
                className="block py-2 px-4 mt-2 bg-blue-700 hover:bg-blue-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Minha Conta
              </Link>
            ) : (
              <Link
                to="/auth"
                className="block py-2 px-4 mt-2 bg-blue-700 hover:bg-blue-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}