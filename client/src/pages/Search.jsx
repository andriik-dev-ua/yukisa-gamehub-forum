import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Eye, Heart, MessageCircle } from 'lucide-react';
import api from '../services/api';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) return;
    setLoading(true);
    api.get(`/search?q=${encodeURIComponent(query)}`)
      .then((res) => setResults(res.data.threads))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
        <SearchIcon className="w-6 h-6 text-primary" />
        Wyniki wyszukiwania
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        {query ? `Fraza: "${query}" — znaleziono ${results.length} wyników` : 'Wpisz frazę do wyszukania'}
      </p>

      {loading ? (
        <div className="text-center text-gray-400 py-8">Szukanie...</div>
      ) : results.length === 0 ? (
        <div className="text-center text-gray-400 py-12">Brak wyników dla tej frazy.</div>
      ) : (
        <div className="space-y-3">
          {results.map((thread) => (
            <Link
              key={thread.id}
              to={`/thread/${thread.id}`}
              className="block bg-dark-card border border-dark-border rounded-xl p-4 hover:border-primary/40 transition-all no-underline group"
            >
              <div className="flex items-center gap-2 mb-1">
                {thread.category && (
                  <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${thread.category.color}20`, color: thread.category.color }}>
                    {thread.category.icon} {thread.category.name}
                  </span>
                )}
              </div>
              <h3 className="text-white font-medium group-hover:text-primary transition-colors">{thread.title}</h3>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{thread.content}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>Autor: {thread.author?.username}</span>
                <span>{new Date(thread.createdAt).toLocaleDateString('pl-PL')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
