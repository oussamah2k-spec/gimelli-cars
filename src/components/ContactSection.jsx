import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Mail, MapPin, PhoneCall, Sparkles } from 'lucide-react';

const contactCards = [
  {
    title: 'WhatsApp',
    eyebrow: 'Instant priority line',
    description: '+212643249124',
    detail: 'Priority support for reservations, delivery requests, and instant assistance.',
    ctaLabel: 'Chat on WhatsApp',
    href: 'https://wa.me/212643249124',
    icon: PhoneCall,
    eyebrowClass: 'text-[#86efac]',
    iconWrapperClass:
      'border-[#25D366]/25 bg-[linear-gradient(135deg,rgba(37,211,102,0.2),rgba(37,211,102,0.08))] text-[#25D366] shadow-[0_12px_28px_rgba(37,211,102,0.16)]',
    hoverGlowClass:
      'group-hover:shadow-[0_0_0_1px_rgba(37,211,102,0.18),0_20px_36px_rgba(37,211,102,0.12)]',
    accentWashClass:
      'bg-[linear-gradient(145deg,rgba(255,255,255,0.05),transparent_38%,rgba(37,211,102,0.1)_78%)]',
    buttonClass:
      'border-[#25D366]/30 bg-[linear-gradient(135deg,#25D366,#1ebe5d)] text-white shadow-[0_10px_24px_rgba(37,211,102,0.18)] hover:shadow-[0_14px_30px_rgba(37,211,102,0.24)]',
    buttonGlowClass:
      'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_58%)]',
  },
  {
    title: 'Email',
    eyebrow: 'Curated concierge',
    description: 'Gimellicar7@gmail.com',
    detail: 'For curated booking requests, business inquiries, and tailored premium support.',
    ctaLabel: 'Send Email',
    href: 'mailto:Gimellicar7@gmail.com',
    icon: Mail,
    eyebrowClass: 'text-[#93c5fd]',
    iconWrapperClass:
      'border-[#3b82f6]/20 bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(234,67,53,0.06))] text-[#60a5fa] shadow-[0_12px_28px_rgba(59,130,246,0.12)]',
    hoverGlowClass:
      'group-hover:shadow-[0_0_0_1px_rgba(59,130,246,0.14),0_20px_36px_rgba(59,130,246,0.08)]',
    accentWashClass:
      'bg-[linear-gradient(145deg,rgba(255,255,255,0.05),transparent_36%,rgba(59,130,246,0.08)_76%,rgba(234,67,53,0.04))]',
    buttonClass:
      'border-[#3b82f6]/25 bg-[linear-gradient(135deg,rgba(59,130,246,0.92),rgba(37,99,235,0.88))] text-white shadow-[0_10px_24px_rgba(59,130,246,0.14)] hover:shadow-[0_14px_30px_rgba(59,130,246,0.2)]',
    buttonGlowClass:
      'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_58%)]',
  },
  {
    title: 'Location',
    eyebrow: 'Physical destination',
    description: 'Open our showroom route in Google Maps',
    detail: 'Navigate directly to Gimelli Car with one tap and arrive with zero friction.',
    ctaLabel: 'Open in Google Maps',
    href: 'https://www.google.com/maps/place/Gimelli+car/@33.7017801,-7.362431',
    icon: MapPin,
    eyebrowClass: 'text-[#fdba74]',
    iconWrapperClass:
      'border-[#f97316]/20 bg-[linear-gradient(135deg,rgba(249,115,22,0.18),rgba(234,67,53,0.08))] text-[#fb923c] shadow-[0_12px_28px_rgba(249,115,22,0.14)]',
    hoverGlowClass:
      'group-hover:shadow-[0_0_0_1px_rgba(249,115,22,0.16),0_20px_36px_rgba(249,115,22,0.1)]',
    accentWashClass:
      'bg-[linear-gradient(145deg,rgba(255,255,255,0.05),transparent_36%,rgba(249,115,22,0.08)_74%,rgba(234,67,53,0.05))]',
    buttonClass:
      'border-[#f97316]/25 bg-[linear-gradient(135deg,rgba(249,115,22,0.94),rgba(234,67,53,0.9))] text-white shadow-[0_10px_24px_rgba(249,115,22,0.16)] hover:shadow-[0_14px_30px_rgba(249,115,22,0.22)]',
    buttonGlowClass:
      'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_58%)]',
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: 'easeOut',
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.18,
      ease: 'easeOut',
    },
  },
};

function useTiltHover(isEnabled) {
  const cardRef = useRef(null);
  const frameRef = useRef(0);
  const targetRef = useRef({ rotateX: 0, rotateY: 0, scale: 1 });
  const lastRunRef = useRef(0);

  const applyTransform = useCallback(() => {
    frameRef.current = 0;

    if (!cardRef.current) {
      return;
    }

    const now = performance.now();

    if (now - lastRunRef.current < 16) {
      frameRef.current = requestAnimationFrame(applyTransform);
      return;
    }

    lastRunRef.current = now;

    const { rotateX, rotateY, scale } = targetRef.current;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
  }, []);

  const scheduleTransform = useCallback(() => {
    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(applyTransform);
    }
  }, [applyTransform]);

  const handleMouseMove = useCallback(
    (event) => {
      if (!isEnabled || !cardRef.current) {
        return;
      }

      const rect = cardRef.current.getBoundingClientRect();
      const pointerX = (event.clientX - rect.left) / rect.width;
      const pointerY = (event.clientY - rect.top) / rect.height;
      const rotateY = Number(((pointerX - 0.5) * 10).toFixed(2));
      const rotateX = Number(((0.5 - pointerY) * 10).toFixed(2));

      targetRef.current = {
        rotateX: Math.max(-5, Math.min(5, rotateX)),
        rotateY: Math.max(-5, Math.min(5, rotateY)),
        scale: 1.01,
      };

      scheduleTransform();
    },
    [isEnabled, scheduleTransform]
  );

  const handleMouseLeave = useCallback(() => {
    targetRef.current = { rotateX: 0, rotateY: 0, scale: 1 };
    scheduleTransform();
  }, [scheduleTransform]);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return { cardRef, handleMouseMove, handleMouseLeave };
}

