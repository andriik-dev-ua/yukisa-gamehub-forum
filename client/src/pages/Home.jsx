import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Users, MessageSquare, FolderOpen, TrendingUp, ArrowRight, Eye, Heart, MessageCircle } from 'lucide-react';
import api from '../services/api';

export default function Home() {
  const [stats, setStats] = useState({ userCount: 0, threadCount: 0, postCount: 0, categoryCount: 0 });
  const [latestThreads, setLatestThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/stats'),
      api.get('/threads/latest'),
    ]).then(([statsRes, threadsRes]) => {
      setStats(statsRes.data);
      setLatestThreads(threadsRes.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-card via-dark-lighter to-dark-card border border-dark-border p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-neon-cyan/10" />
        <div className="absolute top-4 right-4 opacity-10">
          <Gamepad2 className="w-48 h-48 text-primary" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-neon-cyan to-neon-green bg-clip-text text-transparent">
              GameStopDev
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-6 max-w-2xl">
            Forum gamingowe stworzone dla graczy, przez graczy.
            Dołącz do naszej społeczności i dyskutuj o swoich ulubionych grach!
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/forum" className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors no-underline flex items-center gap-2">
              Przeglądaj forum <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register" className="border border-primary text-primary hover:bg-primary/10 px-6 py-2.5 rounded-lg font-medium transition-colors no-underline">
              Dołącz za darmo
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Użytkowników', value: stats.userCount, color: 'text-neon-cyan' },
          { icon: MessageSquare, label: 'Wątków', value: stats.threadCount, color: 'text-primary' },
          { icon: MessageCircle, label: 'Postów', value: stats.postCount, color: 'text-neon-green' },
          { icon: FolderOpen, label: 'Kategorii', value: stats.categoryCount, color: 'text-neon-pink' },
        ].map((stat, i) => (
          <div key={i} className="bg-dark-card border border-dark-border rounded-xl p-5 text-center hover:border-primary/30 transition-colors">
            <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Latest Threads */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Najnowsze wątki
          </h2>
          <Link to="/forum" className="text-primary hover:text-primary-light text-sm no-underline flex items-center gap-1">
            Wszystkie <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-8">Ładowanie...</div>
        ) : latestThreads.length === 0 ? (
          <div className="text-center text-gray-400 py-8">Brak wątków. Bądź pierwszy i utwórz nowy!</div>
        ) : (
          <div className="space-y-3">
            {latestThreads.map((thread) => (
              <Link
                key={thread.id}
                to={`/thread/${thread.id}`}
                className="block bg-dark-card border border-dark-border rounded-xl p-4 hover:border-primary/40 transition-all no-underline group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {thread.isPinned && <span className="text-xs bg-neon-cyan/20 text-neon-cyan px-2 py-0.5 rounded">📌 Przypięty</span>}
                      {thread.category && (
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${thread.category.color}20`, color: thread.category.color }}>
                          {thread.category.icon} {thread.category.name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-medium group-hover:text-primary transition-colors truncate">
                      {thread.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{thread.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Autor: {thread.author?.username}</span>
                      <span>{new Date(thread.createdAt).toLocaleDateString('pl-PL')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 shrink-0">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {thread.views}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {thread.postCount}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {thread.likeCount}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* About Author */}
      <section className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-3">O projekcie</h2>
        <div className="text-gray-400 text-sm space-y-2">
          <p>
            <strong className="text-primary-light">GameStopDev</strong> — forum gamingowe stworzone jako projekt Full Stack
            z wykorzystaniem technologii React, Node.js, Express.js i SQLite.
          </p>
          <p>
            <strong className="text-white">Właściciel / Autor / Twórca:</strong>{' '}
            <span className="text-primary-light">Andrii Kondratiuk</span>
          </p>
          <p>
            <strong className="text-white">Szkoła:</strong> CKZiU NR.2 &quot;Mechanik&quot; w Raciborzu
          </p>
          <p>
            <strong className="text-white">Klasa:</strong> 4cT, gr.1 — kierunek: technik informatyk
          </p>
          <p>
            <strong className="text-white">Zespół:</strong>{' '}
            <span className="text-neon-cyan">Dev S.A. | A.K.</span>
          </p>
        </div>
      </section>
    </div>
  );
}
