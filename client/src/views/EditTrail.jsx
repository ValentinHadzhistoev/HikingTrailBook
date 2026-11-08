import { useParams } from 'react-router-dom'

export default function EditTrail() {
  const { trailId } = useParams()

  return (
    <section className="container page">
      <h1>Edit Trail</h1>
      <p>Editing trail with id: {trailId}</p>
    </section>
  )
}