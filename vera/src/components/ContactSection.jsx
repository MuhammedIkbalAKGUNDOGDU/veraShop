import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ContactSection() {
  const { t } = useTranslation();

  return (
    <div className="w-full px-6 py-12 max-w-7xl mx-auto space-y-10">
      {/* Üst kısım */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sol: Bilgiler */}
        <div className="w-full  bg-gray-100 p-6 rounded shadow">
          <h2 className="font-bold text-lg mb-4">{t("contact_info")}</h2>
          <div className="space-y-4 text-gray-700 text-sm">
            <div className="flex items-center gap-3">
              <Phone size={18} />
              <a
                href="tel:+905393412716"
                className="hover:underline hover:text-blue-600 transition"
              >
                +90 539 341 27 16
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} /> <span>Verarooom@gmail.com</span>
            </div>
            {/* <div className="flex items-start gap-3">
              <MapPin size={18} />
              <span>
                Suadiye, Bağdat Cad. No:399/8 <br />
                34740 Kadıköy / İstanbul
              </span>
            </div> */}
          </div>
        </div>

        {/* Sağ: Form */}
      </div>

      {/* Harita */}
      {/* <div className="w-full">
        <iframe
          title="Otto Suadiye Harita"
          className="w-full h-96 rounded"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.9471470369656!2d29.084785676406594!3d40.96305237135715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac6bb7a65d2cf%3A0x5acaa8f5ef37a6c8!2sOtto%20Suadiye!5e0!3m2!1str!2str!4v1716045476553!5m2!1str!2str"
          loading="lazy"
          allowFullScreen
        ></iframe>
      </div> */}
    </div>
  );
}
