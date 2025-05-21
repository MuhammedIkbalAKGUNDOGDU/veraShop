// components/ProductMarker.jsx
import { useEffect, useState } from "react";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ProductMarker() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(items);
  };

  const markAsSold = async (id) => {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, { sold: true });
    await fetchProducts(); // Güncelleme sonrası listeyi yenile
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="border rounded shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Ürünleri Satıldı Olarak İşaretle</h2>
      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex justify-between items-center border p-2 rounded">
            <span>{p.name?.tr || "İsimsiz ürün"}</span>
            {p.sold ? (
              <span className="text-green-600 font-semibold">Satıldı</span>
            ) : (
              <button
                onClick={() => markAsSold(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Satıldı Olarak İşaretle
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
