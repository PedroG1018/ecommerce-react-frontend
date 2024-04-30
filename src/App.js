import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/login/Login";
import ItemDetails from "./pages/itemDetails/ItemDetails";
import { ToastContainer } from "react-toastify";
import Profile from "./pages/profile/Profile";
import Cart from "./pages/cart/Cart";
import SignUp from "./pages/signup/SignUp";
import Products from "./pages/products/Products";
import Footer from "./components/Footer";
import Review from "./pages/review/Review";
import Reset from "./pages/reset/Reset";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar count={0} />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/products" element={<Products />} />
          <Route path="/item/:itemId" element={<ItemDetails />} />
          <Route path="/review/:itemId" element={<Review />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <Footer />
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
