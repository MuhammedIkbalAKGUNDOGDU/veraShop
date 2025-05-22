import { useState } from "react";
import { uploadProduct } from "../services/productService";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ImagePlus,
} from "lucide-react";
import imageCompression from "browser-image-compression";

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
    key: "tablo",
    labels: { tr: "TABLO", en: "PAINTING", ar: "لوحة" },
  },
  {
    key: "koleksiyon",
    labels: {
      tr: "KOLEKSİYON",
      en: "COLLECTION",
      ar: "مجموعة",
    },
  },
];

const initialLangFields = { tr: "", en: "", ar: "" };

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(true);
  const [message, setMessage] = useState(null);
  const [product, setProduct] = useState({
    name: { ...initialLangFields },
    description: { ...initialLangFields },
    features: { ...initialLangFields },
    price: "",
  });
  const [images, setImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [mainCategory, setMainCategory] = useState("");
  const [cover1, setCover1] = useState(null);
  const [cover2, setCover2] = useState(null);

  const handleChange = (field, lang, value) => {
    setProduct((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 6);
    setImages(files);
    setCover1(null);
    setCover2(null);
  };

  const compressImages = async (files) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };

    return await Promise.all(
      files.map(async (file) => {
        try {
          return await imageCompression(file, options);
        } catch (err) {
          console.error("Sıkıştırma hatası:", err);
          return file;
        }
      })
    );
  };

  const handleSubmit = async () => {
    if (images.length === 0)
      return setMessage({ type: "error", text: "En az 1 görsel yükleyin." });
    if (!product.price)
      return setMessage({ type: "error", text: "Fiyat girin." });
    if (selectedCategories.length === 0)
      return setMessage({ type: "error", text: "Kategori seçin." });
    if (!mainCategory)
      return setMessage({ type: "error", text: "Ana kategori seçin." });
    if (cover1 === null || cover2 === null)
      return setMessage({ type: "error", text: "Kapak görsellerini seçin." });

    setLoading(true);
    setMessage(null);

    const selectedLabels = CATEGORY_OPTIONS.filter((opt) =>
      selectedCategories.includes(opt.key)
    ).map((opt) => opt.labels);

    const data = {
      ...product,
      category: {
        tr: selectedLabels.map((l) => l.tr).join(", "),
        en: selectedLabels.map((l) => l.en).join(", "),
        ar: selectedLabels.map((l) => l.ar).join(", "),
      },
      mainCategory,
      price: parseFloat(product.price),
      features: {
        tr: product.features.tr.split(",").map((f) => f.trim()),
        en: product.features.en.split(",").map((f) => f.trim()),
        ar: product.features.ar.split(",").map((f) => f.trim()),
      },
      coverIndex1: cover1,
      coverIndex2: cover2,
    };

    try {
      const compressedImages = await compressImages(images);
      await uploadProduct(data, compressedImages);
      setMessage({ type: "success", text: "Ürün başarıyla eklendi." });
      setProduct({
        name: { ...initialLangFields },
        description: { ...initialLangFields },
        features: { ...initialLangFields },
        price: "",
      });
      setImages([]);
      setCover1(null);
      setCover2(null);
      setSelectedCategories([]);
      setMainCategory("");
    } catch (err) {
      setMessage({ type: "error", text: "Ürün eklenemedi: " + err.message });
    } finally {
      setLoading(false);
    }
  };
  const secondField = ({ field }) => {
    if (field == "name") {
      return "Ad";
    } else if (field == "description") {
      return "Açıklama";
    } else {
      return "Özellikler";
    }
  };
  return (
    <div className="border relative rounded shadow mb-6">
      <button
        className="w-full flex justify-between items-center p-4 text-left bg-gray-100"
        onClick={() => setFormOpen(!formOpen)}
      >
        <span className="font-semibold text-lg">Yeni Ürün Ekle</span>
        {formOpen ? <ChevronUp /> : <ChevronDown />}
      </button>

      {formOpen && (
        <div className="p-4 space-y-4">
          {message && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Giriş alanları */}
          {["name", "description", "features"].map((field) => (
            <div key={field}>
              <label className="block font-semibold capitalize">
                {field} ({secondField({ field })}){" "}
              </label>
              <div className="flex flex-col md:flex-row gap-2">
                {["tr", "en", "ar"].map((lang) => (
                  <input
                    key={lang}
                    type="text"
                    placeholder={`${field} (${lang})`}
                    value={product[field][lang]}
                    onChange={(e) => handleChange(field, lang, e.target.value)}
                    className="border p-2 flex-1"
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Fiyat */}
          <div>
            <label className="block font-semibold">Fiyat (₺)</label>
            <input
              type="number"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
              className="border p-2 w-full"
            />
          </div>

          {/* Kategoriler */}
          <div>
            <label className="block font-semibold">Kategoriler (çoklu)</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.key}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCategories((prev) =>
                      prev.includes(cat.key)
                        ? prev.filter((k) => k !== cat.key)
                        : [...prev, cat.key]
                    );
                  }}
                  className={`border px-3 py-1 rounded ${
                    selectedCategories.includes(cat.key)
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  {cat.labels.tr}
                </button>
              ))}
            </div>
          </div>

          {/* Ana kategori seçimi */}
          <div>
            <label className="block font-semibold">Ana Kategori</label>
            <select
              value={mainCategory}
              onChange={(e) => setMainCategory(e.target.value)}
              className="border p-2 w-full mt-1"
            >
              <option value="">Ana kategori seçin</option>
              {selectedCategories.map((key) => {
                const cat = CATEGORY_OPTIONS.find((c) => c.key === key);
                return (
                  <option key={key} value={key}>
                    {cat?.labels.tr}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Görsel Yükleme */}
          <div>
            <label className="block font-semibold mb-2">
              Ürün Görselleri (maks. 6)
            </label>

            <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded shadow-sm bg-white hover:bg-gray-50 transition cursor-pointer">
              <ImagePlus size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Görsel Seç
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <div className="flex flex-wrap gap-2 mt-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`img-${i}`}
                    className="w-20 h-20 object-cover border rounded"
                  />
                  <div className="text-xs mt-1 text-center">
                    <label>
                      <input
                        type="radio"
                        name="cover1"
                        checked={cover1 === i}
                        onChange={() => setCover1(i)}
                      />
                      <span className="ml-1">Kapak 1</span>
                    </label>
                    <br />
                    <label>
                      <input
                        type="radio"
                        name="cover2"
                        checked={cover2 === i}
                        onChange={() => setCover2(i)}
                      />
                      <span className="ml-1">Kapak 2</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full cursor-pointer"
          >
            Ürünü Kaydet
          </button>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-lg font-semibold animate-pulse">
            İşlem yapılıyor...
          </div>
        </div>
      )}
    </div>
  );
}
