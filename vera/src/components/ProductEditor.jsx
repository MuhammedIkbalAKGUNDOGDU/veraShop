import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import imageCompression from "browser-image-compression";
import { ChevronDown, ChevronUp, ImagePlus } from "lucide-react";

const CATEGORY_OPTIONS = [
  {
    key: "aydinlatma",
    labels: {
      tr: "AYDINLATMA",
      en: "LIGHTING",
      ar: "إضاءة",
    },
  },
  {
    key: "tablo",
    labels: {
      tr: "TABLO",
      en: "PAINTING",
      ar: "لوحة",
    },
  },
  {
    key: "ayna",
    labels: {
      tr: "AYNA",
      en: "MIRROR",
      ar: "مرآة",
    },
  },
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
    labels: {
      tr: "OTURMA GRUBU",
      en: "SEATING GROUP",
      ar: "مجموعة الجلوس",
    },
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
    labels: {
      tr: "HEDİYE FİKİRLERİ",
      en: "GIFT IDEAS",
      ar: "أفكار هدايا",
    },
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

export default function ProductEditor() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [form, setForm] = useState({
    name: { ...initialLangFields },
    description: { ...initialLangFields },
    features: { ...initialLangFields },
    price: "",
    imageUrls: [],
    mainCategory: "",
    coverIndex1: null,
    coverIndex2: null,
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleSelect = (id) => {
    const found = products.find((p) => p.id === id);
    const fallbackKeys = parseCategoryKeysFromTrLabel(
      found?.category?.tr || ""
    );

    setSelected(found);
    setForm({
      name: { ...found.name },
      description: { ...found.description },
      features: {
        tr: found.features.tr.join(", "),
        en: found.features.en.join(", "),
        ar: found.features.ar.join(", "),
      },
      price: found.price,
      imageUrls: [...found.imageUrls],
      mainCategory: found.mainCategory || "",
      coverIndex1: found.coverIndex1 ?? null,
      coverIndex2: found.coverIndex2 ?? null,
    });
    setSelectedCategories(found.categoryKeys ?? fallbackKeys);
    setMessage(null);
  };

  const parseCategoryKeysFromTrLabel = (trString) => {
    const trParts = trString.split(",").map((part) => part.trim());
    return CATEGORY_OPTIONS.filter((cat) =>
      trParts.includes(cat.labels.tr)
    ).map((cat) => cat.key);
  };

  const handleChange = (field, lang, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const handleImageReplace = async (index, file) => {
    if (!selected) return;
    setLoading(true);
    try {
      const oldUrl = form.imageUrls[index];
      const path = decodeURIComponent(
        new URL(oldUrl).pathname.split("/o/")[1].split("?")[0]
      );
      await deleteObject(ref(storage, path));

      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
      });
      const storageRef = ref(storage, `products/${selected.id}_${Date.now()}`);
      await uploadBytes(storageRef, compressed);
      const newUrl = await getDownloadURL(storageRef);

      const updated = [...form.imageUrls];
      updated[index] = newUrl;

      await updateDoc(doc(db, "products", selected.id), { imageUrls: updated });
      setForm((prev) => ({ ...prev, imageUrls: updated }));
      setMessage({ type: "success", text: "Görsel güncellendi." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = async (index) => {
    if (!selected) return;
    setLoading(true);
    try {
      const url = form.imageUrls[index];
      const path = decodeURIComponent(
        new URL(url).pathname.split("/o/")[1].split("?")[0]
      );
      await deleteObject(ref(storage, path));
      const updated = form.imageUrls.filter((_, i) => i !== index);
      await updateDoc(doc(db, "products", selected.id), { imageUrls: updated });
      setForm((prev) => ({ ...prev, imageUrls: updated }));
      setMessage({ type: "success", text: "Görsel silindi." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const labelMap = CATEGORY_OPTIONS.reduce((acc, item) => {
        acc[item.key] = item.labels;
        return acc;
      }, {});
      const selectedLabels = selectedCategories.map((k) => labelMap[k]);
      const category = {
        tr: selectedLabels.map((l) => l.tr).join(", "),
        en: selectedLabels.map((l) => l.en).join(", "),
        ar: selectedLabels.map((l) => l.ar).join(", "),
      };

      await updateDoc(doc(db, "products", selected.id), {
        name: form.name,
        description: form.description,
        features: {
          tr: form.features.tr.split(",").map((f) => f.trim()),
          en: form.features.en.split(",").map((f) => f.trim()),
          ar: form.features.ar.split(",").map((f) => f.trim()),
        },
        price: parseFloat(form.price),
        category,
        categoryKeys: selectedCategories,
        mainCategory: form.mainCategory,
        coverIndex1: form.coverIndex1,
        coverIndex2: form.coverIndex2,
      });
      setMessage({ type: "success", text: "Ürün başarıyla güncellendi." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded shadow mb-6 p-4 space-y-4 relative">
      <div
        onClick={() => setAccordionOpen((prev) => !prev)}
        className="flex justify-between items-center cursor-pointer"
      >
        <h2 className="text-lg font-semibold">Ürün Düzenle</h2>
        {accordionOpen ? <ChevronUp /> : <ChevronDown />}
      </div>

      {accordionOpen && (
        <>
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
            <>
              {["name", "description", "features"].map((field) => (
                <div key={field}>
                  <label className="block font-semibold capitalize mb-1">
                    {field}
                  </label>
                  <div className="flex flex-col md:flex-row gap-2">
                    {["tr", "en", "ar"].map((lang) => (
                      <input
                        key={lang}
                        type="text"
                        value={form[field][lang]}
                        onChange={(e) =>
                          handleChange(field, lang, e.target.value)
                        }
                        placeholder={`${field} (${lang})`}
                        className="border p-2 w-full"
                      />
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <label className="block font-semibold mb-1">Fiyat (₺)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="border p-2 w-full"
                />
              </div>

              <div>
                <label className="block font-semibold">Kategoriler</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() =>
                        setSelectedCategories((prev) =>
                          prev.includes(cat.key)
                            ? prev.filter((k) => k !== cat.key)
                            : [...prev, cat.key]
                        )
                      }
                      className={`px-3 py-1 border rounded ${
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

              <div>
                <label className="block font-semibold">Ana Kategori</label>
                <select
                  value={form.mainCategory}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      mainCategory: e.target.value,
                    }))
                  }
                  className="border p-2 w-full mt-1"
                >
                  <option value="">Ana kategori seçin</option>
                  {[...new Set([form.mainCategory, ...selectedCategories])].map(
                    (key) => {
                      const cat = CATEGORY_OPTIONS.find((c) => c.key === key);
                      return (
                        <option key={key} value={key}>
                          {cat?.labels.tr || key}
                        </option>
                      );
                    }
                  )}
                </select>
              </div>

              <div>
                <label className="font-semibold">Görseller</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.imageUrls.map((url, i) => (
                    <div key={i} className="text-center w-28">
                      <img
                        src={url}
                        alt={`img-${i}`}
                        className="w-20 h-20 object-cover border rounded"
                      />
                      <div className="text-xs">
                        <label>
                          <input
                            type="radio"
                            name="cover1"
                            checked={form.coverIndex1 === i}
                            onChange={() =>
                              setForm((prev) => ({ ...prev, coverIndex1: i }))
                            }
                          />
                          <span className="ml-1">Kapak 1</span>
                        </label>
                        <br />
                        <label>
                          <input
                            type="radio"
                            name="cover2"
                            checked={form.coverIndex2 === i}
                            onChange={() =>
                              setForm((prev) => ({ ...prev, coverIndex2: i }))
                            }
                          />
                          <span className="ml-1">Kapak 2</span>
                        </label>
                      </div>
                      <label className="text-blue-600 text-xs cursor-pointer">
                        📁 Değiştir
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={loading}
                          onChange={(e) =>
                            handleImageReplace(i, e.target.files[0])
                          }
                        />
                      </label>
                      <button
                        onClick={() => handleImageDelete(i)}
                        disabled={loading}
                        className="text-red-600 text-xs mt-1 cursor-pointer"
                      >
                        🗑 Sil
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
              >
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>

              {message && (
                <div
                  className={`mt-2 px-4 py-2 rounded text-sm ${
                    message.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </>
          )}
        </>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <p className="text-white text-lg font-semibold animate-pulse">
            İşlem yapılıyor...
          </p>
        </div>
      )}
    </div>
  );
}
