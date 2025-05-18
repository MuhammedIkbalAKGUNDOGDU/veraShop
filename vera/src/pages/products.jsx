import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import image1 from "../assets/imgMd1.jpeg";
import image2 from "../assets/imgSm1.jpeg";
import LazyItemCard from "../components/LazyItemCard";
import { ArrowUp } from "lucide-react"; // ikon kullanmak için

const Products = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300); // 300px scroll sonrası göster
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const items = [
    {
      id: 1,
      image1: image1,
      image2: image2,
      category: "Oturma Grubu",
      title: "Chesterfield Yatar Koltuk",
      price: "110.400,00",
    },
    {
      id: 2,
      image1: image1,
      image2: image2,
      category: "Tamamlayıcı Ürünler",
      title: "Kristal Louis XIII Konyak Kadehleri",
      price: "36.000,00",
    },
    {
      image1: image1,
      image2: image2,
      category: "Oturma Grubu",
      title: "Aviator Koltuk",
      price: "57.600,00",
    },
    {
      image1: image1,
      image2: image2,
      category: "Sehpa",
      title: "Retro Sehpa",
      price: "21.000,00",
    },
    {
      image1: image1,
      image2: image2,
      category: "Dekoratif",
      title: "Portre Tablo",
      price: "12.500,00",
    },
    {
      image1: image1,
      image2: image2,
      category: "Dekoratif",
      title: "Portre Tablo",
      price: "12.500,00",
    },
    {
      image1: image1,
      image2: image2,
      category: "Dekoratif",
      title: "Portre Tablo",
      price: "12.500,00",
    },
    {
      image1: image1,
      image2: image2,
      category: "Dekoratif",
      title: "Portre Tablo",
      price: "12.500,00",
    },
    {
      image1: image1,
      image2: image2,
      category: "Dekoratif",
      title: "Portre Tablo",
      price: "12.500,00",
    },
    {
      image1: image1,
      image2: image2,
      category: "Dekoratif",
      title: "Portre Tablo",
      price: "12.500,00",
    },
    {
      image1: image1,
      image2: image2,
      category: "Dekoratif",
      title: "Portre Tablo",
      price: "12.500,00",
    },
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Header page="products" textcolor="text-black" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-stretch">
          {items.map((item, index) => (
            <LazyItemCard key={index} {...item} />
          ))}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className=" border-2 cursor-pointer fixed bottom-5 right-5  text-black p-3 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 z-50 animate-slide-up"
        >
          <ArrowUp className=" border-black" size={20} />
        </button>
      )}
    </div>
  );
};

export default Products;
