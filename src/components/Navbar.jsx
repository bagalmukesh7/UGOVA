import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Home, LayoutDashboard, Briefcase, Shield, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    ...(user ? [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/opportunities', label: 'Opportunities', icon: Briefcase },
      { to: '/profile', label: 'Profile', icon: User },
    ] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: Shield }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-saffron rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="text-lg font-bold text-navy">UGOVA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {!user && (
              <Link to="/" className={`nav-link ${isActive('/') ? 'text-saffron' : ''}`}>
                <span className="flex items-center gap-1"><Home size={16} /> Home</span>
              </Link>
            )}
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`nav-link ${isActive(link.to) ? 'text-saffron bg-saffron/5 rounded-lg' : ''}`}>
                <span className="flex items-center gap-1"><link.icon size={16} /> {link.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-600 font-medium">{user.name}</span>
                <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-all">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-slate-600 hover:text-saffron font-medium px-3 py-2">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-600">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-2">
          {!user && (
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-slate-600">
              <Home size={18} /> Home
            </Link>
          )}
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-slate-600">
              <link.icon size={18} /> {link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center gap-2 py-2 text-red-600 w-full">
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <div className="space-y-2 pt-2 border-t">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-600">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block btn-primary text-center text-sm py-2">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
