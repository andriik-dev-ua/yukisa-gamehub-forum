import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@gamehub.pl', password: 'admin123' });
  const submit = async (e) => { e.preventDefault(); try { await login(form); navigate('/'); } catch (err) { toast.error(err.response?.data?.message || 'Błąd logowania.'); } };
  return <AuthCard title="Logowanie" submit={submit} form={form} setForm={setForm} button="Zaloguj" footer={<Link to="/register">Nie masz konta?</Link>} />;
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const submit = async (e) => { e.preventDefault(); try { await register(form); navigate('/'); } catch (err) { toast.error(err.response?.data?.message || 'Błąd rejestracji.'); } };
  return <AuthCard title="Rejestracja" submit={submit} form={form} setForm={setForm} button="Utwórz konto" footer={<Link to="/login">Masz konto? Zaloguj się</Link>} />;
}

function AuthCard({ title, submit, form, setForm, button, footer }) {
  return (
    <div className="container py-5 auth-width">
      <div className="card shadow"><div className="card-body p-4">
        <h1 className="h3 mb-4">{title}</h1>
        <form onSubmit={submit} className="d-grid gap-3">
          {Object.keys(form).map((key) => <input key={key} className="form-control" type={key === 'password' ? 'password' : 'text'} placeholder={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />)}
          <button className="btn btn-primary">{button}</button>
        </form>
        <div className="mt-3 small">{footer}</div>
      </div></div>
    </div>
  );
}
