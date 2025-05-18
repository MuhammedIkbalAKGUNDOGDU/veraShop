import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

export default function ProductDeleter() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSelect = (id) => {
    const found = products.find((p) => p.id === id);
    setSelected(found);
  };

  const handleDelete = async () => {
    if (!selected) return;

    const confirm = window.confirm(`“${selected.name.tr}” silinsin mi?`);
    if (!confirm) return;

    setLoading(true);
    try {
      // 1. Fotoğrafları storage'dan sil
      await Promise.all(
        selected.imageUrls.map((url) => {
          const filePath = decodeURIComponent(
            new URL(url).pathname.split("/o/")[1].split("?")[0]
          );
          const imgRef = ref(storage, filePath);
          return deleteObject(imgRef);
        })
      );

      // 2. Firestore'dan sil
      await deleteDoc(doc(db, "products", selected.id));

      // 3. State güncelle
      setProducts((prev) => prev.filter((p) => p.id !== selected.id));
      setSelected(null);
      alert("Ürün silindi.");
    } catch (err) {
      alert("Silme başarısız: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative border rounded shadow mb-6 p-4 space-y-4">
      <h2 className="text-lg font-semibold">Ürün Sil</h2>

      <select
        className="w-full border p-2"
        onChange={(e) => handleSelect(e.target.value)}
        value={selected?.id || ""}
        disabled={loading}
      >
        <option value="">Ürün seçin</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name.tr}
          </option>
        ))}
      </select>

      {selected && (
        <div className="flex items-center gap-4 mt-4">
          <img
            src={selected.imageUrls[0]}
            alt=""
            className="w-20 h-20 object-cover rounded"
          />
          <div className="flex-1">
            <p className="font-medium">{selected.name.tr}</p>
            <button
              disabled={loading}
              onClick={handleDelete}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              {loading ? "Siliniyor..." : "Sil"}
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center z-10">
          <p className="text-white text-lg font-semibold animate-pulse">
            Silme işlemi yapılıyor...
          </p>
        </div>
      )}
    </div>
  );
}
