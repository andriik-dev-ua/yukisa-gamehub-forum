import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const handleSearch = (event) => {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get('q');
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top glass-nav">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">🎮 GameHub Forum</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"><span className="navbar-toggler-icon" /></button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/">Kategorie</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/topics/new">Nowy temat</NavLink></li>
            {user?.role === 'admin' && <li className="nav-item"><NavLink className="nav-link" to="/admin">Admin</NavLink></li>}
          </ul>
          <form className="d-flex gap-2 me-3" onSubmit={handleSearch}>
            <input className="form-control" name="q" placeholder="Szukaj tematów..." />
            <button className="btn btn-primary">Szukaj</button>
          </form>
          <button className="btn btn-outline-secondary me-2" onClick={toggleTheme}>{dark ? <FaSun /> : <FaMoon />}</button>
          {user ? (
            <div className="d-flex align-items-center gap-2">
              <Link to="/profile" className="btn btn-outline-primary">{user.username}</Link>
              <button className="btn btn-danger" onClick={logout}>Wyloguj</button>
            </div>
          ) : (
            <div className="d-flex gap-2"><Link className="btn btn-outline-primary" to="/login">Login</Link><Link className="btn btn-primary" to="/register">Rejestracja</Link></div>
          )}
        </div>
      </div>
    </nav>
  );
}
