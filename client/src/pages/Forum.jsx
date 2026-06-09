import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function Forum() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Ładowanie kategorii...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-primary" />
          Kategorie forum
        </h1>
      </div>

      {categories.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          Brak kategorii. Administrator musi je najpierw dodać.
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/forum/category/${cat.id}`}
              className="block bg-dark-card border border-dark-border rounded-xl p-5 hover:border-primary/40 transition-all no-underline group"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-semibold group-hover:text-primary transition-colors flex items-center gap-2">
                    {cat.name}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h2>
                  <p className="text-gray-400 text-sm mt-0.5 line-clamp-1">{cat.description}</p>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500 shrink-0">
                  <div className="text-center">
                    <div className="text-white font-semibold">{cat.threadCount}</div>
                    <div className="text-xs flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Wątków</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold">{cat.postCount}</div>
                    <div className="text-xs flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Postów</div>
                  </div>
                  {cat.lastThread && (
                    <div className="text-right max-w-[200px]">
                      <div className="text-xs text-gray-400 truncate">{cat.lastThread.title}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        {new Date(cat.lastThread.createdAt).toLocaleDateString('pl-PL')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