const ContactActionButton = memo(function ContactActionButton({ href, label, buttonClass, buttonGlowClass }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`group relative mt-6 inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${buttonClass}`}
    >
      <span
        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${buttonGlowClass}`}
      />
      <span className="relative z-10">{label}</span>
      <ArrowUpRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </motion.a>
  );
});

const ContactCard = memo(function ContactCard({ card, enableTilt }) {
  const Icon = card.icon;
  const { cardRef, handleMouseMove, handleMouseLeave } = useTiltHover(enableTilt);

  return (
    <motion.article variants={itemVariants} className="relative">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative overflow-hidden rounded-[30px] border border-[#2A2A2A] bg-[#141414] p-7 backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 will-change-transform hover:border-white/10"
      >
        <div className={`pointer-events-none absolute inset-0 rounded-[30px] opacity-80 ${card.accentWashClass}`} />
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div
          className={`pointer-events-none absolute inset-0 rounded-[30px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${card.hoverGlowClass}`}
        />

        <div className="relative z-10 flex items-start gap-5">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${card.iconWrapperClass}`}
          >
            <Icon size={24} strokeWidth={2.1} />
          </div>

          <div className="min-w-0 flex-1">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${card.eyebrowClass}`}>
              {card.eyebrow}
            </p>
            <h3 className="mt-3 break-words text-2xl font-semibold tracking-tight text-white">
              {card.title}
            </h3>
            <p className="mt-2 break-words text-base font-medium text-white/84">
              {card.description}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/64">
              {card.detail}
            </p>
            <ContactActionButton
              href={card.href}
              label={card.ctaLabel}
              buttonClass={card.buttonClass}
              buttonGlowClass={card.buttonGlowClass}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
});

function ContactSection() {
  const reduceMotion = useReducedMotion();
  const [enableTilt, setEnableTilt] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
    const updateTiltMode = () => {
      setEnableTilt(mediaQuery.matches && !reduceMotion);
    };

    updateTiltMode();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateTiltMode);
    } else {
      mediaQuery.addListener(updateTiltMode);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateTiltMode);
      } else {
        mediaQuery.removeListener(updateTiltMode);
      }
    };
  }, [reduceMotion]);

  return (
    <section id="contact" className="relative overflow-hidden bg-[#0B0B0B] px-4 py-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(212,175,55,0.12),_transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(245,217,122,0.08),_transparent_72%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.04),transparent_22%),radial-gradient(circle_at_80%_15%,rgba(212,175,55,0.08),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:120px_120px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mx-auto max-w-7xl"
      >
        <motion.div variants={itemVariants} className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#1A1A1A]/90 px-4 py-2 backdrop-blur-md">
            <Sparkles size={14} className="text-[#F5D97A]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/72">
              CONTACT EXPERIENCE
            </p>
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            Reach Gimelli Car through a contact flow designed like a premium product.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/64 sm:text-lg">
            Restrained glass surfaces, softened gold light, and direct premium access points built to feel precise, minimal, and unmistakably high-end.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 items-stretch gap-12 md:grid-cols-2">
          <motion.div variants={itemVariants} className="grid gap-6 self-start">
            {contactCards.map((card) => (
              <ContactCard key={card.title} card={card} enableTilt={enableTilt} />
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-full bg-[radial-gradient(circle,_rgba(212,175,55,0.12),_transparent_72%)] blur-2xl lg:block" />
            <div className="absolute -right-6 bottom-10 hidden h-28 w-28 rounded-full bg-[radial-gradient(circle,_rgba(245,217,122,0.09),_transparent_74%)] blur-2xl lg:block" />

            <div className="relative overflow-hidden rounded-[32px] border border-[#2A2A2A] bg-[#0B0B0B]/84 p-3 shadow-[0_18px_44px_rgba(0,0,0,0.34)] backdrop-blur-md">
              <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[linear-gradient(160deg,rgba(255,255,255,0.05),transparent_32%,rgba(212,175,55,0.05)_68%,rgba(245,217,122,0.05))]" />
              <iframe
                title="Gimelli Car location"
                src="https://www.google.com/maps?q=Gimelli+car&z=15&output=embed"
                className="h-[400px] w-full rounded-[24px] border-0 md:h-[100%] md:min-h-[520px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

              <motion.a
                href="https://www.google.com/maps/place/Gimelli+car/@33.7017801,-7.362431"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="group absolute bottom-6 right-6 z-20 inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full border border-[#f97316]/25 bg-[linear-gradient(135deg,rgba(249,115,22,0.94),rgba(234,67,53,0.9))] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(249,115,22,0.18)] transition-all duration-300 hover:shadow-[0_16px_34px_rgba(249,115,22,0.24)]"
              >
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_58%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative z-10">Open in Google Maps</span>
                <ArrowUpRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default memo(ContactSection);
