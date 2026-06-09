import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Gamepad2, LogOut, User, Shield, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="bg-dark-lighter border-b border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold no-underline group">
            <Gamepad2 className="w-8 h-8 text-primary group-hover:text-neon-cyan transition-colors" />
            <span className="bg-gradient-to-r from-primary to-neon-cyan bg-clip-text text-transparent">
              GameStopDev
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-primary transition-colors no-underline text-sm">
              Strona główna
            </Link>
            <Link to="/forum" className="text-gray-300 hover:text-primary transition-colors no-underline text-sm">
              Forum
            </Link>
            <Link to="/ranking" className="text-gray-300 hover:text-primary transition-colors no-underline text-sm">
              Ranking
            </Link>
          </nav>

          {/* Search + Auth (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj..."
                className="bg-dark border border-dark-border rounded-lg px-3 py-1.5 pl-9 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary w-48"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </form>

            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-neon-pink hover:text-neon-pink/80 transition-colors no-underline" title="Panel Admina">
                    <Shield className="w-5 h-5" />
                  </Link>
                )}
                <Link to={`/profile/${user.id}`} className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors no-underline text-sm">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-dark-border" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span>{user.username}</span>
                </Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors" title="Wyloguj">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-300 hover:text-primary transition-colors no-underline">
                  Logowanie
                </Link>
                <Link to="/register" className="text-sm bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg transition-colors no-underline">
                  Rejestracja
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-300 hover:text-primary">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-dark-border mt-2 pt-4 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj..."
                className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 pl-9 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </form>
            <Link to="/" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-primary no-underline py-1">Strona główna</Link>
            <Link to="/forum" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-primary no-underline py-1">Forum</Link>
            <Link to="/ranking" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-primary no-underline py-1">Ranking</Link>
            {user ? (
              <>
                <Link to={`/profile/${user.id}`} onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-primary no-underline py-1">Profil</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-neon-pink hover:text-neon-pink/80 no-underline py-1">Panel Admina</Link>
                )}
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 py-1">Wyloguj się</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-primary no-underline py-1">Logowanie</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-primary font-semibold no-underline py-1">Rejestracja</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
