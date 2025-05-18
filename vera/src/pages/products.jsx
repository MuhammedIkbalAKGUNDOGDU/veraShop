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
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.name?.[lang] || "",
          description: d.description?.[lang] || "",
          features: d.features?.[lang] || [],
          category: d.category?.[lang] || "",
          price: d.price?.toLocaleString("tr-TR", {
            style: "currency",
            currency: "TRY",
          }),
          image1: d.imageUrls?.[0] || "",
          image2: d.imageUrls?.[1] || "",
        };
      });
      setItems(data);
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-stretch">
          {items.map((item) => (
            <LazyItemCard key={item.id} {...item} />
          ))}
        </div>
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
