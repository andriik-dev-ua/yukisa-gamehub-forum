import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Hasła nie są identyczne');
    }
    if (password.length < 6) {
      return toast.error('Hasło musi mieć min. 6 znaków');
    }
    setLoading(true);
    try {
      await register(username, email, password);
      toast.success('Rejestracja zakończona!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Błąd rejestracji');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-dark-card border border-dark-border rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 justify-center">
          <UserPlus className="w-6 h-6 text-primary" /> Rejestracja
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nazwa użytkownika</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="TwojNick"
                className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 pl-10 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
                required
                minLength={3}
                maxLength={50}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj@email.pl"
                className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 pl-10 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Hasło</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 znaków"
                className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 pl-10 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Powtórz hasło</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Powtórz hasło"
                className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 pl-10 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Rejestracja...' : 'Zarejestruj się'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Masz już konto?{' '}
          <Link to="/login" className="text-primary no-underline hover:underline">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
}
