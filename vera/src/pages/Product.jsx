import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/footer";
export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // Simülasyon: API isteği (şimdilik boş)
  useEffect(() => {
    // Burada ileride fetch(`/api/products/${id}`) olabilir
    // Şimdilik sahte bir gecikmeyle boş veri döndürüyoruz
    setTimeout(() => {
      setProduct({
        image1: "https://via.placeholder.com/600x600?text=Ürün+Görseli+1",
        image2: "https://via.placeholder.com/600x600?text=Ürün+Görseli+2",
        title: "Yükleniyor...",
        price: "--,--",
        description: "Ürün açıklaması yükleniyor...",
        code: "---",
        size: "---",
        seatHeight: "---",
        backHeight: "---",
        stock: false,
      });
    }, 1000); // 1 saniyelik sahte bekleme
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center text-gray-500">
        Ürün detayları yükleniyor...
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl  mx-auto ">
        <Header textcolor="black" />
      </div>
      <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-10">
        {/* Sol: Görsel */}
        <div className="w-full md:w-1/2">
          <img src={product.image1} alt={product.title} className="rounded" />
          <div className="flex gap-2 mt-4">
            <img src={product.image1} className="w-20 h-20 object-cover" />
            <img src={product.image2} className="w-20 h-20 object-cover" />
          </div>
        </div>

        {/* Sağ: Bilgiler */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-xl font-semibold mb-4">₺{product.price}</p>
          <p className="mb-4">{product.description}</p>

          <ul className="text-sm text-gray-600 space-y-1 mb-4">
            <li>Kod: {product.code}</li>
            <li>Ölçü: {product.size}</li>
            <li>Oturma Yüksekliği: {product.seatHeight}</li>
            <li>Sırt Yüksekliği: {product.backHeight}</li>
          </ul>

          <p
            className={`mb-4 ${
              product.stock ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock ? "Stokta" : "Tükendi"}
          </p>

          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
            Sepete Ekle
          </button>
        </div>
      </div>
      <Footer
        instagramLink="https://instagram.com/otolofficial"
        emailLink="mailto:iletisim@otol.com"
      />
    </>
  );
}
