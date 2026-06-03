import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import TopicCard from '../components/TopicCard';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/categories'), api.get('/topics'), api.get('/users/ranking')]).then(([cat, top, rank]) => {
      setCategories(cat.data); setTopics(top.data); setRanking(rank.data);
    });
  }, []);

  return (
    <div className="container py-4">
      <section className="hero rounded-4 p-5 mb-4 shadow">
        <span className="badge bg-light text-dark mb-3">Polska społeczność graczy</span>
        <h1 className="display-5 fw-bold">GameHub Forum</h1>
        <p className="lead">Twórz tematy, komentuj, polub treści i zdobywaj punkty w rankingu graczy.</p>
        <Link to="/topics/new" className="btn btn-light btn-lg">Rozpocznij dyskusję</Link>
      </section>
      <div className="row g-4">
        <div className="col-lg-8">
          <h2 className="h4 mb-3">Najnowsze tematy</h2>
          <div className="row g-3">{topics.map((topic) => <div className="col-md-6" key={topic._id}><TopicCard topic={topic} /></div>)}</div>
        </div>
        <aside className="col-lg-4">
          <h2 className="h4 mb-3">Kategorie</h2>
          <div className="d-grid gap-2 mb-4">{categories.map((cat) => <Link key={cat._id} to={`/categories/${cat._id}`} className="card p-3 text-decoration-none"><strong>{cat.icon} {cat.name}</strong><span className="small text-secondary">{cat.description}</span></Link>)}</div>
          <h2 className="h4 mb-3">Ranking</h2>
          <div className="card"><div className="card-body">{ranking.map((u, i) => <div className="d-flex align-items-center gap-2 mb-2" key={u._id}><span className="fw-bold">#{i + 1}</span><img src={u.avatar} className="avatar-sm" alt="" /><span>{u.username}</span><span className="ms-auto badge bg-primary">{u.points} pkt</span></div>)}</div></div>
        </aside>
      </div>
    </div>
  );
}
