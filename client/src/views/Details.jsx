import { useParams } from 'react-router-dom'

export default function Details() {
  const { trailId } = useParams()

  return (
    <section className="container page">
      <h1>Trail Details</h1>
      <p>Showing trail with id: {trailId}</p>
    </section>
  )
}