import { useImagePredictor } from '../../hooks/useImagePredictor';
import { useCamera } from '../../hooks/useCamera';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import api from '../../utils/api';
import React, { useState } from "react";
import { toast } from 'react-toastify';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationMarker({ setClickedPos }) {
  const [markerPos, setMarkerPos] = useState(null);
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPos([lat, lng]);
      setClickedPos([lat, lng]);
    },
  });

  React.useEffect(() => {
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMarkerPos([lat, lng]);
          setClickedPos([lat, lng]);
          map.setView([lat, lng], 13);
        },
        () => {
          // If denied or fails, fallback to default
          const defaultLatLng = [10.3333, 125.1667];
          setMarkerPos(defaultLatLng);
          setClickedPos(defaultLatLng);
          map.setView(defaultLatLng, 10);
        }
      );
    } else {
      // Browser doesn’t support Geolocation
      const defaultLatLng = [10.3333, 125.1667];
      setMarkerPos(defaultLatLng);
      setClickedPos(defaultLatLng);
      map.setView(defaultLatLng, 10);
    }
  }, [map, setClickedPos]);

  return markerPos ? (
    <Marker position={markerPos}>
      <Popup>
        <b>Pinned Location</b>
        <br />
        Lat: {markerPos[0].toFixed(5)}, Lng: {markerPos[1].toFixed(5)}
      </Popup>
    </Marker>
  ) : null;
}

