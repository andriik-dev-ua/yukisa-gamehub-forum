import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Star, Medal } from 'lucide-react';
import api from '../services/api';

export default function Ranking() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/ranking')
      .then((res) => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getMedal = (index) => {
    if (index === 0) return <Medal className="w-6 h-6 text-yellow-400" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-300" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-gray-500 text-sm w-6 text-center">{index + 1}</span>;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-400" />
        Ranking użytkowników
      </h1>

      {loading ? (
        <div className="text-center text-gray-400 py-8">Ładowanie...</div>
      ) : (
        <div className="space-y-2">
          {users.map((u, i) => (
            <Link
              key={u.id}
              to={`/profile/${u.id}`}
              className="flex items-center gap-4 bg-dark-card border border-dark-border rounded-xl p-4 hover:border-primary/40 transition-all no-underline"
            >
              <div className="w-8 flex justify-center">{getMedal(i)}</div>
              {u.avatar ? (
                <img src={u.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-dark-border" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {u.username[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="text-white font-medium text-sm">{u.username}</div>
                <div className="text-xs text-gray-500">Dołączył: {new Date(u.createdAt).toLocaleDateString('pl-PL')}</div>
              </div>
              <div className="flex items-center gap-1 text-neon-cyan font-bold">
                <Star className="w-4 h-4" /> {u.points}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
