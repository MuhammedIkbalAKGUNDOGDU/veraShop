import { Instagram, Mail } from "lucide-react";
import { FaSpotify, FaWhatsapp } from "react-icons/fa";

export default function FloatingIcons({ leftLinks = {}, rightLinks = {} }) {
  return (
    <>
      {/* Sol alt köşe ikonları */}
      <div className="fixed bottom-4 left-4 z-50 flex gap-3">
        <a
          href="https://open.spotify.com/user/smokeloversx?si=ZCnIRF7OTMyr2C6yHZW8gw" // ← kendi linkinle değiştir
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8  text-white hover:text-green-500 transition cursor-pointer"
        >
          <FaSpotify size={30} />
        </a>
        {leftLinks.instagram && (
          <a
            href={leftLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="w-8 h-8 md:w-8 md:h-8 text-white hover:text-pink-400 transition cursor-pointer" />
          </a>
        )}
        {leftLinks.mail && (
          <a href={`mailto:${leftLinks.mail}`}>
            <Mail className="w-8 h-8 md:w-8 md:h-8 text-white hover:text-blue-300 transition cursor-pointer" />
          </a>
        )}
      </div>

      {/* Sağ alt köşe ikonları */}
      <div className="fixed bottom-4 right-4 z-50 cursor-pointer">
        {rightLinks.whatsapp && (
          <a
            href={rightLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp className="w-11 h-11 md:w-16 md:h-16 text-green-500 bg-white rounded-full p-1 shadow hover:scale-105 transition" />
          </a>
        )}
      </div>
    </>
  );
}
