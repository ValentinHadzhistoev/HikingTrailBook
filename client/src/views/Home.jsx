import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import TrailCard from "../components/TrailCard";
import * as trailsApi from "../api/trails";

export default function Home() {
    const [trails, setTrails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        trailsApi
            .getAll()
            .then((result) => {
                if (!ignore) setTrails(result.slice(0, 4));
            })
            .catch((err) => {
                if (!ignore) setError(err.message || "Could not load trails.");
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, []);
    return (
        <>
            <Hero />
            <section className="section section-light">
                <div className="container">
                    <h2 className="section-title">Latest Trails</h2>

                    {loading && (
                        <p className="status-message">Loading trails...</p>
                    )}
                    {error && <p className="form-error">{error}</p>}
                    {!loading && !error && trails.length === 0 && (
                        <p className="status-message">
                            No trails yet. Be the first to add one!
                        </p>
                    )}

                    <div className="card-grid">
                        {trails.map((trail) => (
                            <TrailCard key={trail._id} trail={trail} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
