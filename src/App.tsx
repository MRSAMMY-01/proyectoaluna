import { Routes, Route } from 'react-router-dom';
import { ProductsProvider } from '@/context/ProductsContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Catalog from '@/components/Catalog';
import Location from '@/components/Location';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import AdminPage from '@/pages/AdminPage';
import ProductDetail from '@/pages/ProductDetail';
import SplashScreen from '@/components/SplashScreen';

function HomePage() {
  return (
    <div className="min-h-screen bg-pink-50 text-rose-900 overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Catalog />
        <Location />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function App() {
  return (
    <ProductsProvider>
      <SplashScreen />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
      </Routes>
    </ProductsProvider>
  );
}

export default App;
