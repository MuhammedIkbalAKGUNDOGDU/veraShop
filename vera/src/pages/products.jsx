import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import LazyItemCard from "../components/LazyItemCard";
import Header from "../components/Header";
import { ArrowUp } from "lucide-react";

export default function Products() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // 🟡 Yükleniyor state
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // ⏳ Yükleme başlat
      const snapshot = await getDocs(collection(db, "products"));
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          name: d.name || {},
          description: d.description || {},
          features: d.features || {},
          category: d.category || {},
          price: d.price?.toLocaleString("tr-TR", {
            style: "currency",
            currency: "TRY",
          }),
          imageUrls: d.imageUrls || [],
          mainCategory: d.mainCategory || "",
          coverIndex1: d.coverIndex1 ?? null,
          coverIndex2: d.coverIndex2 ?? null,
        };
      });
      setItems(data);
      setLoading(false); // ✅ Yükleme tamamlandı
    };

    fetchProducts();
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Header page="products" textcolor="text-black" />

        {/* 🔄 Loading ekranı */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            <span className="ml-3 text-gray-700 text-sm">
              Ürünler yükleniyor...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-stretch">
            {items.map((item) => (
              <LazyItemCard
                key={item.id}
                {...item}
                title={item.name?.[lang] || ""}
              />
            ))}
          </div>
        )}
      </div>

      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 border-2 text-black p-3 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 z-50"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
