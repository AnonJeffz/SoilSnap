import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
};

export default function CropDetails() {
    const { id } = useParams();
    const [crop, setCrop] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/crop/${id}`)
            .then(res => {
                setCrop(res.data.crop);
            })
            .catch(() => setCrop(null))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-5 text-center">Loading...</div>;
    if (!crop) return <div className="p-5 text-center">Crop not found.</div>;

    return (
        <section className="w-full">
            <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
                 <img src={getImageUrl(crop.image)} alt={crop.name} className="w-full h-80 object-cover rounded mb-4" />
            </div>
            <h2 className="text-2xl font-bold mb-4 dark:text-white">{crop.name}</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-200">{crop.description}</p>
            <div>
                <h4 className="font-semibold mb-2 dark:text-white">Soil Classifications:</h4>
                {Array.isArray(crop.soil_id) && crop.soil_id.length > 0 ? (
                    crop.soil_id.map((soil) => (
                        <span
                            key={soil._id}
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                        >
                            {soil.name}
                        </span>
                    ))
                ) : (
                    <span className="text-gray-500">No soil classifications.</span>
                )}
            </div>
        </section>
    );

}