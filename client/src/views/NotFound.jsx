import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="container page">
      <h1>404 - Page not found</h1>
      <Link to="/" className="btn">
        Back to home
      </Link>
    </section>
  )
}