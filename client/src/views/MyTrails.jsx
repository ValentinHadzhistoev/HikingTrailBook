import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TrailCard from "../components/TrailCard";
import { useAuth } from "../hooks/useAuth";
import * as trailsApi from "../api/trails";

export default function MyTrails() {
    const { userId } = useAuth();
    const [trails, setTrails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        trailsApi
            .getByOwner(userId)
            .then((result) => {
                if (!ignore) setTrails(result);
            })
            .catch((err) => {
                if (!ignore)
                    setError(err.message || "Could not load your trails.");
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [userId]);
    return (
        <section className="container page">
            <h1>My Trails</h1>

            {loading && (
                <p className="status-message">Loading your trails...</p>
            )}
            {error && <p className="form-error">{error}</p>}

            {!loading && !error && trails.length === 0 && (
                <div className="status-message">
                    <p>You haven&apos;t added any trails yet.</p>
                    <Link to="/trails/create" className="btn">
                        Create your first trail
                    </Link>
                </div>
            )}

            <div className="card-grid">
                {trails.map((trail) => (
                    <TrailCard key={trail._id} trail={trail} />
                ))}
            </div>
        </section>
    );
}
