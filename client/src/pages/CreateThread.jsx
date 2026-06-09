import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PenLine, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CreateThread() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/categories').then((res) => setCategories(res.data)).catch(console.error);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) {
      return toast.error('Wypełnij wszystkie pola');
    }
    setSubmitting(true);
    try {
      const res = await api.post('/threads', { title, content, categoryId: parseInt(categoryId) });
      toast.success('Wątek utworzony!');
      navigate(`/thread/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Błąd tworzenia wątku');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-gray-400 hover:text-primary text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> Powrót
      </button>

      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <PenLine className="w-6 h-6 text-primary" /> Nowy wątek
      </h1>

      <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Kategoria</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-primary text-sm"
          >
            <option value="">Wybierz kategorię...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tytuł</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tytuł wątku..."
            className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Treść</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Napisz treść wątku..."
            className="w-full bg-dark border border-dark-border rounded-lg px-3 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary resize-none text-sm min-h-[200px]"
            rows={8}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {submitting ? 'Tworzenie...' : 'Utwórz wątek'}
          </button>
        </div>
      </form>
    </div>
  );
}
