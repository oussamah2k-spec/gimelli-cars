import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarDays, CarFront, MapPin, MessageCircleMore, Phone, ShieldCheck } from 'lucide-react';
import { useParams } from 'react-router-dom';
import AppScreenLoader from '../components/AppScreenLoader';
import { useFirestore } from '../hooks/useFirestore';

function formatPrice(price) {
  const amount = Number(price);
  return Number.isFinite(amount) ? amount : 0;
}

function getNumberOfDays(pickupDate, returnDate) {
  if (!pickupDate || !returnDate) {
    return 0;
  }

  const startDate = new Date(pickupDate);
  const endDate = new Date(returnDate);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const differenceInTime = endDate.setHours(0, 0, 0, 0) - startDate.setHours(0, 0, 0, 0);

  if (differenceInTime < 0) {
    return 0;
  }

  return Math.max(1, Math.ceil(differenceInTime / millisecondsPerDay) + 1 - 1);
}

function normalizeImages(document) {
  const normalizedImages = Array.isArray(document?.images)
    ? document.images
        .map((image, index) => {
          if (typeof image === 'string') {
            return {
              url: image,
              description: index === 0 ? 'Main car view' : `Car view ${index + 1}`,
            };
          }

          if (!image?.url) {
            return null;
          }

          return {
            url: image.url,
            description: image.description || (index === 0 ? 'Main car view' : `Car view ${index + 1}`),
          };
        })
        .filter(Boolean)
    : [];

  if (normalizedImages.length > 0) {
    return normalizedImages;
  }

  if (document?.imageUrl) {
    return [
      {
        url: document.imageUrl,
        description: 'Main car view',
      },
    ];
  }

  return [];
}

