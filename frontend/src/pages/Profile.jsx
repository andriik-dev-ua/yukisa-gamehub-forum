import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ username: user.username, bio: user.bio || '', avatar: user.avatar || '' });
  const submit = async (e) => { e.preventDefault(); const { data } = await api.put('/users/me/profile', form); setUser({ ...user, ...data, id: data._id }); toast.success('Profil zapisany.'); };
  return (
    <div className="container py-4 auth-width">
      <h1 className="h3 mb-3">Mój profil</h1>
      <form className="card card-body d-grid gap-3" onSubmit={submit}>
        <img src={form.avatar} alt="avatar" className="avatar-xl mx-auto" />
        <input className="form-control" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="form-control" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="URL avatara" />
        <textarea className="form-control" rows="4" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <button className="btn btn-primary">Zapisz profil</button>
      </form>
    </div>
  );
}
