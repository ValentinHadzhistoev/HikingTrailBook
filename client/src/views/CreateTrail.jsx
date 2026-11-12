import { useNavigate } from "react-router-dom";
import TrailForm from "../components/TrailForm";
import * as trailsApi from "../api/trails";

const emptyTrail = {
    name: "",
    location: "",
    difficulty: "",
    length: "",
    imageUrl: "",
    description: "",
};

export default function CreateTrail() {
    const navigate = useNavigate();

    const saveTrail = async (data) => {
        const created = await trailsApi.create(data);
        navigate(`/trails/${created._id}`);
    };
    return (
        <TrailForm
            title="Create Trail"
            initialValues={emptyTrail}
            submitLabel="Create"
            onSave={saveTrail}
        />
    );
}
