import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import * as trailsApi from "../api/trails";

export default function Details() {
    const { trailId } = useParams();
    const { userId } = useAuth();
    const navigate = useNavigate();

    const [trail, setTrail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        trailsApi
            .getOne(trailId)
            .then((result) => {
                if (!ignore) setTrail(result);
            })
            .catch((err) => {
                if (!ignore)
                    setError(err.message || "Could not load the trail.");
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [trailId]);

    const deleteHandler = async () => {
        if (!window.confirm(`Delete "${trail.name}"?`)) return;

        try {
            await trailsApi.remove(trailId);
            navigate("/trails");
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <section className="container page">
                <p className="status-message">Loading trail...</p>
            </section>
        );
    }
    if (!trail) {
        return (
            <section className="container page">
                <p className="form-error">{error || "Trail not found."}</p>
                <Link to="/trails" className="btn">
                    Back to trails
                </Link>
            </section>
        );
    }

    const isOwner = userId === trail._ownerId;

    return (
        <section className="container page details">
            <img
                className="details-image"
                src={trail.imageUrl}
                alt={trail.name}
            />

            <h1>{trail.name}</h1>

            <p className="details-meta">
                {trail.location} · {trail.difficulty} · {trail.length} km
            </p>

            <p className="details-description">{trail.description}</p>

            {error && <p className="form-error">{error}</p>}

            {isOwner && (
                <div className="details-actions">
                    <Link to={`/trails/${trailId}/edit`} className="btn">
                        Edit
                    </Link>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={deleteHandler}
                    >
                        Delete
                    </button>
                </div>
            )}
        </section>
    );
}
