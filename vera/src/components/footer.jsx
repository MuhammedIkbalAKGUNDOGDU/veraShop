import React from "react";
import { Mail, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FaInstagram, FaSpotify } from "react-icons/fa";

export default function Footer({}) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full text-black px-6 py-4 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Sol: Sosyal ikonlar */}
        <div className="flex items-center gap-4">
          <a
            href="https://open.spotify.com/user/smokeloversx?si=ZCnIRF7OTMyr2C6yHZW8gw" // ← kendi linkinle değiştir
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500 transition cursor-pointer"
          >
            <FaSpotify size={20} />
          </a>
          <a
            href="https://www.instagram.com/verarooom"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition cursor-pointer"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="mailto:verarooom@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition cursor-pointer"
          >
            <Mail size={20} />
          </a>
        </div>

        {/* Sağ: Telif */}
        <div className="text-sm text-gray-600 text-center md:text-right">
          {t("footer_rights")} © {currentYear}{" "}
          <a
            href="https://softiumtechnologies.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Softium Technologies
          </a>
        </div>
      </div>
    </footer>
  );
}
