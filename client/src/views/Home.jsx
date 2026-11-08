import Hero from '../components/Hero'
import TrailCard from '../components/TrailCard'

// TEMPORARY sample data, replaced by API data later
const sample = [1, 2, 3, 4].map((n) => ({
  _id: String(n),
  name: `Sample Trail ${n}`,
  location: 'Rila, Bulgaria',
  difficulty: 'Medium',
  length: 10 + n,
  imageUrl: `https://picsum.photos/seed/trail${n}/600/400`,
}))

export default function Home() {
  return (
    <>
      <Hero />
      <section className="section section-light">
        <div className="container">
          <h2 className="section-title">Latest Trails</h2>
          <div className="card-grid">
            {sample.map((trail) => (
              <TrailCard key={trail._id} trail={trail} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}