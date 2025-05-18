import { useEffect, useState } from "react";
import logo from "../assets/logovera.png";

// md altı görseller
import imgSm1 from "../assets/imgSm1.jpg";
import imgSm2 from "../assets/imgSm2.jpg";
import imgSm3 from "../assets/imgSm3.jpg";

// md ve üzeri görseller
import imgMd1 from "../assets/imgMd1.jpg";
import imgMd2 from "../assets/imgMd2.jpg";
import imgMd3 from "../assets/imgMd3.jpg";
  
const smallImages = [imgSm1, imgSm2, imgSm3];
const largeImages = [imgMd1, imgMd2, imgMd3];

export default function AnimatedBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState(
    window.innerWidth < 768 ? smallImages : largeImages
  );

  // Değişen ekran boyutuna göre image listesini ayarla
  useEffect(() => {
    const handleResize = () => {
      setImages(window.innerWidth < 768 ? smallImages : largeImages);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Her 5 saniyede resim değiştir
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Images */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 " : "opacity-0 z-0"
          }`}
          alt="background"
        />
      ))}

      {/* Center Logo */}
      <div className="absolute inset-0 flex items-center justify-center ">
        <img
          src={logo}
          alt="logo"
          className="w-25 h-25 md:w-48 md:h-48 object-contain z-10"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0  opacity-30 bg-black " />
    </div>
  );
}
