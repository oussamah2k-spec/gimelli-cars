import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';

function MainLayout() {
  return (
    <div className="app-shell luxury-shell">
      <div className="app-shell__backdrop" aria-hidden="true" />
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default MainLayout;