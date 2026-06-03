import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../api/client';

export default function TopicForm() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', category: '', tags: '' });
  const navigate = useNavigate();
  useEffect(() => { api.get('/categories').then(({ data }) => setCategories(data)); }, []);
  const submit = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...form, tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean) };
      const { data } = await api.post('/topics', payload);
      toast.success('Temat opublikowany.');
      navigate(`/topics/${data._id}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Nie udało się zapisać tematu.'); }
  };
  return (
    <div className="container py-4 auth-width">
      <h1 className="h3 mb-3">Nowy temat</h1>
      <form className="card card-body d-grid gap-3" onSubmit={submit}>
        <input className="form-control" placeholder="Tytuł" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required><option value="">Wybierz kategorię</option>{categories.map((cat) => <option value={cat._id} key={cat._id}>{cat.name}</option>)}</select>
        <textarea className="form-control" rows="8" placeholder="Treść" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <input className="form-control" placeholder="Tagi po przecinku" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <button className="btn btn-primary">Publikuj</button>
      </form>
    </div>
  );
}
