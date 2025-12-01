// Simple IndexedDB helper
const DB_NAME = "soil_snap_offline_db";
const STORE = "recommendations";

export async function saveRecommendation(key, data) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };

    req.onsuccess = () => {
      const tx = req.result.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(data, key);
      tx.oncomplete = resolve;
    };

    req.onerror = reject;
  });
}

export async function getRecommendation(key) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onsuccess = () => {
      const tx = req.result.transaction(STORE, "readonly");
      const getReq = tx.objectStore(STORE).get(key);
      getReq.onsuccess = () => resolve(getReq.result);
      getReq.onerror = reject;
    };
  });
}
