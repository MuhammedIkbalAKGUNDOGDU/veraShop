import React from "react";
import { Search } from "lucide-react";
import ProductSearch from "../components/ProductsSearch";
import Header from "../components/Header";
import Footer from "../components/footer";
import { useTranslation } from "react-i18next";
const NotFound = () => {
  const { t } = useTranslation(); // ✔️ buradan al

  return (
    <>
      {" "}
      <Header textcolor="text-black" />
      <div className=" flex items-center justify-center px-4 bg-red">
        <div className="max-w-xl text-center">
          <h1 className="text-6xl font-bold text-gray-300 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {t("not_found_title")}
          </h2>
          <p className="text-gray-500 mb-6">{t("not_found_description")}</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
