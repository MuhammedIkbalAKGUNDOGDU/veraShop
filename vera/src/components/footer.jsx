import React from "react";
import { Mail, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer({ instagramLink, emailLink }) {
  const { t } = useTranslation();

  return (
    <footer className="w-full text-black px-6 py-4 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Sol: Sosyal ikonlar */}
        <div className="flex items-center gap-4">
          <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition cursor-pointer"
          >
            <Instagram size={20} />
          </a>
          <a
            href={emailLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition cursor-pointer"
          >
            <Mail size={20} />
          </a>
        </div>

        {/* Sağ: Telif */}
        <div className="text-sm text-gray-600 text-center md:text-right">
          {t("footer_rights")} © 2024{" "}
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
