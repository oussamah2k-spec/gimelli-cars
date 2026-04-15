import { memo } from 'react';
import { motion } from "framer-motion";
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.svg';

const brandMotionProps = {
  initial: { opacity: 0, y: 14, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: { scale: 1.06 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

function NavbarBrand() {
  return (
    <NavLink to="/" className="inline-flex">
      <motion.div
        {...brandMotionProps}
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl border border-[#D4AF37]/25 bg-[#1A1A1A]/95 px-3 py-2 text-white shadow-[0_10px_28px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-[0_0_28px_rgba(212,175,55,0.2)]"
      >
        <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="logo-shimmer absolute inset-y-0 left-[-45%] w-[42%]" />
        </span>

        <img
          src={logo}
          alt="Gimelli Cars logo"
          className="relative z-10 h-12 w-auto object-contain sm:h-16 lg:h-[72px]"
          loading="eager"
          decoding="async"
        />

        <span className="relative z-10 flex flex-col leading-tight">
          <strong className="text-sm font-bold tracking-[0.08em] text-white sm:text-base">
            Gimelli Cars
          </strong>
          <small className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#D4AF37] sm:text-[11px]">
            Luxury Performance Garage
          </small>
        </span>
      </motion.div>
    </NavLink>
  );
}

function Navbar() {
  return (
    <header className="site-header bg-[#0B0B0B]">
      <div className="container site-header__inner">
        <NavbarBrand />

        <nav className="main-nav" aria-label="Primary">
          <NavLink className="main-nav__link" to="/">
            Home
          </NavLink>
          <NavLink className="main-nav__link" to="/cars">
            Cars
          </NavLink>
          <NavLink className="main-nav__link" to="/admin">
            Admin
          </NavLink>
        </nav>
      </div>

      <style>{`
        .logo-shimmer {
          background: linear-gradient(
            110deg,
            transparent 0%,
            rgba(212, 175, 55, 0.18) 35%,
            rgba(245, 217, 122, 0.34) 50%,
            rgba(212, 175, 55, 0.18) 65%,
            transparent 100%
          );
          filter: blur(0.2px);
          animation: logoShimmerSlide 3.4s linear infinite;
        }

        @keyframes logoShimmerSlide {
          0% {
            transform: translateX(0%);
            opacity: 0;
          }

          12% {
            opacity: 0.75;
          }

          60% {
            opacity: 0.55;
          }

          100% {
            transform: translateX(410%);
            opacity: 0;
          }
        }
      `}</style>
    </header>
  );
}

export default memo(Navbar);