import React from "react";
import ContactSection from "../components/ContactSection";
import Header from "../components/Header";
import FloatingIcons from "../components/FloatingIcons";
import Footer from "../components/footer";
const Contact = () => {
  return (
    <div>
      <Header textcolor="black" />
      <ContactSection />
      <FloatingIcons
        rightLinks={{
          whatsapp: "https://wa.me/905xxxxxxxxx",
        }}
      />{" "}
      <Footer />
    </div>
  );
};

export default Contact;
