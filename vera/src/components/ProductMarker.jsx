import { useEffect, useState } from "react";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ProductMarker() {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
    await fetchProducts();
  };

  useEffect(() => {
    if (isOpen) fetchProducts();
  }, [isOpen]);

  // Arama terimine göre filtreleme
  const filteredProducts = products.filter((p) =>
    (p.name?.tr || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border rounded mb-6">
      {/* Toggle başlık */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-2 font-semibold hover:bg-gray-100"
      >
        <span>Ürün Satıldı İşaretleme</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="p-4 border-t space-y-2">
          <h2 className="text-base font-medium">
            Ürünleri Satıldı Olarak İşaretle
          </h2>

          {/* Arama kutusu */}
          <input
            type="text"
            placeholder="Ürün adına göre ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2 text-sm"
          />

          {filteredProducts.length === 0 ? (
            <p className="text-sm text-gray-500">Ürün bulunamadı.</p>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center border p-2 rounded"
              >
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
            ))
          )}
        </div>
      )}
    </div>
  );
}
