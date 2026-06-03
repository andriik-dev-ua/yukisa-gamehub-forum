import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function Admin() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const load = () => Promise.all([api.get('/admin/stats'), api.get('/admin/users')]).then(([s, u]) => { setStats(s.data); setUsers(u.data); });
  useEffect(() => { load(); }, []);
  const toggleBlock = async (id) => { await api.patch(`/admin/users/${id}/block`); load(); };
  const setRole = async (id, role) => { await api.patch(`/admin/users/${id}/role`, { role }); load(); };
  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Panel administratora</h1>
      <div className="row g-3 mb-4">{Object.entries(stats).map(([key, value]) => <div className="col-6 col-lg-3" key={key}><div className="card text-center p-3"><span className="display-6 fw-bold">{value}</span><span className="text-secondary">{key}</span></div></div>)}</div>
      <div className="card"><div className="card-body table-responsive"><table className="table align-middle"><thead><tr><th>Użytkownik</th><th>Email</th><th>Rola</th><th>Status</th><th>Akcje</th></tr></thead><tbody>{users.map((u) => <tr key={u._id}><td><img src={u.avatar} className="avatar-sm me-2" alt="" />{u.username}</td><td>{u.email}</td><td>{u.role}</td><td>{u.isBlocked ? 'Zablokowany' : 'Aktywny'}</td><td className="d-flex gap-2"><button className="btn btn-sm btn-outline-warning" onClick={() => toggleBlock(u._id)}>{u.isBlocked ? 'Odblokuj' : 'Blokuj'}</button><button className="btn btn-sm btn-outline-primary" onClick={() => setRole(u._id, u.role === 'admin' ? 'user' : 'admin')}>Zmień rolę</button></td></tr>)}</tbody></table></div></div>
    </div>
  );
}
