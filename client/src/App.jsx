import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Forum from './pages/Forum';
import CategoryThreads from './pages/CategoryThreads';
import ThreadView from './pages/ThreadView';
import CreateThread from './pages/CreateThread';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Search from './pages/Search';
import Ranking from './pages/Ranking';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-dark">
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1a1a2e', color: '#e2e8f0', border: '1px solid #2a2a4a' },
              success: { iconTheme: { primary: '#22c55e', secondary: '#1a1a2e' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#1a1a2e' } },
            }}
          />
          <Header />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/category/:categoryId" element={<CategoryThreads />} />
              <Route path="/thread/:id" element={<ThreadView />} />
              <Route path="/create-thread" element={<CreateThread />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/search" element={<Search />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="*" element={
                <div className="text-center py-20">
                  <h1 className="text-4xl font-bold text-white mb-2">404</h1>
                  <p className="text-gray-400">Strona nie znaleziona</p>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
