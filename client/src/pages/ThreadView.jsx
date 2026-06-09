import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Eye, MessageCircle, Pin, Lock, Trash2, Edit, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ThreadView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadThread = () => {
    api.get(`/threads/${id}`)
      .then((res) => setThread(res.data))
      .catch(() => navigate('/forum'));
  };

  const loadPosts = () => {
    api.get(`/posts/thread/${id}?page=${page}`)
      .then((res) => {
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      })
      .catch(console.error);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/threads/${id}`),
      api.get(`/posts/thread/${id}?page=${page}`),
    ]).then(([threadRes, postsRes]) => {
      setThread(threadRes.data);
      setPosts(postsRes.data.posts);
      setTotalPages(postsRes.data.totalPages);
    }).catch(() => navigate('/forum'))
      .finally(() => setLoading(false));
  }, [id, page]);

  const handleLikeThread = async () => {
    if (!user) return toast.error('Musisz być zalogowany');
    try {
      const res = await api.post('/likes/toggle', { threadId: parseInt(id) });
      setThread((prev) => ({
        ...prev,
        userLiked: res.data.liked,
        likeCount: res.data.liked ? prev.likeCount + 1 : prev.likeCount - 1,
      }));
    } catch { toast.error('Błąd'); }
  };

  const handleLikePost = async (postId) => {
    if (!user) return toast.error('Musisz być zalogowany');
    try {
      const res = await api.post('/likes/toggle', { postId });
      setPosts((prev) => prev.map((p) =>
        p.id === postId ? { ...p, userLiked: res.data.liked, likeCount: res.data.liked ? p.likeCount + 1 : p.likeCount - 1 } : p
      ));
    } catch { toast.error('Błąd'); }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/posts/thread/${id}`, { content: newPost });
      setNewPost('');
      loadPosts();
      toast.success('Odpowiedź dodana');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Błąd');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteThread = async () => {
    if (!confirm('Na pewno chcesz usunąć ten wątek?')) return;
    try {
      await api.delete(`/threads/${id}`);
      toast.success('Wątek usunięty');
      navigate('/forum');
    } catch { toast.error('Błąd usuwania'); }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Na pewno chcesz usunąć ten post?')) return;
    try {
      await api.delete(`/posts/${postId}`);
      loadPosts();
      toast.success('Post usunięty');
    } catch { toast.error('Błąd usuwania'); }
  };

  if (loading) return <div className="text-center text-gray-400 py-12">Ładowanie...</div>;
  if (!thread) return null;

  const canModify = user && (user.id === thread.userId || user.role === 'admin' || user.role === 'moderator');

  return (
    <div>
      <Link to={thread.category ? `/forum/category/${thread.category.id}` : '/forum'} className="inline-flex items-center gap-1 text-gray-400 hover:text-primary text-sm no-underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Powrót
      </Link>

      {/* Thread */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {thread.isPinned && <span className="text-xs bg-neon-cyan/20 text-neon-cyan px-2 py-0.5 rounded flex items-center gap-1"><Pin className="w-3 h-3" /> Przypięty</span>}
          {thread.isLocked && <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded flex items-center gap-1"><Lock className="w-3 h-3" /> Zamknięty</span>}
          {thread.category && (
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${thread.category.color}20`, color: thread.category.color }}>
              {thread.category.icon} {thread.category.name}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">{thread.title}</h1>

        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-dark-border">
          <Link to={`/profile/${thread.author?.id}`} className="flex items-center gap-2 no-underline">
            {thread.author?.avatar ? (
              <img src={thread.author.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-dark-border" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {thread.author?.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-white">{thread.author?.username}</div>
              <div className="text-xs text-gray-500">{new Date(thread.createdAt).toLocaleString('pl-PL')}</div>
            </div>
          </Link>
        </div>

        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed mb-4">{thread.content}</div>

        <div className="flex items-center justify-between pt-4 border-t border-dark-border">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {thread.views}</span>
            <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {thread.postCount}</span>
            <button
              onClick={handleLikeThread}
              className={`flex items-center gap-1 transition-colors ${thread.userLiked ? 'text-neon-pink' : 'text-gray-500 hover:text-neon-pink'}`}
            >
              <Heart className={`w-4 h-4 ${thread.userLiked ? 'fill-current' : ''}`} /> {thread.likeCount}
            </button>
          </div>
          {canModify && (
            <button onClick={handleDeleteThread} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Usuń wątek
            </button>
          )}
        </div>
      </div>

      {/* Posts */}
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        Odpowiedzi ({thread.postCount})
      </h2>

      {posts.length === 0 ? (
        <div className="text-center text-gray-400 py-6 bg-dark-card border border-dark-border rounded-xl">
          Brak odpowiedzi. Bądź pierwszy!
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-dark-card border border-dark-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <Link to={`/profile/${post.author?.id}`} className="flex items-center gap-2 no-underline">
                  {post.author?.avatar ? (
                    <img src={post.author.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-dark-border" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {post.author?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-white">{post.author?.username}</span>
                    {post.author?.role !== 'user' && (
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${post.author?.role === 'admin' ? 'bg-neon-pink/20 text-neon-pink' : 'bg-neon-cyan/20 text-neon-cyan'}`}>
                        {post.author?.role}
                      </span>
                    )}
                  </div>
                </Link>
                <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString('pl-PL')}</span>
              </div>

              <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{post.content}</div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border/50">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center gap-1 text-sm transition-colors ${post.userLiked ? 'text-neon-pink' : 'text-gray-500 hover:text-neon-pink'}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${post.userLiked ? 'fill-current' : ''}`} /> {post.likeCount}
                </button>
                {user && (user.id === post.userId || user.role !== 'user') && (
                  <button onClick={() => handleDeletePost(post.id)} className="text-red-400/60 hover:text-red-400 text-xs flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Usuń
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded text-sm ${p === page ? 'bg-primary text-white' : 'bg-dark-card text-gray-400 hover:bg-dark-border'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* New Post Form */}
      {user && !thread.isLocked ? (
        <form onSubmit={handleSubmitPost} className="bg-dark-card border border-dark-border rounded-xl p-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Napisz odpowiedź..."
            className="w-full bg-dark border border-dark-border rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary resize-none min-h-[100px] text-sm"
            rows={4}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !newPost.trim()}
              className="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> {submitting ? 'Wysyłanie...' : 'Odpowiedz'}
            </button>
          </div>
        </form>
      ) : thread.isLocked ? (
        <div className="text-center text-yellow-500 py-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm">
          🔒 Wątek jest zamknięty — nie można dodawać odpowiedzi.
        </div>
      ) : (
        <div className="text-center text-gray-400 py-4 bg-dark-card border border-dark-border rounded-xl text-sm">
          <Link to="/login" className="text-primary no-underline hover:underline">Zaloguj się</Link>, aby odpowiedzieć.
        </div>
      )}
    </div>
  );
}
