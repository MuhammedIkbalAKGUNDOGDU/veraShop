import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin"); // Giriş başarılıysa admin sayfasına yönlendir
    } catch (err) {
      alert("Giriş başarısız: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin Giriş</h2>
      <input
        type="email"
        placeholder="E-mail"
        className="border p-2 w-full mb-2"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Şifre"
        className="border p-2 w-full mb-2"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-black text-white px-4 py-2 w-full"
        onClick={handleLogin}
      >
        Giriş Yap
      </button>
    </div>
  );
};

export default AdminLogin;
