import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import LazyItemCard from "../components/LazyItemCard";
import Header from "../components/Header";
import { ArrowUp } from "lucide-react";
import { t } from "i18next";
import FloatingIcons from "../components/FloatingIcons";
import Footer from "../components/footer";

export default function ProductCategory() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { category } = useParams(); // 👈 gelen URL parametresi (her zaman Türkçe)
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "products"));

      const data = snapshot.docs
        .map((doc) => {
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
            coverIndex1: d.coverIndex1 ?? 0,
            coverIndex2: d.coverIndex2 ?? 1,
            sold: d.sold ?? false,
          };
        })
        .sort((a, b) => (a.sold === b.sold ? 0 : a.sold ? 1 : -1));

      const filtered = data.filter((item) => {
        const catText = item.mainCategory || "";
        const categories = catText
          .split(",")
          .map((c) => c.trim().toLowerCase());
        return categories.includes(category.toLowerCase());
      });

      setItems(filtered);
      setLoading(false);
    };

    fetchProducts();
  }, [category, lang]);

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
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Header page="products" textcolor="text-black" />
        <FloatingIcons
          rightLinks={{
            whatsapp: "https://wa.me/905393412716",
          }}
        />
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            <span className="ml-3 text-gray-700 text-sm">
              {t("product_loading")}
            </span>
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500">{t("no_products_found")} </p>
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
      <Footer
        instagramLink="https://instagram.com/verarooom"
        emailLink="mailto:verarooom@gmail.com"
      />{" "}
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
