import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { api } from '../api/client';
import TopicCard from '../components/TopicCard';

export default function Search({ categoryMode = false }) {
  const location = useLocation();
  const { id } = useParams();
  const [topics, setTopics] = useState([]);
  const q = new URLSearchParams(location.search).get('q') || '';
  useEffect(() => { api.get('/topics', { params: categoryMode ? { category: id } : { q } }).then(({ data }) => setTopics(data)); }, [q, id, categoryMode]);
  return <div className="container py-4"><h1 className="h3 mb-3">{categoryMode ? 'Tematy w kategorii' : `Wyniki wyszukiwania: ${q}`}</h1><div className="row g-3">{topics.map((topic) => <div className="col-md-6 col-lg-4" key={topic._id}><TopicCard topic={topic} /></div>)}</div></div>;
}
