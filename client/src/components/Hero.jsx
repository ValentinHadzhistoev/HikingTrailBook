import { Link } from 'react-router-dom'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <p className="hero-subtitle">Share. Explore. Hike.</p>
        <h1 className="hero-title">Mountains are calling</h1>
        <Link to="/trails" className="btn">
          Browse trails
        </Link>
      </div>
    </section>
  )
}