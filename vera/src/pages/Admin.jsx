import { useEffect, useState } from "react";
import {
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import ProductDeleter from "../components/ProductDeleter";
import ProductEditor from "../components/ProductEditor";
import ProductMarker from "../components/ProductMarker";

const Admin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setIsAuthorized(true);
      else navigate("/admin-login");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin-login");
  };

  const handlePasswordReset = async () => {
    const user = auth.currentUser;
    if (user && user.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        setEmailSent(true);
        setError(null);
      } catch (err) {
        setError("Mail gönderilemedi: " + err.message);
        setEmailSent(false);
      }
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="flex gap-2">
          <button
            onClick={handlePasswordReset}
            className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50"
          >
            Şifreyi Sıfırla
          </button>
          <button
            onClick={handleLogout}
            className="text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-50"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {emailSent && (
        <p className="text-sm text-green-600 mb-4">
          Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.
        </p>
      )}
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <ProductForm />
      <ProductDeleter />
      <ProductEditor />
      <ProductMarker />
    </div>
  );
};

export default Admin;
