const DB_NAME = "soil_snap_db";
const DB_VERSION = 1;
const STORE_PENDING = "pending";
const STORE_DATA = "data";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_PENDING))
        db.createObjectStore(STORE_PENDING, { keyPath: "id", autoIncrement: true });
      if (!db.objectStoreNames.contains(STORE_DATA))
        db.createObjectStore(STORE_DATA, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addPending(op) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_PENDING, "readwrite");
    tx.objectStore(STORE_PENDING).add(op);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

export async function getAllPending() {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_PENDING, "readonly");
    const req = tx.objectStore(STORE_PENDING).getAll();
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

export async function deletePending(id) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_PENDING, "readwrite");
    tx.objectStore(STORE_PENDING).delete(id);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

export async function putData(item) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_DATA, "readwrite");
    console.log(tx);
    tx.objectStore(STORE_DATA).put(item);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

export async function getData(id) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_DATA, "readonly");
    console.log(tx);
    const req = tx.objectStore(STORE_DATA).get(id);
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}