import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import LazyItemCard from "./LazyItemCard";
import { useTranslation } from "react-i18next";

export default function RelatedProducts({ category = {}, currentProductId }) {
  const [relatedItems, setRelatedItems] = useState([]);
  const { i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    const extractCategories = (catObj) => {
      if (!catObj) return [];
      const langs = Object.values(catObj); // tr, en, ar
      return langs
        .flatMap((str) =>
          str
            ?.split(",")
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean)
        )
        .filter((v, i, a) => a.indexOf(v) === i); // benzersiz
    };

    const fetchRelated = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const allProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const currentCats = extractCategories(category);

      const filtered = allProducts.filter((item) => {
        if (item.id === currentProductId) return false;
        const itemCats = extractCategories(item.category);
        return itemCats.some((cat) => currentCats.includes(cat));
      });

      const localized = filtered.map((item) => ({
        ...item,
        title: item.name?.[lang] || "",
      }));

      setRelatedItems(localized);
    };

    if (category) fetchRelated();
  }, [category, currentProductId, lang]);

  if (relatedItems.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-xl font-bold mb-6">
        {lang === "tr"
          ? "Benzer Ürünler"
          : lang === "en"
          ? "Related Products"
          : "منتجات مشابهة"}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {relatedItems.map((item) => (
          <LazyItemCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
