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
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSelect = (id) => {
    const found = products.find((p) => p.id === id);
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
    setMessage(null);
  };

  const handleChange = (field, lang, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const handlePriceChange = (e) => {
    setForm((prev) => ({ ...prev, price: e.target.value }));
  };

  const handleImageReplace = async (index, file) => {
    if (!selected) return;

    setLoading(true);
    setMessage(null);

    try {
      // Eski görseli storage'tan sil
      const oldUrl = form.imageUrls[index];
      const filePath = decodeURIComponent(
        new URL(oldUrl).pathname.split("/o/")[1].split("?")[0]
      );
      await deleteObject(ref(storage, filePath));

      // Yeni görseli sıkıştır ve yükle
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
      });

      const storageRef = ref(storage, `products/${selected.id}_${Date.now()}`);
      await uploadBytes(storageRef, compressed);
      const newUrl = await getDownloadURL(storageRef);

      // imageUrls dizisini güncelle
      const updatedUrls = [...form.imageUrls];
      updatedUrls[index] = newUrl;

      await updateDoc(doc(db, "products", selected.id), {
        imageUrls: updatedUrls,
      });

      setForm((prev) => ({ ...prev, imageUrls: updatedUrls }));
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

  const handleUpdate = async () => {
    if (!selected) return;
    setLoading(true);
    setMessage(null);
    try {
      await updateDoc(doc(db, "products", selected.id), {
        name: form.name,
        description: form.description,
        features: {
          tr: form.features.tr.split(",").map((f) => f.trim()),
          en: form.features.en.split(",").map((f) => f.trim()),
          ar: form.features.ar.split(",").map((f) => f.trim()),
        },
        price: parseFloat(form.price),
      });
      setMessage({ type: "success", text: "Ürün başarıyla güncellendi." });
    } catch (err) {
      setMessage({
        type: "error",
        text: "Güncelleme başarısız: " + err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = async (index) => {
    if (!selected) return;
    setLoading(true);
    setMessage(null);

    try {
      const imageUrl = form.imageUrls[index];
      const filePath = decodeURIComponent(
        new URL(imageUrl).pathname.split("/o/")[1].split("?")[0]
      );
      await deleteObject(ref(storage, filePath));

      const updatedUrls = form.imageUrls.filter((_, i) => i !== index);

      await updateDoc(doc(db, "products", selected.id), {
        imageUrls: updatedUrls,
      });

      setForm((prev) => ({ ...prev, imageUrls: updatedUrls }));
      setMessage({ type: "success", text: "Görsel silindi." });
    } catch (err) {
      setMessage({
        type: "error",
        text: "Görsel silinemedi: " + err.message,
      });
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
    setMessage(null);

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
          `products/${selected.id}_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2)}`
        );
        await uploadBytes(storageRef, compressed);
        const url = await getDownloadURL(storageRef);
        newUrls.push(url);
      }

      const updatedUrls = [...form.imageUrls, ...newUrls];

      await updateDoc(doc(db, "products", selected.id), {
        imageUrls: updatedUrls,
      });

      setForm((prev) => ({ ...prev, imageUrls: updatedUrls }));
      setMessage({ type: "success", text: "Yeni görsel(ler) eklendi." });
    } catch (err) {
      setMessage({
        type: "error",
        text: "Görsel eklenemedi: " + err.message,
      });
    } finally {
      setLoading(false);
      e.target.value = null; // dosya tekrar seçilebilsin diye sıfırla
    }
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
                    placeholder={`${field} (${lang})`}
                    value={form[field][lang]}
                    onChange={(e) => handleChange(field, lang, e.target.value)}
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
              onChange={handlePriceChange}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">Görselleri Değiştir</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {form.imageUrls.map((url, i) => (
                <div
                  key={i}
                  className="relative flex flex-col items-center gap-2 border rounded p-3 w-28"
                >
                  {/* Numara rozeti */}
                  <div className="absolute top-1 left-1 bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full">
                    #{i + 1}
                  </div>

                  {/* Görsel */}
                  <img
                    src={url}
                    alt={`image-${i}`}
                    className="w-20 h-20 object-cover rounded border"
                  />

                  {/* Değiştir butonu */}
                  <label className="inline-block cursor-pointer text-blue-600 text-xs px-2 py-1 rounded border border-blue-200 hover:bg-blue-50 transition">
                    📁 Değiştir
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageReplace(i, e.target.files[0])}
                      disabled={loading}
                      className="hidden"
                    />
                  </label>

                  {/* Sil butonu */}
                  <button
                    onClick={() => handleImageDelete(i)}
                    disabled={loading}
                    className="text-red-600 text-xs px-2 py-1 rounded border border-red-200 hover:bg-red-50 transition"
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

                {/* Yükleme butonu */}
                <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded shadow-sm bg-white hover:bg-gray-50 transition cursor-pointer">
                  <ImagePlus size={18} className="text-gray-600" />
                  <span className="text-sm text-gray-700 font-medium">
                    Görsel Yükle
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageAdd}
                    disabled={loading}
                    className="hidden"
                  />
                </label>

                {/* Açıklama */}
                <p className="text-xs text-gray-500 mt-2">
                  En fazla 6 görsel yükleyebilirsiniz. Kalan:{" "}
                  <span className="font-semibold">
                    {6 - form.imageUrls.length}
                  </span>
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full cursor-pointer"
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
