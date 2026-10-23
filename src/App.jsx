import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import Spinner from "./components/ui/Spinner";

// Route-level code splitting: every page is its own chunk.
const HomePage = lazy(() => import("./pages/home/HomePage"));
const ShopPage = lazy(() => import("./pages/shop/ShopPage"));
const ProductPage = lazy(() => import("./pages/shop/ProductPage"));
const CartPage = lazy(() => import("./pages/cart/CartPage"));
const CheckoutPage = lazy(() => import("./pages/checkout/CheckoutPage"));
const CheckoutSuccessPage = lazy(() => import("./pages/checkout/CheckoutSuccessPage"));
const CheckoutCancelPage = lazy(() => import("./pages/checkout/CheckoutCancelPage"));
const WishlistPage = lazy(() => import("./pages/wishlist/WishlistPage"));
const AboutPage = lazy(() => import("./pages/static/AboutPage"));
const ContactPage = lazy(() => import("./pages/static/ContactPage"));
const FaqPage = lazy(() => import("./pages/static/FaqPage"));
const ShippingReturnsPage = lazy(() => import("./pages/static/ShippingReturnsPage"));
const PrivacyPage = lazy(() => import("./pages/static/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/static/TermsPage"));
const TrackOrderPage = lazy(() => import("./pages/track-order/TrackOrderPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const AuthRedirectPage = lazy(() => import("./pages/auth/AuthRedirectPage"));

const UserOverviewPage = lazy(() => import("./pages/user/UserOverviewPage"));
const UserOrdersPage = lazy(() => import("./pages/user/UserOrdersPage"));
const UserOrderDetailPage = lazy(() => import("./pages/user/UserOrderDetailPage"));
const UserAddressesPage = lazy(() => import("./pages/user/UserAddressesPage"));
const UserProfilePage = lazy(() => import("./pages/user/UserProfilePage"));

const AdminOverviewPage = lazy(() => import("./pages/admin/AdminOverviewPage"));
const AdminProductsPage = lazy(() => import("./pages/admin/AdminProductsPage"));
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminCategoriesPage = lazy(() => import("./pages/admin/AdminCategoriesPage"));
const AdminCouponsPage = lazy(() => import("./pages/admin/AdminCouponsPage"));
const AdminReviewsPage = lazy(() => import("./pages/admin/AdminReviewsPage"));
const AdminMessagesPage = lazy(() => import("./pages/admin/AdminMessagesPage"));

export default function App() {
  return (
    <Suspense fallback={<Spinner label="Loading page" className="min-h-[60vh]" />}>
      <ScrollToTop />
      <Routes>
        {/* Public storefront */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Signed-in customers (admins may shop too) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/track-order/:id" element={<TrackOrderPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/redirect" element={<AuthRedirectPage />} />

        {/* Customer dashboard */}
        <Route element={<ProtectedRoute allowedRole="user" />}>
          <Route path="/user" element={<DashboardLayout role="user" />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<UserOverviewPage />} />
            <Route path="orders" element={<UserOrdersPage />} />
            <Route path="orders/:id" element={<UserOrderDetailPage />} />
            <Route path="wishlist" element={<WishlistPage embedded />} />
            <Route path="addresses" element={<UserAddressesPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        {/* Admin dashboard */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<DashboardLayout role="admin" />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminOverviewPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
