import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Calendar, MessageSquare, Star, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    api.get(`/users/${id}`)
      .then((res) => {
        setProfile(res.data);
        setBio(res.data.bio || '');
        setUsername(res.data.username);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = currentUser && currentUser.id === parseInt(id);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('bio', bio);
      const res = await api.put(`/users/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile((prev) => ({ ...prev, ...res.data.user }));
      updateUser(res.data.user);
      setEditing(false);
      toast.success('Profil zaktualizowany');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Błąd');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('bio', profile.bio || '');
    try {
      const res = await api.put(`/users/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile((prev) => ({ ...prev, ...res.data.user }));
      updateUser(res.data.user);
      toast.success('Avatar zaktualizowany');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Błąd uploadu');
    }
  };

  if (loading) return <div className="text-center text-gray-400 py-12">Ładowanie...</div>;
  if (!profile) return <div className="text-center text-gray-400 py-12">Użytkownik nie znaleziony</div>;

  const roleColors = { admin: 'bg-neon-pink/20 text-neon-pink', moderator: 'bg-neon-cyan/20 text-neon-cyan', user: 'bg-gray-600/20 text-gray-400' };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-dark-card border border-dark-border rounded-xl p-8">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {profile.avatar ? (
              <img src={profile.avatar} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-dark-border" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                {profile.username[0].toUpperCase()}
              </div>
            )}
            {isOwner && (
              <label className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dark">
                <Edit className="w-3 h-3 text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            )}
          </div>
          <div>
            {editing ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-dark border border-dark-border rounded px-2 py-1 text-white text-lg font-bold focus:outline-none focus:border-primary"
              />
            ) : (
              <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
            )}
            <span className={`text-xs px-2 py-0.5 rounded ${roleColors[profile.role]}`}>{profile.role}</span>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-dark border border-dark-border rounded-lg p-3 text-center">
            <Star className="w-5 h-5 text-neon-cyan mx-auto mb-1" />
            <div className="text-white font-bold">{profile.points}</div>
            <div className="text-xs text-gray-500">Punkty</div>
          </div>
          <div className="bg-dark border border-dark-border rounded-lg p-3 text-center">
            <MessageSquare className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-white font-bold">{profile.threadCount}</div>
            <div className="text-xs text-gray-500">Wątki</div>
          </div>
          <div className="bg-dark border border-dark-border rounded-lg p-3 text-center">
            <MessageSquare className="w-5 h-5 text-neon-green mx-auto mb-1" />
            <div className="text-white font-bold">{profile.postCount}</div>
            <div className="text-xs text-gray-500">Posty</div>
          </div>
          <div className="bg-dark border border-dark-border rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 text-neon-pink mx-auto mb-1" />
            <div className="text-white font-bold text-sm">{new Date(profile.createdAt).toLocaleDateString('pl-PL')}</div>
            <div className="text-xs text-gray-500">Dołączył(a)</div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">O mnie</h3>
          {editing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-dark border border-dark-border rounded-lg p-3 text-gray-200 text-sm focus:outline-none focus:border-primary resize-none"
              rows={3}
              placeholder="Napisz coś o sobie..."
            />
          ) : (
            <p className="text-gray-400 text-sm">{profile.bio || 'Brak opisu.'}</p>
          )}
        </div>

        {/* Edit buttons */}
        {isOwner && (
          <div className="flex justify-end gap-2 mt-4">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-300 text-sm flex items-center gap-1">
                  <X className="w-4 h-4" /> Anuluj
                </button>
                <button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-lg text-sm flex items-center gap-1">
                  <Save className="w-4 h-4" /> Zapisz
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="text-primary hover:text-primary-light text-sm flex items-center gap-1">
                <Edit className="w-4 h-4" /> Edytuj profil
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
