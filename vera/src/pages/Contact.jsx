import React from "react";
import ContactSection from "../components/ContactSection";
import Header from "../components/Header";
import FloatingIcons from "../components/FloatingIcons";
import Footer from "../components/footer";
const Contact = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="w-full  max-w-7xl mx-auto">
        {" "}
        <Header textcolor="black" />
      </div>
      <ContactSection />
      <FloatingIcons
        rightLinks={{
          whatsapp: "https://wa.me/905393412716",
        }}
      />
      <Footer
        instagramLink="https://instagram.com/verarooom"
        emailLink="mailto:verarooom@gmail.com"
      />{" "}
    </div>
  );
};

export default Contact;
