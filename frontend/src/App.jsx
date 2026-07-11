import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductPage from "./pages/ProductPage";
import ScrollToTop from "./components/ScrollToTop";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminLayout from "./layout/AdminLayout";
import PublicLayout from "./layout/PublicLayout";
import { useState } from "react";
import Dashboard from "./admin/scenes/dashboard";
import Team from "./admin/scenes/team";
import Invoices from "./admin/scenes/invoices";
import Contacts from "./admin/scenes/contacts";
import Bar from "./admin/scenes/bar";
import Form from "./admin/scenes/form";
import Line from "./admin/scenes/line";
import Pie from "./admin/scenes/pie";
import FAQ from "./admin/scenes/faq";
import Geography from "./admin/scenes/geography";
import Calendar from "./admin/scenes/calendar/calendar";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;

    getCartItems();
  }, [getCartItems, user]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-white-900 text-white relative overflow-hidden">
      <div className="relative mt-20">
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route
              path="/products/brand/:brandSlug"
              element={<ProductPage />}
            />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/signup"
              element={!user ? <SignUpPage /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!user ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/cart"
              element={user ? <CartPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/purchase-success"
              element={
                user ? <PurchaseSuccessPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/purchase-cancel"
              element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />}
            />
          </Route>

          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              user?.role === "admin" ? (
                <AdminLayout />
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="team" element={<Team />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="form" element={<Form />} />
            <Route path="bar" element={<Bar />} />
            <Route path="pie" element={<Pie />} />
            <Route path="line" element={<Line />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="geography" element={<Geography />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
