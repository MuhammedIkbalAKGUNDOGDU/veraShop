import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import Footer from "../components/footer";
import { FaWhatsapp } from "react-icons/fa";
import RelatedProducts from "../components/RelatedProducts";
import FloatingIcons from "../components/FloatingIcons";
export default function ProductDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});
  const zoomRef = useRef(null);
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    if (state) {
      setProduct(state);
      setSelectedImage(
        state.imageUrls?.[state.coverIndex1] || state.imageUrls?.[0]
      );
    }
  }, [state]);

  const handleMouseMove = (e) => {
    const rect = zoomRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
  };

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center text-gray-500">
        {t("product_details_loading")}
      </div>
    );
  }

  const images = product.imageUrls || [];
  const localizedTitle = product.name?.[lang] || "";
  const localizedDescription = product.description?.[lang] || "";
  const localizedFeatures = product.features?.[lang] || [];
  const allCategories = product.category?.[lang]?.split(",") || [];

  const whatsappLink = `https://wa.me/905393412716?text=${encodeURIComponent(
    `Merhaba, ${localizedTitle}, ${
      product.name["tr"] || ""
    } adlı ürün hakkında bilgi almak istiyorum.`
  )}`;

  return (
    <div className="bg-gray-100">
      {" "}
      <div className="max-w-6xl mx-auto">
        <Header textcolor="black" />
      </div>
      <div className=" max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-10">
        {/* Sol: Görsel alanı */}
        <div className="relative w-full md:w-1/2">
          {product.category && (
            <div className="absolute top-0 right-0 z-20 overflow-hidden w-[75px] h-[75px]">
              <div className="bg-red-600 text-white text-[10px] font-bold absolute left-[-35px] top-[18px] w-[150px] text-center rotate-[45deg] shadow-md">
                {t("sold")}
              </div>
            </div>
          )}
          <div
            ref={zoomRef}
            className="overflow-hidden border rounded relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={selectedImage}
              alt={localizedTitle}
              style={zoomStyle}
              className="w-full h-full transition-transform duration-200 object-cover"
            />
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImage(img)}
                alt={`image-${i}`}
                className={`w-20 h-20 object-cover rounded border cursor-pointer ${
                  selectedImage === img ? "ring-2 ring-black" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Sağ: Bilgiler */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-2xl font-bold capitalize">{localizedTitle}</h1>

          <div className="text-sm text-gray-500 flex flex-wrap gap-2">
            {allCategories.map((cat, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {cat.trim()}
              </span>
            ))}
          </div>

          <p className="text-xl font-semibold">{product.price}</p>

          <p className="text-gray-700 whitespace-pre-line">
            {t("description")}: {localizedDescription}
          </p>

          <ul className="text-sm text-gray-600 space-y-1">
            <li className="font-semibold"> {t("features")}:</li>
            {Array.isArray(localizedFeatures) &&
              localizedFeatures.map((feature, index) => (
                <li key={index} className="ml-4 list-disc list-inside">
                  {feature}
                </li>
              ))}
            {!product.sold && (
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer mt-2 px-4 py-4 text-lg w-full text-center bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  <FaWhatsapp size={18} />
                  {t("share_on_whatsapp", "WhatsApp ile Paylaş")}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <RelatedProducts
        currentProductId={product.id}
        category={product.category}
      />
      <FloatingIcons
        rightLinks={{
          whatsapp: "https://wa.me/905393412716",
        }}
      />
      <Footer
        instagramLink="https://instagram.com/verarooom"
        emailLink="mailto:verarooom@gmail.com"
      />
    </div>
  );
}
