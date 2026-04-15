import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1800&q=82&fm=webp';

function PremiumHero({ carsCount = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#0B0B0B] px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(212,175,55,0.12),transparent_22%),radial-gradient(circle_at_84%_22%,rgba(255,255,255,0.04),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_24%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-7"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#D4AF37]">
            GIMELLI CARS
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.55, ease: 'easeOut' }}
              className="inline-block bg-[linear-gradient(135deg,#D4AF37_0%,#F5D97A_36%,#FFFFFF_100%)] bg-clip-text text-transparent"
            >
              Premium Cars
            </motion.span>{' '}
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55, ease: 'easeOut' }}
            >
              Marketplace
            </motion.span>
          </h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.55, ease: 'easeOut' }}
            className="max-w-2xl text-base leading-8 text-white/68 sm:text-lg"
          >
            Discover high-performance sedans, supercars, and elite SUVs in a cinematic booking flow crafted for a modern luxury experience.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5, ease: 'easeOut' }}
            className="flex flex-wrap gap-3"
          >
            <Link
              className="rounded-full border border-[#D4AF37]/35 bg-[linear-gradient(135deg,#D4AF37,#F5D97A)] px-6 py-3 text-sm font-semibold text-[#0B0B0B] shadow-[0_12px_28px_rgba(212,175,55,0.2)] transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.16),0_18px_34px_rgba(212,175,55,0.28)]"
              to="/cars"
            >
              Browse Cars
            </Link>
            <Link
              className="rounded-full border border-white/12 bg-white/[0.02] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-[#D4AF37]/24 hover:bg-white/[0.05]"
              to="/admin"
            >
              View Garage
            </Link>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.55, ease: 'easeOut' }}
            className="grid gap-3 sm:grid-cols-3"
          >
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4 backdrop-blur-md">
              <p className="text-xl font-semibold text-white">{carsCount || '0'}</p>
              <p className="mt-1 text-xs text-white/58">Elite vehicles available now</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4 backdrop-blur-md">
              <p className="text-xl font-semibold text-white">Live</p>
              <p className="mt-1 text-xs text-white/58">Synced directly from Firebase inventory</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4 backdrop-blur-md">
              <p className="text-xl font-semibold text-white">Performance</p>
              <p className="mt-1 text-xs text-white/58">Luxury-first UI with refined motion</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          transition={{ duration: 0.85, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="group relative"
        >
          <div className="pointer-events-none absolute -inset-6 rounded-[38px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.2),transparent_68%)] blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#141414] shadow-[0_26px_72px_rgba(0,0,0,0.45)] transition-all duration-300 group-hover:border-[#D4AF37]/35 group-hover:shadow-[0_0_0_1px_rgba(212,175,55,0.14),0_28px_72px_rgba(212,175,55,0.2)]">
            <img
              src={HERO_IMAGE}
              alt="Luxury performance coupe in cinematic lighting"
              loading="lazy"
              decoding="async"
              className="h-[420px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 sm:h-[500px]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.25)_38%,rgba(0,0,0,0.75)_100%)]" />
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#F5D97A]">
                Signature Collection
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-white/88 sm:text-base">
                Dark, dramatic, and precision-tuned visuals inspired by top-tier luxury automotive design.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(PremiumHero);