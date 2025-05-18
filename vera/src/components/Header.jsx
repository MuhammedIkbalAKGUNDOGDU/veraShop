import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import trFlag from "../assets/flags/tr.webp";
import enFlag from "../assets/flags/en.webp";
import arFlag from "../assets/flags/ar.webp";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logovera.png";
import ProductSearch from "./ProductsSearch"; // yolunu projene göre düzelt

const languages = [
  { code: "tr", label: "Türkçe", flag: trFlag },
  { code: "en", label: "English", flag: enFlag },
  { code: "ar", label: "العربية", flag: arFlag },
];

export default function Header({
  textcolor = "text-white",
  page = "",
  isabsolute = "",
  isSearchable = true,
}) {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const menuRef = useRef();
  const categoryRef = useRef();
  const langRefDesktop = useRef();
  const langRefMobile = useRef();
  useEffect(() => {
    const handleLangClickOutside = (e) => {
      const clickedOutsideDesktop =
        langRefDesktop.current && !langRefDesktop.current.contains(e.target);
      const clickedOutsideMobile =
        langRefMobile.current && !langRefMobile.current.contains(e.target);

      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setLangMenuOpen(false);
      }
    };

    if (langMenuOpen) {
      document.addEventListener("mousedown", handleLangClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleLangClickOutside);
    };
  }, [langMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleCategoryClickOutside = (e) => {
      if (window.innerWidth < 768) return; // md altı = mobil → ignore

      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };

    if (categoryOpen) {
      document.addEventListener("mousedown", handleCategoryClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleCategoryClickOutside);
    };
  }, [categoryOpen]);

  // Scroll kilidi
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangMenuOpen(false);
    setMenuOpen(false);
  };
  const navigate = useNavigate();
  const currentLang =
    languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <>
      {/* HEADER */}
      <header
        className={`top-0 left-0 w-full z-20 p-4 flex justify-between  md:px-16 items-center bg-transparent ${isabsolute}`}
      >
        <div
          onClick={() => navigate("/")}
          className={`font-bold text-xl cursor-pointer  transition-opacity duration-300 ${textcolor}`}
        >
          <img className="w-20 md:w-35 h-auto " src={logo} alt="" />
        </div>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <a
              onClick={() => navigate("/")}
              className={`cursor-pointer font-bold text-xl transition-opacity duration-300 ${textcolor} ${
                page === "home" ? "opacity-100" : "opacity-70 hover:opacity-100"
              }`}
            >
              {t("home")}
            </a>
            <a
              onClick={() => navigate("/products")}
              className={`cursor-pointer font-bold text-xl transition-opacity duration-300 ${textcolor} ${
                page === "products"
                  ? "opacity-100"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              {t("products")}
            </a>
            <div className="group relative " ref={categoryRef}>
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className={`cursor-pointer font-bold text-xl opacity-70 flex items-center gap-2 hover:opacity-100 transition-opacity duration-300 ${textcolor}`}
              >
                {t("categories")}
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    categoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`absolute bg-white text-black mt-2 rounded shadow p-2 z-50 min-w-[180px] overflow-hidden transition-all duration-300 ease-in-out ${
                  categoryOpen
                    ? "max-h-[500px] opacity-100 visible"
                    : "max-h-0 opacity-0 invisible"
                }`}
              >
                {" "}
                <a
                  onClick={() => navigate("/ProductCategory/aydinlatma")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_lighting")}
                </a>
                <a
                  onClick={() => navigate("/ProductCategory/ayna")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_mirror")}
                </a>
                <a
                  onClick={() => navigate("/ProductCategory/saklama")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_storage")}
                </a>
                <a
                  onClick={() => navigate("/ProductCategory/oturma")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_seating")}
                </a>
                <a
                  onClick={() => navigate("/ProductCategory/masa")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_table")}
                </a>
                <a
                  onClick={() => navigate("/ProductCategory/tamamlayici")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_complementary")}
                </a>
                <a
                  onClick={() => navigate("/ProductCategory/hediye")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_gift")}
                </a>
                <a
                  onClick={() => navigate("/ProductCategory/tablo")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_painting")}
                </a>
              </div>
            </div>
            <a
              onClick={() => navigate("/ProductCategory/koleksiyon")}
              className={`cursor-pointer font-bold text-xl opacity-70 hover:opacity-100 transition-opacity duration-300 ${textcolor}`}
            >
              {t("collection")}
            </a>
            <a
              onClick={() => navigate("/contact")}
              className={`cursor-pointer font-bold text-xl opacity-70 hover:opacity-100 transition-opacity duration-300 ${textcolor}`}
            >
              {t("contact")}
            </a>
          </nav>
          {isSearchable && <ProductSearch color={textcolor} />}

          {/* Desktop: Language */}
          <div className="hidden md:block relative  " ref={langRefDesktop}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className={`cursor-pointer font-bold flex items-center px-2 py-1 rounded gap-2  text-xl opacity-70 hover:opacity-100 transition-opacity duration-300 ${textcolor}`}
            >
              <img
                src={currentLang.flag}
                alt={currentLang.code}
                className="w-5 h-5 rounded-full"
              />
              <span className="text-sm">{currentLang.label}</span>
            </button>
            {langMenuOpen && (
              <div className="absolute mt-2 right-0 bg-white opacity-60  text-black shadow rounded w-32 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLanguage(l.code)}
                    className="flex items-center w-full px-3 py-1 hover:bg-gray-100 text-left cursor-pointer"
                  >
                    <img
                      src={l.flag}
                      alt={l.code}
                      className="w-4 h-4 mr-2 rounded-full"
                    />
                    <span className="text-sm">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile: Hamburger + Lang */}
          <div className="md:hidden flex items-center gap-3">
            {isSearchable && <ProductSearch color={textcolor} />}

            <div className="relative" ref={langRefMobile}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className={`cursor-pointer font-bold text-xl flex items-center gap-2 px-2 py-1 rounded opacity-70 hover:opacity-100 transition-opacity duration-300 ${textcolor}`}
              >
                <img
                  src={currentLang.flag}
                  alt={currentLang.code}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-sm">{currentLang.label}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute mt-2 right-0 bg-white opacity-60  text-black shadow rounded w-32 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => changeLanguage(l.code)}
                      className="flex items-center w-full px-3 py-1 hover:bg-gray-100 text-left cursor-pointer"
                    >
                      <img
                        src={l.flag}
                        alt={l.code}
                        className="w-4 h-4 mr-2 rounded-full"
                      />
                      <span className="text-sm">{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setMenuOpen(true)}>
              <Menu
                className={`cursor-pointer font-bold text-xl opacity-70 hover:opacity-100 transition-opacity duration-300 ${textcolor}`}
                size={28}
              />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU - Slide In */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-70 bg-black bg-opacity-90 text-white z-50 transform transition-transform duration-300 opacity-80 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 font-bold"
          onClick={() => setMenuOpen(false)}
        >
          <X size={32} />
        </button>

        <div className="mt-20 flex flex-col items-start px-4 gap-2 text-xl font-bold">
          <a href="/" onClick={() => setMenuOpen(false)} className="">
            {t("home")}
          </a>
          <a href="/products" onClick={() => setMenuOpen(false)} className="">
            {t("products")}
          </a>

          {/* Dropdown kategoriler */}
          <div className=" w-full">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className=" flex items-center gap-2 "
            >
              {t("categories")}
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${
                  categoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                categoryOpen ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <div className="mt-2 flex flex-col text-base gap-2 px-2">
                <a
                  onClick={() => navigate("/ProductCategory/aydinlatma")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_lighting")}
                </a>
                <a
                  onClick={() => navigate("/ProductCategory/ayna")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_mirror")}
                </a>
                <a
                  onClick={() => navigate("/ProductCategory/saklama")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_storage")}
                </a>
                <a
                  onClick={() => navigate("/ProductCategory/oturma")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_seating")}
                </a>
                <a
                  onClick={() => navigate("/ProductCategory/masa")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_table")}
                </a>
                <a
                  onClick={() => navigate("/ProductCategory/tamamlayici")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_complementary")}
                </a>
                <a
                  onClick={() => navigate("/ProductCategory/hediye")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_gift")}
                </a>
                <a
                  onClick={() => navigate("/ProductCategory/tablo")}
                  className="block px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  {t("cat_painting")}
                </a>
              </div>
            </div>
          </div>

          <a
            onClick={() => {
              setMenuOpen(false);
              navigate("/ProductCategory/koleksiyon");
            }}
            className="hover:underline"
          >
            {t("collection")}
          </a>
          <a
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="hover:underline"
          >
            {t("contact")}
          </a>
        </div>
      </div>
    </>
  );
}
