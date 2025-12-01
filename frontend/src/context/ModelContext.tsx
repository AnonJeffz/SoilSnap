import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";

type ModelContextType = {
  model: tf.GraphModel | null;
  loading: boolean;
  error: string | null;
  loadModel: (url?: string) => Promise<tf.GraphModel | null>;
};

const ModelContext = createContext<ModelContextType>({
  model: null,
  loading: false,
  error: null,
  loadModel: async () => null,
});

export const ModelProvider: React.FC<{ children: React.ReactNode; modelUrl?: string }> = ({
  children,
  modelUrl = "https://soilsnap-production.up.railway.app/models/model.json", // ✅ your hosted model
}) => {
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  const MODEL_KEY = "soil-model-v1"; // ✅ version your model cache (bump when updated)

  const loadModel = async (url = modelUrl) => {
    if (loadedRef.current && model) return model;

    setLoading(true);
    setError(null);

    try {
      await tf.ready();

      let loadedModel: tf.GraphModel | null = null;

      try {
        console.log("🧠 Trying to load model from IndexedDB...");
        loadedModel = await tf.loadGraphModel(`indexeddb://${MODEL_KEY}`);
        console.log("✅ Loaded model from IndexedDB (offline cache)");
      } catch (e) {
        console.log("⚠️ No cached model found, loading from network...");
        loadedModel = await tf.loadGraphModel(url);
        console.log("✅ Model loaded from network, saving to IndexedDB...");
        await loadedModel.save(`indexeddb://${MODEL_KEY}`);
        console.log("💾 Model saved to IndexedDB for offline use!");
      }

      setModel(loadedModel);
      loadedRef.current = true;
      return loadedModel;
    } catch (e: any) {
      console.error("❌ Model load failed:", e);
      setError(String(e));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Preload model on mount
  useEffect(() => {
    loadModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModelContext.Provider value={{ model, loading, error, loadModel }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModel = () => useContext(ModelContext);
