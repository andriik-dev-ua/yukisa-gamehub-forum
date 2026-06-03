import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin';
import { Login, Register } from './pages/Auth';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Search from './pages/Search';
import TopicDetail from './pages/TopicDetail';
import TopicForm from './pages/TopicForm';

export default function App() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route path="/categories/:id" element={<Search categoryMode />} />
          <Route path="/topics/new" element={<ProtectedRoute><TopicForm /></ProtectedRoute>} />
          <Route path="/topics/:id" element={<TopicDetail />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute admin><Admin /></ProtectedRoute>} />
          <Route path="*" element={<div className="container py-5"><h1>Nie znaleziono strony</h1></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
