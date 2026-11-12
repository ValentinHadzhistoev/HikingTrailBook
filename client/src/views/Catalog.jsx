import { useEffect, useState } from 'react'
import TrailCard from '../components/TrailCard'
import * as trailsApi from '../api/trails'
import { DIFFICULTIES } from '../utils/validateTrail'

export default function Catalog() {
  const [trails, setTrails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')

  useEffect(() => {
    let ignore = false

    trailsApi
      .getAll()
      .then((result) => {
        if (!ignore) setTrails(result)
      })
      .catch((err) => {
        if (!ignore) setError(err.message || 'Could not load trails.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  const visibleTrails = trails.filter(
    (trail) =>
      trail.name.toLowerCase().includes(search.toLowerCase()) &&
      (difficulty === '' || trail.difficulty === difficulty)
  )

  return (
    <section className="container page">
      <h1>All Trails</h1>

      <div className="filters">
        <input
          type="search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">All difficulties</option>
          {DIFFICULTIES.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="status-message">Loading trails...</p>}
      {error && <p className="form-error">{error}</p>}
      {!loading && !error && visibleTrails.length === 0 && (
        <p className="status-message">No trails found.</p>
      )}

      <div className="card-grid">
        {visibleTrails.map((trail) => (
          <TrailCard key={trail._id} trail={trail} />
        ))}
      </div>
    </section>
  )
}