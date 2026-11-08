import { Link } from 'react-router-dom'
import './TrailCard.css'

export default function TrailCard({ trail }) {
  return (
    <article className="trail-card">
      <div className="trail-card-image">
        <img src={trail.imageUrl} alt={trail.name} />
      </div>
      <div className="trail-card-body">
        <span className="trail-card-meta">
          {trail.difficulty} · {trail.length} km
        </span>
        <h3 className="trail-card-title">
          <Link to={`/trails/${trail._id}`}>{trail.name}</Link>
        </h3>
        <p className="trail-card-location">{trail.location}</p>
      </div>
    </article>
  )
}