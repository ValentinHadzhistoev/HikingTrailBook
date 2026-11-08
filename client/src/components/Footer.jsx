import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-columns">
          <div>
            <h2 className="footer-logo">TrailBook</h2>
            <p className="footer-text">
              A community for sharing hiking trails. Find your next route, rate it, and add your own.
            </p>
          </div>
          <div>
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/trails">Trails</Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} TrailBook | Design based on Travelluv by{' '}
          <a href="https://templatesjungle.com/" target="_blank" rel="noreferrer">
            TemplatesJungle
          </a>
        </p>
      </div>
    </footer>
  )
}