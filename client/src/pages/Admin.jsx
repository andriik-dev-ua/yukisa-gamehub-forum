import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, FolderOpen, BarChart3, Plus, Trash2, Edit, Save, X, Ban, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: '', description: '', icon: '🎮', color: '#7c3aed' });
  const [editingCat, setEditingCat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [statsRes, usersRes, catsRes] = await Promise.all([
        api.get('/stats'),
        api.get('/users'),
        api.get('/categories'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/users/${userId}/role`, { role });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
      toast.success('Rola zmieniona');
    } catch { toast.error('Błąd'); }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const res = await api.put(`/users/${userId}/block`);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isBlocked: res.data.isBlocked } : u));
      toast.success(res.data.message);
    } catch { toast.error('Błąd'); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) return toast.error('Nazwa wymagana');
    try {
      const res = await api.post('/categories', newCat);
      setCategories((prev) => [...prev, res.data]);
      setNewCat({ name: '', description: '', icon: '🎮', color: '#7c3aed' });
      toast.success('Kategoria dodana');
    } catch (err) { toast.error(err.response?.data?.message || 'Błąd'); }
  };

  const handleUpdateCategory = async () => {
    if (!editingCat) return;
    try {
      const res = await api.put(`/categories/${editingCat.id}`, editingCat);
      setCategories((prev) => prev.map((c) => c.id === editingCat.id ? res.data : c));
      setEditingCat(null);
      toast.success('Kategoria zaktualizowana');
    } catch { toast.error('Błąd'); }
  };

  const handleDeleteCategory = async (catId) => {
    if (!confirm('Na pewno usunąć tę kategorię?')) return;
    try {
      await api.delete(`/categories/${catId}`);
      setCategories((prev) => prev.filter((c) => c.id !== catId));
      toast.success('Kategoria usunięta');
    } catch { toast.error('Błąd'); }
  };

  if (loading) return <div className="text-center text-gray-400 py-12">Ładowanie...</div>;

  const tabs = [
    { id: 'stats', label: 'Statystyki', icon: BarChart3 },
    { id: 'users', label: 'Użytkownicy', icon: Users },
    { id: 'categories', label: 'Kategorie', icon: FolderOpen },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Shield className="w-6 h-6 text-neon-pink" /> Panel Administratora
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.id ? 'bg-primary text-white' : 'bg-dark-card text-gray-400 hover:bg-dark-border'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {tab === 'stats' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Użytkowników', value: stats.userCount, color: 'text-neon-cyan' },
            { label: 'Wątków', value: stats.threadCount, color: 'text-primary' },
            { label: 'Postów', value: stats.postCount, color: 'text-neon-green' },
            { label: 'Kategorii', value: stats.categoryCount, color: 'text-neon-pink' },
          ].map((s, i) => (
            <div key={i} className="bg-dark-card border border-dark-border rounded-xl p-6 text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-4">
              {u.avatar ? (
                <img src={u.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {u.username[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm flex items-center gap-2">
                  {u.username}
                  {u.isBlocked && <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Zablokowany</span>}
                </div>
                <div className="text-xs text-gray-500">{u.email}</div>
              </div>
              <select
                value={u.role}
                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                className="bg-dark border border-dark-border rounded px-2 py-1 text-sm text-gray-200 focus:outline-none focus:border-primary"
                disabled={u.id === user.id}
              >
                <option value="user">user</option>
                <option value="moderator">moderator</option>
                <option value="admin">admin</option>
              </select>
              <button
                onClick={() => handleToggleBlock(u.id)}
                disabled={u.id === user.id}
                className={`text-sm px-3 py-1 rounded transition-colors disabled:opacity-30 ${
                  u.isBlocked ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                }`}
              >
                {u.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Categories Tab */}
      {tab === 'categories' && (
        <div className="space-y-4">
          {/* Add New */}
          <form onSubmit={handleAddCategory} className="bg-dark-card border border-dark-border rounded-xl p-4">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-1"><Plus className="w-4 h-4" /> Nowa kategoria</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                placeholder="Nazwa"
                className="bg-dark border border-dark-border rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={newCat.description}
                onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                placeholder="Opis"
                className="bg-dark border border-dark-border rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCat.icon}
                  onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
                  placeholder="Ikona"
                  className="bg-dark border border-dark-border rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary w-20"
                />
                <input
                  type="color"
                  value={newCat.color}
                  onChange={(e) => setNewCat({ ...newCat, color: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
              </div>
              <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded text-sm font-medium">
                Dodaj
              </button>
            </div>
          </form>

          {/* List */}
          {categories.map((cat) => (
            <div key={cat.id} className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-4">
              <div className="text-2xl w-10 text-center">{editingCat?.id === cat.id ? editingCat.icon : cat.icon}</div>
              <div className="flex-1 min-w-0">
                {editingCat?.id === cat.id ? (
                  <div className="flex flex-wrap gap-2">
                    <input value={editingCat.name} onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })} className="bg-dark border border-dark-border rounded px-2 py-1 text-sm text-gray-200 focus:outline-none focus:border-primary" />
                    <input value={editingCat.description} onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })} className="bg-dark border border-dark-border rounded px-2 py-1 text-sm text-gray-200 focus:outline-none focus:border-primary flex-1" />
                    <input value={editingCat.icon} onChange={(e) => setEditingCat({ ...editingCat, icon: e.target.value })} className="bg-dark border border-dark-border rounded px-2 py-1 text-sm w-16" />
                    <input type="color" value={editingCat.color} onChange={(e) => setEditingCat({ ...editingCat, color: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                  </div>
                ) : (
                  <>
                    <div className="text-white font-medium text-sm">{cat.name}</div>
                    <div className="text-xs text-gray-500 truncate">{cat.description}</div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editingCat?.id === cat.id ? (
                  <>
                    <button onClick={handleUpdateCategory} className="text-green-400 hover:text-green-300"><Save className="w-4 h-4" /></button>
                    <button onClick={() => setEditingCat(null)} className="text-gray-400 hover:text-gray-300"><X className="w-4 h-4" /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingCat({ ...cat })} className="text-primary hover:text-primary-light"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
