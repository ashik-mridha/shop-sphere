import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Protected Route Guard
import ProtectedRoute from "./routes/ProtectedRoute";

// Auth Pages & OAuth Callback
import LoginPage from "./auth/login/page";
import RegisterPage from "./auth/register/page";// Auth callback handler

// Dashboard Pages
import AdminSettings from "./pages/dashboard/settings/page";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminUsersPage from "./pages/dashboard/users/page";

// Shop Pages
import Homepage from "./Components/Homepage";
import ShopingPage from "./pages/shop/page";
import ProductDetails from "./pages/shop/ProductDetails";
import CheckoutPage from "./pages/shop/CheckoutPage";
import Cartpage from "./pages/cart/page";

// Other Components
import NotFound from "./NotFound";
import GlobalLoadingOverlay from "./Components/GlobalLoadingOverlay";
import AboutPage from "./pages/about/page";
import ContactPage from "./pages/contact/page";
import TrackOrderPage from "./pages/track-order/page";
import AdminOrdersPage from "./pages/dashboard/orders/AdminOrdersPage";
import MyOrdersPage from "./pages/dashboard/orders/MyOrdersPage";
import WishlistPage from "./pages/dashboard/wishlist/page";
import MyProfilePage from "./pages/dashboard/profile/page";

function Placeholder({ title }) {
  return (
    <div className="rounded-2xl bg-[#121816] border border-[#22332a] p-8 text-white shadow-sm">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-gray-400">
        This page will be connected to the backend next.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <GlobalLoadingOverlay />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/shop" element={<ShopingPage />} />
          <Route path="/shop/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cartpage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="wishlist" element={<WishlistPage />} />

          {/* LOGGED IN USER PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
            {/* Dynamic ID সহ রাউট */}
            <Route path="/checkout/:id" element={<CheckoutPage />} />
            <Route path="/track-order/:id" element={<TrackOrderPage />} />

            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route
              path="/wishlist"
              element={<Placeholder title="Wishlist" />}
            />
          </Route>
        </Route>

        {/* AUTHENTICATION ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* OAUTH (GOOGLE) REDIRECT & ROLE VERIFICATION ROUTE */}

        {/* USER DASHBOARD */}
        <Route element={<ProtectedRoute allowedRole="user" />}>
          <Route path="/user" element={<DashboardLayout role="user" />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="orders" element={<MyOrdersPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="profile" element={<MyProfilePage />} />
            <Route path="settings" element={<Placeholder title="Settings" />} />
          </Route>
        </Route>

        {/* ADMIN DASHBOARD */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<DashboardLayout role="admin" />} >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminSettings />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="profile" element={<MyProfilePage />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* 404 PAGE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}