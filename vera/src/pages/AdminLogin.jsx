import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err) {
      alert("Giriş başarısız: " + err.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Lütfen önce e-mail adresinizi girin.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError(null);
    } catch (err) {
      setError("Şifre sıfırlama hatası: " + err.message);
      setResetSent(false);
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
        className="bg-black text-white px-4 py-2 w-full mb-2"
        onClick={handleLogin}
      >
        Giriş Yap
      </button>

      <button
        className="text-sm text-blue-600 hover:underline w-full text-left"
        onClick={handlePasswordReset}
      >
        Şifremi unuttum
      </button>

      {resetSent && (
        <p className="text-green-600 text-sm mt-2">
          Şifre sıfırlama e-postası gönderildi.
        </p>
      )}
      {error && (
        <p className="text-red-600 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default AdminLogin;
