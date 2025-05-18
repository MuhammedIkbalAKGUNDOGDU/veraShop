// src/services/productService.js
import { db, storage } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Ürün yükler: Çok dilli içerik ve görsellerle birlikte.
 * @param {object} productData - Çok dilli ürün verileri (name, description, vs.)
 * @param {File[]} imageFiles - Upload edilecek görseller
 */
export async function uploadProduct(productData, imageFiles) {
  const imageUrls = [];

  for (const file of imageFiles) {
    const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    imageUrls.push(url);
  }

  const product = {
    ...productData,
    imageUrls,
    createdAt: new Date().toISOString(),
  };

  await addDoc(collection(db, "products"), product);
}

/**
 * Firestore'dan tüm ürünleri çeker
 * @returns {Promise<Array>} - Ürün listesi
 */
export async function fetchProducts() {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
