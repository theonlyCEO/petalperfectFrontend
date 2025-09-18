// src/App.jsx
import React from "react";
import { ShopProvider } from "./component/HomePageComponent/Context/ShopContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./component/Signup";
import Navbar from "./component/NavbarComponent/Navbar";
import SignIn from "./component/SignIn";
import ProtectedRoute from "./component/ProtectedRoute";
import Dummy from "./component/Dummy";
import Home from "./component/Home";
import AboutUs from "./component/AboutUs/AboutUs";
import CartPage from "./component/CartComponent/Cart";
import WishlistPage from "./component/WishListComponent/WishList";
import CategoryPage from "./component/CategoryComponent/Category";
import FlowerPage from "./component/ProductPage/ProductPage";
import CheckoutPage from "./component/CheckOutComponent/CheckOutPage";
import ProfilePage from "./component/ProfilePage/ProfilePage";
import ContactPage from "./component/ContactComponent/ContactPage";
import OrderPage from "./component/OrderComponent/OrderPage";
import TrackOrderPage from "./component/TrackOrderPageComponent/TrackOrderPage";
import Footer from "./component/FooterComponent/footer";
import ProductDetailPage from "./component/ProductDetailPage/ProductDetailPage";

const App = () => {
  return (
    <>
    <ShopProvider>
      <Router>
    <Navbar />
        <Routes>
          {/* PROTECTED CHECKOUT - must be signed in! */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          {/* PROTECTED PROFILE - must be signed in! */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          {/* PROTECTED ORDERS - must be signed in! */}
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }
          />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/contactus" element={<ContactPage />} />
          
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/Category" element={<CategoryPage />} />
          <Route
            path="/dummy"
            element={
              <ProtectedRoute>
                <Dummy />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </ShopProvider>
    </>

  );
};

export default App;