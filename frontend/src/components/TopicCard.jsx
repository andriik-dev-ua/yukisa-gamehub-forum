import { Link } from 'react-router-dom';
import { FaComment, FaEye, FaHeart } from 'react-icons/fa';

export default function TopicCard({ topic }) {
  return (
    <article className="card topic-card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <span className="badge rounded-pill" style={{ background: topic.category?.color }}>{topic.category?.icon} {topic.category?.name}</span>
          {topic.isPinned && <span className="badge bg-warning text-dark">Przypięty</span>}
        </div>
        <h3 className="h5 mt-3"><Link to={`/topics/${topic._id}`} className="stretched-link text-decoration-none">{topic.title}</Link></h3>
        <p className="text-secondary line-clamp">{topic.content}</p>
        <div className="d-flex align-items-center gap-2 small text-secondary">
          <img src={topic.author?.avatar} alt="avatar" className="avatar-sm" /> {topic.author?.username}
        </div>
      </div>
      <div className="card-footer d-flex gap-3 small text-secondary">
        <span><FaHeart /> {topic.likesCount || 0}</span><span><FaComment /> {topic.commentsCount || 0}</span><span><FaEye /> {topic.views || 0}</span>
      </div>
    </article>
  );
}
