import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { CatalogPage } from './components/CatalogPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { CustomerAccountPage } from './components/CustomerAccountPage';
import { AdminDashboard } from './components/AdminDashboard';
import {
  AboutPage,
  ContactPage,
  FAQPage,
  PoliciesPage,
} from './components/InstitutionalPages';
import { CartDrawer } from './components/CartDrawer';
import { NotificationToast } from './components/NotificationToast';

const MainRouter: React.FC = () => {
  const { activePage } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#090A0F] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 selection:text-white">
      <Header />

      <main className="flex-1">
        {activePage === 'home' && <HomePage />}
        {activePage === 'catalog' && <CatalogPage />}
        {activePage === 'product-detail' && <ProductDetailPage />}
        {activePage === 'cart' && <CartPage />}
        {activePage === 'checkout' && <CheckoutPage />}
        {activePage === 'order-confirmation' && <OrderConfirmationPage />}
        {(activePage === 'account' || activePage === 'wishlist') && <CustomerAccountPage />}
        {activePage === 'admin' && <AdminDashboard />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'faq' && <FAQPage />}
        {activePage === 'policies' && <PoliciesPage />}
      </main>

      <Footer />
      <CartDrawer />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainRouter />
    </StoreProvider>
  );
}
