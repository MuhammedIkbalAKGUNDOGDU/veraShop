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
import { ImagePlus } from "lucide-react";

const CATEGORY_OPTIONS = [
  { key: "aydinlatma", labels: { tr: "AYDINLATMA" } },
  { key: "ayna", labels: { tr: "AYNA" } },
  { key: "saklama", labels: { tr: "SAKLAMA ÜNİTELERİ" } },
  { key: "oturma", labels: { tr: "OTURMA GRUBU" } },
  { key: "masa", labels: { tr: "MASA & SEHPA" } },
  { key: "tamamlayici", labels: { tr: "TAMAMLAYICI ÜRÜNLER" } },
  { key: "hediye", labels: { tr: "HEDİYE FİKİRLERİ" } },
];

const initialLangFields = { tr: "", en: "", ar: "" };

export default function ProductEditor() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: { ...initialLangFields },
    description: { ...initialLangFields },
    features: { ...initialLangFields },
    price: "",
    imageUrls: [],
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
    const fallbackKeys = parseCategoryKeysFromTrLabel(found.category?.tr || "");

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
    });
    setSelectedCategories(found.categoryKeys || fallbackKeys); // 🔁 burası önemli
    setMessage(null);
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

      await updateDoc(doc(db, "products", selected.id), {
        imageUrls: updated,
      });

      setForm((prev) => ({ ...prev, imageUrls: updated }));
      setMessage({ type: "success", text: "Görsel güncellendi." });
    } catch (err) {
      setMessage({
        type: "error",
        text: "Görsel güncellenemedi: " + err.message,
      });
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
      setMessage({ type: "error", text: "Görsel silinemedi: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleImageAdd = async (e) => {
    if (!selected) return;
    const files = Array.from(e.target.files);
    if (form.imageUrls.length + files.length > 6) {
      return setMessage({ type: "error", text: "En fazla 6 görsel olabilir." });
    }
    setLoading(true);
    try {
      const newUrls = [];
      for (const file of files) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        });
        const storageRef = ref(
          storage,
          `products/${selected.id}_${Date.now()}_${Math.random()}`
        );
        await uploadBytes(storageRef, compressed);
        newUrls.push(await getDownloadURL(storageRef));
      }

      const updated = [...form.imageUrls, ...newUrls];
      await updateDoc(doc(db, "products", selected.id), { imageUrls: updated });
      setForm((prev) => ({ ...prev, imageUrls: updated }));
      setMessage({ type: "success", text: "Görsel(ler) eklendi." });
    } catch (err) {
      setMessage({ type: "error", text: "Görsel eklenemedi: " + err.message });
    } finally {
      setLoading(false);
      e.target.value = null;
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
        en: "",
        ar: "", // dil verisi yoksa boş bırakılıyor
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
      });
      setMessage({ type: "success", text: "Ürün güncellendi." });
    } catch (err) {
      setMessage({ type: "error", text: "Güncelleme hatası: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  const parseCategoryKeysFromTrLabel = (trString) => {
    const trParts = trString.split(",").map((part) => part.trim());
    const keys = CATEGORY_OPTIONS.filter((cat) =>
      trParts.includes(cat.labels.tr)
    ).map((cat) => cat.key);
    return keys;
  };

  return (
    <div className="border rounded shadow mb-6 p-4 space-y-4 relative">
      <h2 className="text-lg font-semibold">Ürün Düzenle</h2>

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
        <div className="space-y-4">
          {["name", "description", "features"].map((field) => (
            <div key={field}>
              <label className="block font-semibold capitalize">{field}</label>
              <div className="flex flex-col md:flex-row gap-2">
                {["tr", "en", "ar"].map((lang) => (
                  <input
                    key={lang}
                    type="text"
                    value={form[field][lang]}
                    onChange={(e) => handleChange(field, lang, e.target.value)}
                    placeholder={`${field} (${lang})`}
                    className="border p-2 flex-1"
                  />
                ))}
              </div>
            </div>
          ))}

          <div>
            <label className="block font-semibold">Fiyat (₺)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => handlePriceChange(e)}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">Kategoriler</label>
            <div className="flex flex-wrap gap-2 mt-2">
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
            <label className="block font-semibold">Görseller</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {form.imageUrls.map((url, i) => (
                <div
                  key={i}
                  className="relative flex flex-col items-center gap-2 border rounded p-3 w-28"
                >
                  <div className="absolute top-1 left-1 bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full">
                    #{i + 1}
                  </div>
                  <img
                    src={url}
                    alt=""
                    className="w-20 h-20 object-cover rounded"
                  />
                  <label className="text-blue-600 text-xs cursor-pointer">
                    📁 Değiştir
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={loading}
                      onChange={(e) => handleImageReplace(i, e.target.files[0])}
                    />
                  </label>
                  <button
                    className="text-red-600 text-xs underline"
                    onClick={() => handleImageDelete(i)}
                    disabled={loading}
                  >
                    🗑 Sil
                  </button>
                </div>
              ))}
            </div>
            {form.imageUrls.length < 6 && (
              <div className="mt-4">
                <label className="block font-semibold mb-2">
                  Yeni Görsel Ekle
                </label>
                <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded shadow-sm bg-white hover:bg-gray-50 cursor-pointer">
                  <ImagePlus size={18} className="text-gray-600" />
                  <span className="text-sm font-medium">Görsel Yükle</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageAdd}
                  />
                </label>
              </div>
            )}
          </div>

          <button
            className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
            onClick={handleUpdate}
            disabled={loading}
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
        </div>
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
