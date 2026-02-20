import { useEffect, useRef } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import AdminPage from "./pages/AdminPage";
import ProductsCrudPage from "./pages/ProductsCrudPage";
import { ensureAnonymousAuth } from "./firebase";

const USE_ANON_AUTH = process.env.REACT_APP_USE_ANON_AUTH === "true";

export default function App() {
  const authBootstrappedRef = useRef(false);

  useEffect(() => {
    if (!USE_ANON_AUTH) return;
    if (authBootstrappedRef.current) return;
    authBootstrappedRef.current = true;

    ensureAnonymousAuth().catch((err) => {
      console.error("Falha na autenticação anônima:", err);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/pedidos" element={<AdminPage />} />
        <Route path="/admin/produtos" element={<ProductsCrudPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
