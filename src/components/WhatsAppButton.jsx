import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, MessageCircleMore } from 'lucide-react';

function WhatsAppButton() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href="https://wa.me/212643249124"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      whileHover={reduceMotion ? undefined : { scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.985 }}
      className="group fixed bottom-5 right-5 z-50 inline-flex cursor-pointer items-center gap-3 overflow-hidden rounded-full border border-[#25D366]/30 bg-[#0B0B0B]/92 px-3 py-3 text-white shadow-[0_14px_34px_rgba(0,0,0,0.34),0_0_24px_rgba(37,211,102,0.2)] backdrop-blur-md transition-all duration-300 hover:border-[#25D366]/45 hover:shadow-[0_18px_40px_rgba(0,0,0,0.4),0_0_32px_rgba(37,211,102,0.28)] sm:bottom-6 sm:right-6"
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_34%,rgba(37,211,102,0.08),rgba(37,211,102,0.03))]" />
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(37,211,102,0.18),transparent_64%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#25D366]/35 bg-[linear-gradient(135deg,#25D366,#1ebe5d)] text-white shadow-[0_10px_24px_rgba(37,211,102,0.24)] transition-all duration-300 group-hover:scale-[1.02] group-hover:bg-[linear-gradient(135deg,#1ebe5d,#19a84f)]">
        <MessageCircleMore size={21} strokeWidth={2.2} />
      </span>
      <span className="relative hidden text-left sm:block">
        <span className="block text-[10px] uppercase tracking-[0.28em] text-[#86efac]">WhatsApp</span>
        <span className="block text-sm font-semibold">Start premium chat</span>
      </span>
      <span className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-[#25D366]/20 bg-white/5 text-white/80 transition-all duration-300 group-hover:border-[#25D366]/35 group-hover:bg-[#25D366]/10 group-hover:text-white sm:inline-flex">
        <ArrowUpRight size={15} />
      </span>
    </motion.a>
  );
}

export default memo(WhatsAppButton);
