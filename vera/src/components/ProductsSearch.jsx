import { useEffect, useMemo, useRef, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function ProductSearch({ color = "text-white" }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          name: d.name || {},
          full: {
            ...d,
            id: doc.id,
            price:
              d.price?.toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY",
              }) || "",
          },
        };
      });
      setAllProducts(data);
    };
    fetchProducts();
  }, []);

  // Dış tıklama ile kapat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return allProducts.filter((p) => p.name?.[lang]?.toLowerCase().includes(q));
  }, [query, allProducts, lang]);

  return (
    <div className="relative">
      <button
        onClick={() => setSearchOpen(true)}
        className={`opacity-70 cursor-pointer hover:opacity-100 transition-opacity ${color}`}
      >
        <Search size={20} />
      </button>

      {searchOpen && (
        <>
          {/* Arka plan gölgesi ve blur */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"></div>

          {/* Arama kutusu */}
          <div
            ref={dropdownRef}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl mx-auto z-50 p-4"
          >
            <div className="flex items-center bg-white/30 backdrop-blur-md shadow-lg rounded-full px-4 py-2">
              <input
                autoFocus
                type="text"
                placeholder={t("search_product") || "Ara..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder-white/70"
              />
              <Search size={20} className="text-white opacity-80" />
            </div>

            {/* Sonuçlar */}
            {query && (
              <div className="mt-4 bg-white/70 backdrop-blur-md rounded-lg shadow-lg max-h-72 overflow-y-auto">
                {filtered.length > 0 ? (
                  <ul className="divide-y divide-white/40">
                    {filtered.map((p) => {
                      const coverIndex = p.full.coverIndex1 || 0;
                      const imageUrl = p.full.imageUrls?.[coverIndex];
                      return (
                        <li
                          key={p.id}
                          onClick={() => {
                            navigate(`/product/${p.id}`, { state: p.full });
                            setSearchOpen(false);
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-white/90 cursor-pointer transition"
                        >
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={p.name?.[lang]}
                              className="w-10 h-10 object-cover rounded-full border border-white/60"
                            />
                          )}
                          <div className="flex-1">
                            <div className="capitalize text-sm font-medium text-black">
                              {p.name?.[lang]}
                            </div>
                          </div>
                          <div className="capitalize text-sm font-bold text-black whitespace-nowrap">
                            {p.full.price}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-800 p-3">
                    {t("no_products_found")}
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
