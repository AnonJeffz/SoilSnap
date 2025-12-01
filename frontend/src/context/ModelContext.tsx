import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";

type ModelContextType = {
  model: tf.GraphModel | null;
  loading: boolean;
  error: string | null;
  loadModel: () => Promise<tf.GraphModel | null>;
};

const ModelContext = createContext<ModelContextType>({
  model: null,
  loading: false,
  error: null,
  loadModel: async () => null
});

export const ModelProvider = ({ children }: { children: React.ReactNode }) => {
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  const MODEL_KEY = "soil-model-v1";
  const MODEL_URL = "/models/model.json";

  const loadModel = async () => {
    if (loadedRef.current && model) return model;

    setLoading(true);
    setError(null);

    try {
      await tf.ready();

      let loaded: tf.GraphModel;

      // 1. Try IndexedDB first
      try {
        loaded = await tf.loadGraphModel(`indexeddb://${MODEL_KEY}`);
        console.log("Loaded model from IndexedDB");
      } catch {
        console.log("IndexedDB empty → loading from /models/");
        loaded = await tf.loadGraphModel(MODEL_URL);
        console.log("Loaded model from network → saving to IndexedDB");
        await loaded.save(`indexeddb://${MODEL_KEY}`);
      }

      setModel(loaded);
      loadedRef.current = true;
      return loaded;
    } catch (err) {
      console.error(err);
      setError("Failed to load model");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  return (
    <ModelContext.Provider value={{ model, loading, error, loadModel }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModel = () => useContext(ModelContext);