function Predictor() {
  const {
    fileInputRef,
    selectedImage,
    imagePreview,
    prediction,
    loading,
    error,
    handleImageSelect,
    resetForm,
    handleImageUpload,
    getConfidenceColor,
    getConfidenceTextColor,
    setSelectedImage,
    setImagePreview,
    setError,
    selectedCrop,
    isOpen,
    openModal,
    closeModal,
    setLoading
  } = useImagePredictor();

  const {
    videoRef,
    canvasRef,
    showCamera,
    openCamera,
    capturePhoto,
    closeCamera
  } = useCamera();

  const [pos] = useState([10.3333, 125.1667]); // Default center
  const [clickedPos, setClickedPos] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, "") : "";

  function getCropImageUrl(crop) {
  if (!crop) return "";

  // 1️⃣ Prefer cached imageData first (works online or offline)
  if (crop.imageData) return crop.imageData;

  const img = (crop.image || "").trim();
  const base = API_BASE ? API_BASE.replace(/\/$/, "") : "";

  // 2️⃣ Direct URLs
  if (img.startsWith("data:") || img.startsWith("http")) return img;

  // 3️⃣ Server paths
  if (img.startsWith("/")) return `${base}${img}`;

  // 4️⃣ Default uploads path
  return `${base}/uploads/crops/${img}`.replace(/([^:]\/)\/+/g, "$1");
}
  
  const handleGetCoords = async () => {

    if(!navigator.onLine) {
      closeModal();
      toast.error("You are offline. Please connect to the internet to save location.");
      return;
    }

    if (clickedPos) {
      const formData = new FormData();
      formData.append("soil_classification", prediction.prediction);
      formData.append("latitude", clickedPos[0]);
      formData.append("longitude", clickedPos[1]);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      closeModal();
      setLoading(true);
      try {
        await api.post("/api/location", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Location saved successfully");
      } catch (error) {
        console.error("Error saving location:", error);
      } finally {
        setLoading(false);
        resetForm();
      }
    } else {
      alert("Click on the map to set a location first!");
    }
  };

  const handleCameraCapture = async () => {
    const capturedFile = await capturePhoto();
    if (capturedFile) {
      setSelectedImage(capturedFile);
      setImagePreview(URL.createObjectURL(capturedFile));
      setError("");
    }
  };
   
  const handleFileSelect = (e) => {
    handleImageSelect(e);
    closeCamera();
  };

  const handleOpenCamera = () => {
    setSelectedImage(null);
    setImagePreview(null);
    openCamera();
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-5 font-sans mt-10 space-y-8">

        {/* HERO SECTION */}
        {!showCamera && !imagePreview && (
          <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-green-200 dark:border-gray-700">
            <div className="relative aspect-video flex items-center justify-center overflow-hidden rounded-t-2xl">
              <img
                src="/images/feature/farming.jpeg"
                alt="Soil background"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-green-900/50 dark:bg-green-900/40"></div>
              <div className="relative z-10 text-center px-4">
                <h1 className="text-xl sm:text-4xl font-bold text-white mb-3">
                  Bring Life from the Soil
                </h1>
                <p className="text-white/90 dark:text-gray-200 text-base text-sm sm:text-lg max-w-xl mx-auto">
                  Upload or capture your soil image and let nature tell its story.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 px-6 sm:px-10 py-8 bg-white dark:bg-gray-900 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
                <label
                  htmlFor="fileInput"
                  className="flex items-center justify-center cursor-pointer w-full sm:w-48 py-3 text-sm font-medium text-white bg-green-500 dark:bg-green-600 rounded-lg shadow hover:bg-green-600 dark:hover:bg-green-700 transition-all duration-300 hover:bg-green-600 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16V4H4zm4 8l4 4 4-4" />
                  </svg>
                  Upload Image
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  id="fileInput"
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={handleOpenCamera}
                  disabled={loading}
                  className="flex items-center justify-center w-full sm:w-48 py-3 text-sm font-semibold text-white bg-green-500 dark:bg-green-600 rounded-lg shadow hover:bg-green-600 dark:hover:bg-green-700 transition-all duration-300 hover:bg-green-600 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Open Camera
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CAMERA SECTION */}
        {showCamera && !imagePreview && (
          <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="relative w-full bg-black rounded-t-2xl h-64 sm:h-80 md:h-96">
              <video ref={videoRef} className="w-full h-full object-cover rounded-t-2xl" autoPlay playsInline />
            </div>

            <div className="flex flex-col items-center justify-center gap-4 bg-white dark:bg-gray-900 rounded-b-2xl px-6 sm:px-10 py-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
                <button
                  type="button"
                  onClick={handleCameraCapture}
                  className="w-full sm:w-48 py-2 mx-5 sm:mx-0 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Capture
                </button>
                <button
                  type="button"
                  onClick={closeCamera}
                  className="w-full sm:w-48 py-2 mx-5 sm:mx-0 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        )}

        {/* IMAGE PREVIEW */}
        {imagePreview && !showCamera && (
          <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="relative w-full bg-black rounded-t-2xl h-64 sm:h-80 md:h-96">
              <img src={imagePreview} alt="Selected soil" className="w-full h-full object-cover rounded-t-2xl" />
            </div>
            {/* ACTION BUTTONS */}
            {selectedImage && !showCamera && (
             <div className="mt-7 mb-7 flex flex-col md:flex-row flex-wrap gap-3 px-6 sm:px-10 justify-center items-center w-full">
              {!prediction && (
                <button
                  onClick={handleImageUpload}
                  disabled={!selectedImage || loading}
                  className="w-full sm:w-48 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Analyzing...' : 'Analyze Soil'}
                </button>
              )}

              <button
                onClick={resetForm}
                disabled={loading}
                className="w-full sm:w-48 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Reset
              </button>

              {prediction && (
                <button
                  onClick={openModal}
                  disabled={loading}
                  className="w-full sm:w-48 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Set Location
                </button>
              )}
            </div>

            )}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-500 text-red-700 p-4 rounded text-center mt-4">
            <p>{error}</p>
          </div>
        )}

        {/* PREDICTION RESULT */}
         {prediction?.alternatives?.length > 0 && (
          <div className="mt-3">
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Distribution</h5>
            <ul className="space-y-3">
              {prediction.alternatives
                .filter((alt) => !alt.prediction.toLowerCase().includes('non-soil'))  // Filter out "Non-soil" predictions
                .slice(0, 1) 
                .map((alt) => (
                  <li key={alt.prediction} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700 dark:text-gray-200 capitalize">{alt.prediction}</span>
                        <span className={`text-sm font-medium ${getConfidenceTextColor(alt.confidence || 0)}`}>
                          {(alt.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                        <div
                          className={`${getConfidenceColor(alt.confidence || 0)} h-full rounded transition-all`}
                          style={{ width: `${(alt.confidence || 0) * 100}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}

      </div>

      {/* MODAL MAP SECTION */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[1000px] m-4">
        <div className="relative w-full max-w-[1000px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Map</h4>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Locate where you captured the soil sample.</p>
          <div className="h-[70vh] rounded-2xl border border-gray-200 overflow-hidden">
            <MapContainer center={pos} zoom={10} className="w-full h-full z-10">
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker setClickedPos={setClickedPos} />
            </MapContainer>
          </div>
          <div className="flex justify-end mt-6">
            <Button size="sm" onClick={handleGetCoords}>Done</Button>
          </div>
        </div>
      </Modal>

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-[9999]">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mb-5"></div>
          <p className="text-white text-lg font-bold">Analyzing soil...</p>
        </div>
      )}

      {/* CROP RECOMMENDATION */}
      {prediction && !error && (
        <div>
        <h3 className="text-center text-gray-800 mb-5 text-xl font-semibold dark:text-white">
          Crop Recommendation
        </h3>

        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 p-5 shadow-md gap-6 bg-white dark:bg-gray-900 rounded-2xl">
          {selectedCrop.map((crop) => (
            <div className="flex items-center justify-center" key={crop._id}>
              <div className="relative w-full h-full flex flex-col rounded overflow-hidden shadow-lg bg-gray-50 dark:bg-gray-800">

                {/* Badge */}
                <span className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded bg-green-600 text-white">
                  Highly recommended
                </span>

                {/* Image */}
                <img
                  className="w-full h-80 object-cover"
                  src={getCropImageUrl(crop)}
                  alt={crop.name}
                  onError={(e) => { e.currentTarget.src = "/fallback-crop.png"; }}
                />

                {/* Content */}
                <div className="px-6 py-4 flex flex-col flex-grow">
                  <div className="font-bold text-xl mb-2 dark:text-white">
                    {crop.name}
                  </div>

                  {/* Description - full text */}
                  <p className="text-gray-700 dark:text-gray-300 flex-grow">
                    {crop.description}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </>
  );
}

export default Predictor;
