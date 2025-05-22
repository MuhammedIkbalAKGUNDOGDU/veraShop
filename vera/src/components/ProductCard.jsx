import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CATEGORY_OPTIONS = [
  {
    key: "aydinlatma",
    labels: { tr: "AYDINLATMA", en: "LIGHTING", ar: "إضاءة" },
  },
  { key: "ayna", labels: { tr: "AYNA", en: "MIRROR", ar: "مرآة" } },
  {
    key: "saklama",
    labels: {
      tr: "SAKLAMA ÜNİTELERİ",
      en: "STORAGE UNITS",
      ar: "وحدات التخزين",
    },
  },
  {
    key: "oturma",
    labels: { tr: "OTURMA GRUBU", en: "SEATING GROUP", ar: "مجموعة الجلوس" },
  },
  {
    key: "masa",
    labels: {
      tr: "MASA & SEHPA",
      en: "TABLE & COFFEE TABLE",
      ar: "طاولة و طاولة قهوة",
    },
  },
  {
    key: "tamamlayici",
    labels: {
      tr: "TAMAMLAYICI ÜRÜNLER",
      en: "COMPLEMENTARY ITEMS",
      ar: "منتجات مكملة",
    },
  },
  {
    key: "hediye",
    labels: { tr: "HEDİYE FİKİRLERİ", en: "GIFT IDEAS", ar: "أفكار هدايا" },
  },
  {
    key: "koleksiyon",
    labels: {
      tr: "KOLEKSİYON",
      en: "COLLECTION",
      ar: "مجموعة",
    },
  },
  { key: "tablo", labels: { tr: "TABLO", en: "PAINTING", ar: "لوحة" } },
];

export default function ProductCard(props) {
  const {
    id,
    mainCategory,
    title,
    price,
    imageUrls = [],
    coverIndex1 = 0,
    coverIndex2 = 1,
    sold = false, // <-- ekle
  } = props;

  console.log(props);
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();

  const image1 = imageUrls[coverIndex1] || "";
  const image2 = imageUrls[coverIndex2] || "";

  const categoryLabel =
    CATEGORY_OPTIONS.find((cat) => cat.key === mainCategory)?.labels?.[lang] ||
    mainCategory;

  const [hovered, setHovered] = useState(false);
  const [loaded1, setLoaded1] = useState(false);
  const [loaded2, setLoaded2] = useState(false);

  const handleClick = () => {
    navigate(`/product/${id}`, { state: { ...props } });
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full max-w-sm h-full flex flex-col cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Görsel Alanı */}
      <div className="relative w-full aspect-square overflow-hidden rounded shadow-lg bg-gray-100">
        {sold && (
          <div className="absolute top-0 right-0 z-20 overflow-hidden w-[75px] h-[75px]">
            <div className="bg-red-600 text-white text-[10px] font-bold absolute left-[-35px] top-[18px] w-[150px] text-center rotate-[45deg] shadow-md">
              {t("sold")}
            </div>
          </div>
        )}
        {/* Loading placeholder */}
        {(!loaded1 || !loaded2) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 z-10">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-2" />
          </div>
        )}

        {/* Görsel 1 */}
        <img
          src={image1}
          alt={title}
          onLoad={() => setLoaded1(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            hovered ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Görsel 2 */}
        <img
          src={image2}
          alt={title}
          onLoad={() => setLoaded2(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Hover katmanı */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-white text-sm font-semibold tracking-wide">
            {t("quick_view")}
          </span>
        </div>
      </div>

      {/* Bilgiler */}
      <div className="mt-3 text-center flex flex-col justify-between flex-grow">
        <p className="text-xs text-gray-500 tracking-wide uppercase">
          {categoryLabel}
        </p>
        <h3 className="text-base text-gray-500 font-medium mt-1">{title}</h3>
        <p className="text-md font-bold mt-1">{price}</p>
      </div>
    </div>
  );
}
