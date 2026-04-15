import { NavLink } from 'react-router-dom';
import ContactSection from './ContactSection';
import SocialIcons from './SocialIcons';

function Footer() {
  return (
    <footer className="site-footer">
      <ContactSection />
      <div className="container site-footer__inner">
        <div className="site-footer__brand-block">
          <span className="site-footer__eyebrow">Client2 Cars</span>
          <strong>Luxury cars marketplace with refined browsing and direct WhatsApp contact.</strong>
          <p>&copy; {new Date().getFullYear()} Client2 Cars. All rights reserved.</p>
        </div>

        <div className="site-footer__links-block">
          <span className="site-footer__label">Explore</span>
          <nav className="site-footer__links" aria-label="Footer links">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/cars">Cars</NavLink>
            <a href="https://wa.me/212643249124" target="_blank" rel="noreferrer">
              Contact
            </a>
          </nav>
        </div>

        <div className="site-footer__social-block">
          <span className="site-footer__label">FOLLOW US</span>
          <SocialIcons />
        </div>
      </div>
    </footer>
  );
}

export default Footer;