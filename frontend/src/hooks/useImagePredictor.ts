import { useState, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";
import api from "../utils/api";
import { useModal } from "./useModal";
import { useModel } from "../context/ModelContext";
import { putData, getData } from "../lib/offline-db";

// Minimal ambient declaration so TS doesn't error when referencing process.env in the frontend
declare const process: {
  env: {
    REACT_APP_USE_SERVER_PREDICTION?: string;
  };
};

interface PredictionResult {
  prediction: string;
  confidence: number;
  alternatives?: { prediction: string; confidence: number }[];
}

const classNames = [
  "Clay",
  "Loam",
  "Loamy Sand",
  "Non-soil",
  "Sand",
  "Sandy Clay Loam",
  "Sandy Loam",
  "Silt",
  "Silty Clay",
  "Silty Loam",
];

const getTopK = (probs: number[], k = 5) => {
  const indexed = probs.map((p, i) => ({ index: i, p }));
  indexed.sort((a, b) => b.p - a.p);
  return indexed.slice(0, k).map(i => ({ prediction: classNames[i.index], confidence: i.p }));
};

interface Crop {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  [key: string]: unknown;
}

export function useImagePredictor() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isOpen, openModal, closeModal } = useModal();

  const { model, loading: modelLoading } = useModel();

  const MODEL_SERVER_URL = "https://soilsnap-model.up.railway.app/predict";
  const useServerWhenOnline = process.env.REACT_APP_USE_SERVER_PREDICTION === "true";
  console.log("Prediction mode:", useServerWhenOnline ? "Server (Flask API)" : "Client-side (TensorFlow.js)");

  const fileToTensor = async (file: File) => {
    const bitmap = await createImageBitmap(file);
    let tensor = tf.browser.fromPixels(bitmap).toFloat();
    tensor = tf.image.resizeBilinear(tensor, [224, 224]);
    tensor = tensor.div(255.0).expandDims(0);
    return tensor;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setPrediction(null);
      setError("");
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setPrediction(null);
    setError("");
    setSelectedCrop([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      setError("Please upload an image first.");
      return;
    }

    // Branch: if online and configured to use server -> only server path
    if (navigator.onLine && useServerWhenOnline) {
      setLoading(true);
      setError("");
      setPrediction(null);

      try {
        const fd = new FormData();
        fd.append("image", selectedImage);

        const res = await axios.post(MODEL_SERVER_URL, fd, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        });

        if (!res?.data) {
          setError("Invalid response from model server.");
          setLoading(false);
          return;
        }

        // log response for debugging
        console.debug("Model server response:", res.data);

        // build alternatives from any supported server format
        let alternatives: { prediction: string; confidence: number }[] | undefined;

        // 1) full probability vector aligned with classNames
        if (Array.isArray(res.data.probabilities) && res.data.probabilities.length === classNames.length) {
          const probs = res.data.probabilities.map((v: any) => Number(v) || 0);
          alternatives = getTopK(probs, Math.min(5, probs.length));
        }
        // 2) server returns a predictions array (top-K) as objects [{ label, confidence }, ...]
        else if (Array.isArray(res.data.predictions) && res.data.predictions.length > 0) {
          // try to normalize objects like {label,confidence} or {prediction,confidence}
          alternatives = res.data.predictions
            .map((p: any) => {
              if (typeof p === "string") return { prediction: p, confidence: 0 };
              const label = p.label ?? p.prediction ?? p.name ?? null;
              const conf = Number(p.confidence ?? p.probability ?? p.score ?? 0);
              return label ? { prediction: String(label), confidence: conf } : null;
            })
            .filter(Boolean)
            .slice(0, 5) as { prediction: string; confidence: number }[];
        }

        // if we have alternatives, pick top; otherwise fall back to single-class fields
        if (alternatives && alternatives.length > 0) {
          const top = alternatives[0];
          if (!top) {
            setError("Invalid server response.");
            setLoading(false);
            return;
          }
          if (top.confidence < 0.5 || top.prediction === "Non-soil") {
            setError("Image does not appear to be soil.");
            setLoading(false);
            return;
          }
          setPrediction({ prediction: top.prediction, confidence: top.confidence, alternatives });
        } else {
          // fallback: single-class response
          const predictedClass = res.data.prediction ?? (Array.isArray(res.data.predictions) ? res.data.predictions[0] : undefined);
          const confidence = Number(res.data.confidence ?? res.data.probability ?? NaN);

          if (!predictedClass || Number.isNaN(confidence)) {
            setError("Invalid server response.");
            setLoading(false);
            return;
          }

          if (confidence < 0.5 || predictedClass === "Non-soil") {
            setError("Image does not appear to be soil.");
            setLoading(false);
            return;
          }

          setPrediction({ prediction: predictedClass, confidence, alternatives: [{ prediction: predictedClass, confidence }] });
        
        }

        try {
          const payload: any = {
            soil: (res.data.prediction ?? res.data.predictions?.[0]),
          };

          // include full distribution if available (from alternatives or raw probabilities)
          if (alternatives && alternatives.length > 0) {
            payload.soil_distribution = alternatives;
          } else if (Array.isArray(res.data.probabilities) && res.data.probabilities.length === classNames.length) {
            const probs = res.data.probabilities.map((v: any) => Number(v));
            payload.soil_distribution = classNames.map((name, i) => ({ prediction: name, confidence: probs[i] ?? 0 }));
          }

          const response = await api.post("/api/crop/recommendation", payload);
          setSelectedCrop(response.data.recommendations || []);
        } catch (recErr) {
          console.warn("Failed to fetch crop recommendations:", recErr);
        }

        setLoading(false);
        return;
      } catch (err: any) {
        setError("Server prediction failed. Try again.");
        console.warn("Server prediction error:", err);
        setLoading(false);
        return;
      }
    }

    // Else: offline or server usage disabled -> only TFJS path
    if (!model) {
      setError(modelLoading ? "Model is still loading. Load it again." : "The model isn’t available offline. You need to connect to Wi-Fi to load it. Just keep the app open for about 6–7 minutes and it will load automatically.");
      return;
    }

    setLoading(true);
    setError("");
    setPrediction(null);

     try {
      const input = await fileToTensor(selectedImage);
      const output = (await model.executeAsync(input)) as tf.Tensor;
      const probs = Array.from(output.dataSync() as Float32Array);
      tf.dispose([input, output]);

      if (probs.length === 0) {
        setError("Prediction returned no probabilities.");
        setLoading(false);
        return;
      }

      const alternatives = getTopK(probs, Math.min(5, probs.length));
      const top = alternatives[0];
      if (!top) {
        setError("Prediction returned no top class.");
        setLoading(false);
        return;
      }

      const predictedClass = top.prediction;
      const confidence = top.confidence;

      if (confidence < 0.5 || predictedClass === "Non-soil") {
        setError("Image does not appear to be soil.");
        setLoading(false);
        return;
      }

      setPrediction({ prediction: predictedClass, confidence, alternatives });

      // only call backend when we're actually online — otherwise read cached recommendations
      if (navigator.onLine) {
        try {
          const response = await api.post("/api/crop/recommendation", { soil: predictedClass });
          const recs = response.data.recommendations || [];
          setSelectedCrop(recs);

          // cache for offline use
          try {
            await putData({ id: `crop-rec-${predictedClass}`, soil: predictedClass, recommendations: recs });
          } catch (cacheErr) {
            console.warn("Failed to cache recommendations:", cacheErr);
          }
        } catch (recErr) {
          console.warn("Failed to fetch recommendations from API:", recErr);
          // fallback to cached recommendations
          try {
            const cached = await getData(`crop-rec-${predictedClass}`);
            if (cached && cached.recommendations) setSelectedCrop(cached.recommendations);
            else setSelectedCrop([]);
          } catch (dbErr) {
            console.warn("Failed to read cached recommendations:", dbErr);
            setSelectedCrop([]);
          }
        }
      } else {
        // offline -> load cached recommendations only
        try {
          const cached = await getData(`crop-rec-${predictedClass}`);
          if (cached && cached.recommendations) setSelectedCrop(cached.recommendations);
          else setSelectedCrop([]);
        } catch (dbErr) {
          console.warn("Failed to read cached recommendations:", dbErr);
          setSelectedCrop([]);
        }
      }
      
    } catch (err) {
      console.error("Prediction failed:", err);
      setError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.85) return "bg-green-500";
    if (confidence > 0.6) return "bg-yellow-400";
    return "bg-red-500";
  };

  const getConfidenceTextColor = (confidence: number) => {
    if (confidence > 0.85) return "text-green-600";
    if (confidence > 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  return {
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
    selectedCrop,
    isOpen,
    openModal,
    closeModal,
    setLoading,
    setSelectedImage,
    setImagePreview,
    setError,
  };
}