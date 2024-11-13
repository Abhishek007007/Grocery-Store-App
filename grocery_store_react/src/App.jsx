import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BillPage from "./pages/BillPage";
import ContactUsPage from "./pages/ContactUsPage";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/ProtectRoute";
import { useState } from "react";
import CartPage from "./pages/CartPage";

function App() {
  const [reload, setReload] = useState(false);
  function handleReload() {
    setReload(!reload);
  }
  return (
    <BrowserRouter>
      <div className="h-screen w-full flex flex-col overflow-auto">
        <div className="w-full h-10  sticky top-0">
          <Navbar handleReload={handleReload} />
        </div>
        <div className="h-full w-full">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact-us"
              element={
                <ProtectedRoute>
                  <ContactUsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart-page"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
