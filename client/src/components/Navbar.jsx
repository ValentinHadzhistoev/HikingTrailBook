import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Navbar.css'

const guestLinks = [
  { to: '/', label: 'Home' },
  { to: '/trails', label: 'Trails' },
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
]

const userLinks = [
  { to: '/', label: 'Home' },
  { to: '/trails', label: 'Trails' },
  { to: '/trails/create', label: 'Create' },
  { to: '/profile', label: 'My Trails' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, logoutHandler } = useAuth()
  const isHome = pathname === '/'
  const links = isAuthenticated ? userLinks : guestLinks

  const onLogout = async () => {
    setMenuOpen(false)
    await logoutHandler()
    navigate('/')
  }

  return (
    <header className={`navbar ${isHome ? 'navbar-overlay' : 'navbar-solid'}`}>
      <nav className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          TrailBook
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end onClick={() => setMenuOpen(false)}>
                {link.label}
              </NavLink>
            </li>
          ))}
          {isAuthenticated && (
            <li>
              <button type="button" className="navbar-logout" onClick={onLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}