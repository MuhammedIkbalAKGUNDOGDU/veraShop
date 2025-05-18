import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import ProductDeleter from "../components/ProductDeleter";
import ProductEditor from "../components/ProductEditor";

const Admin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
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

  if (!isAuthorized) return null;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="text-red-500 border px-3 py-1 rounded"
        >
          Çıkış Yap
        </button>
      </div>

      <ProductForm />
      <ProductDeleter />
      <ProductEditor />
    </div>
  );
};

export default Admin;
