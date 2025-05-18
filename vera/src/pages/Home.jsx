import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import FloatingIcons from "../components/FloatingIcons";
import AnimatedBackground from "../components/AnimatedBackground";
import { fetchProducts } from "../services/productService"; // doğru yolda olduğuna emin ol
import { useEffect } from "react";

function Home() {
  const { t } = useTranslation();
  useEffect(() => {
    fetchProducts()
      .then((products) => {
        console.log("Tüm Ürünler:", products);
      })
      .catch((err) => {
        console.error("Ürünler alınamadı:", err);
      });
  }, []);

  return (
    <div>
      <Header isabsolute="absolute" page="home"></Header>
      <AnimatedBackground></AnimatedBackground>
      <FloatingIcons
        leftLinks={{
          instagram: "https://instagram.com/yourpage",
          mail: "info@example.com",
        }}
        rightLinks={{
          whatsapp: "https://wa.me/905393412716",
        }}
      />
    </div>
  );
}

export default Home;
