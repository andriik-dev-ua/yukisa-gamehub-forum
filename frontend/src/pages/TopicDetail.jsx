import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function TopicDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [content, setContent] = useState('');
  const load = () => api.get(`/topics/${id}`).then(({ data }) => setData(data));
  useEffect(() => { load(); }, [id]);
  if (!data) return <div className="container py-5">Ładowanie tematu...</div>;

  const likeTopic = async () => { await api.post(`/topics/${id}/like`); load(); };
  const removeTopic = async () => { await api.delete(`/topics/${id}`); toast.info('Usunięto temat.'); navigate('/'); };
  const addComment = async (e) => { e.preventDefault(); await api.post(`/comments/topic/${id}`, { content }); setContent(''); load(); };
  const removeComment = async (commentId) => { await api.delete(`/comments/${commentId}`); load(); };
  const likeComment = async (commentId) => { await api.post(`/comments/${commentId}/like`); load(); };

  return (
    <div className="container py-4">
      <article className="card shadow-sm mb-4"><div className="card-body">
        <span className="badge" style={{ background: data.topic.category?.color }}>{data.topic.category?.icon} {data.topic.category?.name}</span>
        <h1 className="h2 mt-3">{data.topic.title}</h1>
        <p className="text-secondary">Autor: {data.topic.author?.username} • Wyświetlenia: {data.topic.views}</p>
        <p className="fs-5 white-space">{data.topic.content}</p>
        <div className="d-flex gap-2"><button className="btn btn-outline-danger" disabled={!user} onClick={likeTopic}>❤️ {data.topic.likesCount}</button>{(user?.id === data.topic.author?._id || user?.role === 'admin') && <button className="btn btn-outline-danger" onClick={removeTopic}>Usuń</button>}</div>
      </div></article>
      <section className="card mb-4"><div className="card-body">
        <h2 className="h4">Komentarze</h2>
        {data.comments.map((c) => <div className="border-top py-3" key={c._id}><div className="d-flex align-items-center gap-2"><img src={c.author?.avatar} className="avatar-sm" alt="" /><strong>{c.author?.username}</strong><button className="btn btn-sm btn-outline-danger ms-auto" disabled={!user} onClick={() => likeComment(c._id)}>❤️ {c.likesCount}</button></div><p className="mb-1 mt-2">{c.content}</p>{(user?.id === c.author?._id || user?.role === 'admin') && <button className="btn btn-sm btn-outline-danger" onClick={() => removeComment(c._id)}>Usuń</button>}</div>)}
      </div></section>
      {user ? <form className="card card-body" onSubmit={addComment}><textarea className="form-control mb-2" rows="3" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Dodaj komentarz..." /><button className="btn btn-primary">Wyślij</button></form> : <p>Zaloguj się, aby komentować.</p>}
    </div>
  );
}
