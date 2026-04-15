import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  BadgeDollarSign,
  Clock3,
  Headphones,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    title: 'Instant Booking Flow',
    description:
      'Reserve your vehicle in minutes with a streamlined experience built to feel fast, polished, and effortless.',
    icon: Sparkles,
  },
  {
    title: 'Transparent Pricing',
    description:
      'Clear premium pricing with zero hidden surprises, so customers always understand what they are paying for.',
    icon: BadgeDollarSign,
  },
  {
    title: 'Always-On Support',
    description:
      'Our team stays available for changes, questions, and urgent requests whenever timing becomes critical.',
    icon: Headphones,
  },
  {
    title: 'Trusted Protection',
    description:
      'Secure booking workflows, verified vehicles, and dependable safeguards create a more confident rental journey.',
    icon: ShieldCheck,
  },
  {
    title: 'Fast Pickup Network',
    description:
      'Convenient pickup locations and a refined handoff process help every trip begin smoothly and on time.',
    icon: MapPinned,
  },
  {
    title: 'Built For Efficiency',
    description:
      'Every touchpoint is designed to reduce friction, accelerate decisions, and keep the experience intelligently simple.',
    icon: Clock3,
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
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
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.18,
      ease: 'easeOut',
    },
  },
};

function Features() {
  return (
    <motion.section
      id="why-us"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl rounded-[32px] border border-[#2A2A2A] bg-[#0B0B0B]/80 px-6 py-10 backdrop-blur-xl sm:px-8 lg:px-10 lg:py-12">
        <motion.div variants={itemVariants} className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#F5D97A]">
            WHY BIZZINE CARS
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Modern rental features designed to feel premium at every step.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
            A clean, high-trust booking experience built around speed, clarity,
            and support so every customer interaction feels effortless.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="group flex min-h-[248px] flex-col rounded-[26px] border border-[#2A2A2A] bg-[#1A1A1A] p-8 shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition-all duration-200 ease-out hover:border-[#D4AF37] hover:shadow-[0_0_0_1px_rgba(212,175,55,0.14),0_14px_30px_rgba(212,175,55,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4AF37]/35 bg-[linear-gradient(135deg,#D4AF37,#F5D97A)] text-[#0B0B0B] shadow-[0_8px_18px_rgba(212,175,55,0.14)] transition-transform duration-200 group-hover:scale-[1.02]">
                  <Icon size={22} strokeWidth={2.1} />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/68">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

export default memo(Features);