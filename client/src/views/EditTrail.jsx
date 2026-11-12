import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import TrailForm from "../components/TrailForm";
import { useAuth } from "../hooks/useAuth";
import * as trailsApi from "../api/trails";

export default function EditTrail() {
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
            </section>
        );
    }

    if (trail._ownerId !== userId) {
        return <Navigate to={`/trails/${trailId}`} replace />;
    }

    const initialValues = {
        name: trail.name,
        location: trail.location,
        difficulty: trail.difficulty,
        length: trail.length,
        imageUrl: trail.imageUrl,
        description: trail.description,
    };

    const saveTrail = async (data) => {
        await trailsApi.update(trailId, { ...trail, ...data });
        navigate(`/trails/${trailId}`);
    };

    return (
        <TrailForm
            title="Edit Trail"
            initialValues={initialValues}
            submitLabel="Save changes"
            onSave={saveTrail}
        />
    );
}
