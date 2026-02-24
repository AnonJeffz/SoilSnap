import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
};

export default function SoilDetails() {
  const { id } = useParams();
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [crops, setCrops] = useState([]);

  useEffect(() => {
        axios.get(`/api/soil/${id}`)
            .then(res => {
                setSoilData(res.data.soil);
                setCrops(res.data.recommendedCrops);
            })
            .catch(() => setSoilData(null))
            .catch(() => setCrops([]))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-5 text-center">Loading...</div>;
    if (!soilData) return <div className="p-5 text-center">Crop not found.</div>;

  return (
    <section className="w-full">
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
                <img src={getImageUrl(soilData.image)} alt={soilData.name} className="w-full h-80 object-cover rounded mb-4" />
        </div>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">{soilData.name}</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">{soilData.description}</p>
        <div>
            <h4 className="font-semibold mb-2 dark:text-white">Recommended Crops:</h4>
            {crops.length > 0 ? (
                crops.map((crop) => (
                    <span
                        key={crop._id}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                    >
                        {crop.name}
                    </span>
                ))
            ) : (
                <span className="text-gray-500">No crop recommendation.</span>
            )}
        </div>
    </section>
  );
}