function ProductDetails() {
  const reduceMotion = useReducedMotion();
  const { id, productId } = useParams();
  const resolvedProductId = productId || id;
  const { document, error, loading } = useFirestore('cars', resolvedProductId);
  const [selectedImage, setSelectedImage] = useState('');
  const [formState, setFormState] = useState({
    customerName: '',
    phone: '',
    address: '',
    pickupDate: '',
    returnDate: '',
  });
  const [formError, setFormError] = useState('');

  const images = useMemo(() => normalizeImages(document), [document]);
  const bookingDays = useMemo(
    () => getNumberOfDays(formState.pickupDate, formState.returnDate),
    [formState.pickupDate, formState.returnDate]
  );
  const totalPrice = useMemo(
    () => (bookingDays > 0 ? Number(document?.price || 0) * bookingDays : 0),
    [bookingDays, document?.price]
  );
  const canSubmitBooking = useMemo(
    () => Boolean(
      formState.customerName &&
        formState.phone &&
        formState.address &&
        formState.pickupDate &&
        formState.returnDate &&
        bookingDays > 0
    ),
    [bookingDays, formState.address, formState.customerName, formState.phone, formState.pickupDate, formState.returnDate]
  );

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage((currentImage) => currentImage || images[0].url);
    }
  }, [images]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;

    if (formError) {
      setFormError('');
    }

    setFormState((currentState) => ({
      ...currentState,
      [name]: currentState[name] === value ? currentState[name] : value,
    }));
  }, [formError]);

  const handleWhatsAppBooking = useCallback(() => {
    const { customerName, phone, address, pickupDate, returnDate } = formState;

    if (!customerName || !phone || !address || !pickupDate || !returnDate) {
      setFormError('Please complete your name, phone number, address, and booking dates.');
      return;
    }

    if (new Date(returnDate) < new Date(pickupDate)) {
      setFormError('Return date must be after the pick-up date.');
      return;
    }

    if (bookingDays <= 0) {
      setFormError('Please select valid booking dates.');
      return;
    }

    setFormError('');

    const message = [
      'Hello, I want to book:',
      `Car: ${document?.name || 'Selected car'}`,
      `Name: ${customerName}`,
      `Phone: ${phone}`,
      `Address: ${address}`,
      `From: ${pickupDate}`,
      `To: ${returnDate}`,
      `Total price: ${formatPrice(totalPrice)} DH`,
    ].join('\n');

    window.open(`https://wa.me/212643249124?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }, [document?.name, formState, bookingDays, totalPrice]);

  const vehicleMeta = useMemo(() => {
    if (!document) {
      return [];
    }

    return [document.year, document.mileage, document.location].filter(Boolean);
  }, [document]);

  if (loading) {
    return <AppScreenLoader />;
  }

  if (error) {
    return <div className="container status-message">Error loading product details: {error.message}</div>;
  }

  if (!document) {
    return <div className="container status-message">Product not found.</div>;
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: 'var(--bg, #0B0B0B)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── PAGE HERO ── */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="py-12 text-center lg:py-16"
        >
          <motion.span
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/8 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
            Premium Rental
          </motion.span>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {document.name}
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="mt-3 text-2xl font-semibold"
          >
            <span className="text-[#F5D97A]">{formatPrice(document.price)} DH</span>
            <span className="ml-2 text-base font-normal text-white/40">/ day</span>
          </motion.p>
        </motion.div>

        {/* ── TWO-COLUMN GRID ── */}
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">

          {/* ─── LEFT: Images + Description ─── */}
          <div className="flex flex-col gap-6">

            {/* Image Gallery */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="overflow-hidden rounded-[32px] border border-[#2A2A2A] bg-[#111] shadow-[0_18px_42px_rgba(0,0,0,0.5)]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={selectedImage || images[0]?.url || document.imageUrl}
                  alt={document.name}
                  loading="lazy"
                  decoding="async"
                  className="h-[300px] w-full object-cover transition-transform duration-200 hover:scale-[1.01] sm:h-[420px] lg:h-[540px]"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.5)_100%)]" />
              </div>

              {images.length > 1 ? (
                <div className="grid grid-cols-4 gap-3 p-4 sm:grid-cols-5">
                  {images.map((image) => {
                    const isActive = selectedImage === image.url;
                    return (
                      <button
                        key={image.url}
                        type="button"
                        onClick={() => setSelectedImage(image.url)}
                        className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                          isActive
                            ? 'border-[#D4AF37] shadow-[0_0_0_1px_rgba(212,175,55,0.3),0_0_20px_rgba(212,175,55,0.18)]'
                            : 'border-[#2A2A2A] opacity-65 hover:border-[#D4AF37]/50 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={image.description}
                          loading="lazy"
                          decoding="async"
                          className="h-20 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </motion.div>

            {/* Description + Specs */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="rounded-[28px] border border-[#2A2A2A] bg-[#0F0F0F]/80 p-6 backdrop-blur-md sm:p-8"
            >
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">About This Car</h3>
              <p className="text-[15px] leading-8 text-white/62">
                {document.description || 'Premium comfort, direct availability, and a frictionless booking experience.'}
              </p>

              {vehicleMeta.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {vehicleMeta.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#D4AF37]/22 bg-[#D4AF37]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#F5D97A]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-4 transition-colors duration-200 hover:border-[#2A2A2A]/80">
                  <div className="flex items-center gap-2.5 text-[#F5D97A]">
                    <CarFront size={15} />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">Type</span>
                  </div>
                  <p className="mt-2 text-sm text-white/75">{document.type || 'Premium line'}</p>
                </div>
                <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-4 transition-colors duration-200 hover:border-[#2A2A2A]/80">
                  <div className="flex items-center gap-2.5 text-[#F5D97A]">
                    <MapPin size={15} />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">Location</span>
                  </div>
                  <p className="mt-2 text-sm text-white/75">{document.location || 'Morocco'}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ─── RIGHT: Booking Form + Pricing ─── */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-8">

            {/* Booking Form Card */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="rounded-[28px] border border-[#2A2A2A] bg-[#0F0F0F]/90 p-6 shadow-[0_18px_42px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-7"
            >
              {/* Form header */}
              <div className="mb-6 flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                  <ShieldCheck size={16} className="text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Reserve Your Car</p>
                  <p className="mt-0.5 text-xs text-white/40">Confirmed via WhatsApp</p>
                </div>
              </div>

              <div className="grid gap-4">
                {/* Full Name */}
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Full Name</label>
                  <input
                    name="customerName"
                    value={formState.customerName}
                    onChange={handleInputChange}
                    placeholder="Ahmed El Fassi"
                    className="min-h-[54px] w-full rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-5 text-sm text-white outline-none placeholder:text-white/28 transition-all duration-200 focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.10)] hover:border-[#333]"
                  />
                </div>

                {/* Phone */}
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Phone Number</label>
                  <input
                    name="phone"
                    value={formState.phone}
                    onChange={handleInputChange}
                    placeholder="+212 6XX XXX XXX"
                    className="min-h-[54px] w-full rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-5 text-sm text-white outline-none placeholder:text-white/28 transition-all duration-200 focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.10)] hover:border-[#333]"
                  />
                </div>

                {/* Address */}
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Delivery Address</label>
                  <input
                    name="address"
                    value={formState.address}
                    onChange={handleInputChange}
                    placeholder="Casablanca, Morocco"
                    className="min-h-[54px] w-full rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-5 text-sm text-white outline-none placeholder:text-white/28 transition-all duration-200 focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.10)] hover:border-[#333]"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Pick-up</label>
                    <input
                      type="date"
                      name="pickupDate"
                      value={formState.pickupDate}
                      onChange={handleInputChange}
                      className="min-h-[54px] w-full rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 text-sm text-white outline-none [color-scheme:dark] placeholder:text-white/28 transition-all duration-200 focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.10)]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Return</label>
                    <input
                      type="date"
                      name="returnDate"
                      value={formState.returnDate}
                      onChange={handleInputChange}
                      min={formState.pickupDate || undefined}
                      className="min-h-[54px] w-full rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 text-sm text-white outline-none [color-scheme:dark] placeholder:text-white/28 transition-all duration-200 focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.10)]"
                    />
                  </div>
                </div>

                {/* Error */}
                {formError ? (
                  <p className="rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
                    {formError}
                  </p>
                ) : null}

                {/* WhatsApp CTA */}
                <motion.button
                  type="button"
                  disabled={!canSubmitBooking}
                  onClick={handleWhatsAppBooking}
                  whileHover={{ scale: canSubmitBooking ? 1.02 : 1, y: canSubmitBooking ? -2 : 0 }}
                  whileTap={{ scale: canSubmitBooking ? 0.975 : 1 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="group relative mt-1 inline-flex min-h-[58px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-[#25D366]/30 bg-[linear-gradient(135deg,#25D366_0%,#1ebe5d_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_24px_rgba(37,211,102,0.22)] transition-all duration-200 hover:shadow-[0_12px_32px_rgba(37,211,102,0.28)] disabled:cursor-not-allowed disabled:border-white/8 disabled:bg-[#1A1A1A] disabled:text-white/32 disabled:shadow-none"
                >
                  <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.16),transparent_60%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <MessageCircleMore size={18} className="relative z-10 shrink-0" />
                  <span className="relative z-10">Book via WhatsApp</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Pricing Summary Card */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="rounded-[28px] border border-[#D4AF37]/20 bg-[#0F0F0F]/90 p-6 shadow-[0_0_24px_rgba(212,175,55,0.04)] backdrop-blur-xl"
            >
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Pricing Summary</p>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Price per day</span>
                  <span className="text-sm font-semibold text-white">{formatPrice(document.price)} DH</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Number of days</span>
                  <span className="text-sm font-semibold text-white">
                    {bookingDays > 0 ? `${bookingDays} day${bookingDays !== 1 ? 's' : ''}` : '—'}
                  </span>
                </div>
                <div className="h-px bg-[#2A2A2A]" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Total</span>
                  <div className="min-w-[160px] text-right">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={bookingDays > 0 ? totalPrice : 'empty'}
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={reduceMotion ? undefined : { opacity: 0, scale: 1.015 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="inline-block text-2xl font-bold tracking-tight text-[#F5D97A]"
                      >
                        {bookingDays > 0 ? `${formatPrice(totalPrice)} DH` : 'Select dates'}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Direct Confirmation Info */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="rounded-[20px] border border-[#2A2A2A] bg-[#0F0F0F]/60 p-5 backdrop-blur-md"
            >
              <div className="flex items-center gap-2.5 text-[#F5D97A]">
                <CalendarDays size={15} />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Direct Confirmation</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/48">
                Submit your details, then continue to WhatsApp with a pre-filled booking request.
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm text-white/62">
                <Phone size={14} className="shrink-0 text-[#F5D97A]" />
                <span>+212 643 249 124</span>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;