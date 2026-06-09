import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Eye, Heart, MessageCircle, ArrowLeft, Pin, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function CategoryThreads() {
  const { categoryId } = useParams();
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/threads?categoryId=${categoryId}&page=${page}`),
      api.get('/categories'),
    ]).then(([threadsRes, catsRes]) => {
      setThreads(threadsRes.data.threads);
      setTotalPages(threadsRes.data.totalPages);
      const cat = catsRes.data.find((c) => c.id === parseInt(categoryId));
      setCategory(cat);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryId, page]);

  return (
    <div>
      <Link to="/forum" className="inline-flex items-center gap-1 text-gray-400 hover:text-primary text-sm no-underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Powrót do kategorii
      </Link>

      {category && (
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: `${category.color}20` }}>
            {category.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{category.name}</h1>
            <p className="text-gray-400 text-sm">{category.description}</p>
          </div>
        </div>
      )}

      {user && (
        <Link
          to={`/create-thread?categoryId=${categoryId}`}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline mb-4"
        >
          <Plus className="w-4 h-4" /> Nowy wątek
        </Link>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-8">Ładowanie...</div>
      ) : threads.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          Brak wątków w tej kategorii. Bądź pierwszy!
        </div>
      ) : (
        <div className="space-y-2">
          {threads.map((thread) => (
            <Link
              key={thread.id}
              to={`/thread/${thread.id}`}
              className="block bg-dark-card border border-dark-border rounded-lg p-4 hover:border-primary/40 transition-all no-underline group"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {thread.isPinned && <Pin className="w-3.5 h-3.5 text-neon-cyan" />}
                    {thread.isLocked && <Lock className="w-3.5 h-3.5 text-yellow-500" />}
                    <h3 className="text-white font-medium group-hover:text-primary transition-colors truncate text-sm">
                      {thread.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{thread.author?.username}</span>
                    <span>{new Date(thread.createdAt).toLocaleDateString('pl-PL')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 shrink-0">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{thread.views}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{thread.postCount}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{thread.likeCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded text-sm ${p === page ? 'bg-primary text-white' : 'bg-dark-card text-gray-400 hover:bg-dark-border'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
