import { memo, useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowRight, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/firebase';

const FALLBACK_CAR_IMAGE =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80';

const PRICE_RANGES = [
  { value: 'all', label: 'All prices' },
  { value: 'under-500', label: 'Under 500 DH' },
  { value: '500-1000', label: '500 - 1000 DH' },
  { value: '1000-2000', label: '1000 - 2000 DH' },
  { value: 'over-2000', label: 'Over 2000 DH' },
];

function formatPrice(price) {
  return new Intl.NumberFormat('fr-MA').format(Number(price || 0));
}

function normalizeBrand(data) {
  if (data.brand && String(data.brand).trim()) {
    return String(data.brand).trim();
  }

  if (data.name && String(data.name).trim()) {
    return String(data.name).trim().split(' ')[0];
  }

  return 'Signature';
}

function matchesPriceRange(price, range) {
  if (range === 'all') {
    return true;
  }

  if (range === 'under-500') {
    return price < 500;
  }

  if (range === '500-1000') {
    return price >= 500 && price <= 1000;
  }

  if (range === '1000-2000') {
    return price > 1000 && price <= 2000;
  }

  if (range === 'over-2000') {
    return price > 2000;
  }

  return true;
}

const FilterControl = memo(function FilterControl({ children, icon: Icon, label }) {
  return (
    <label className="group flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 backdrop-blur-xl transition-colors duration-300 hover:border-[#D4AF37]/25">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-black/20 text-[#D4AF37]">
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.26em] text-white/45">
          {label}
        </span>
        {children}
      </div>
    </label>
  );
});

const SkeletonCard = memo(function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/8 bg-[#1A1A1A] shadow-[0_18px_48px_rgba(0,0,0,0.24)]">
      <div className="relative h-64 overflow-hidden rounded-t-[28px] bg-white/[0.04]">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>
      <div className="space-y-4 p-6">
        <div className="h-5 w-24 rounded-full bg-white/[0.06]" />
        <div className="h-8 w-3/4 rounded-full bg-white/[0.08]" />
        <div className="h-4 w-1/2 rounded-full bg-white/[0.06]" />
        <div className="flex items-center justify-between pt-3">
          <div className="space-y-3">
            <div className="h-3 w-20 rounded-full bg-white/[0.05]" />
            <div className="h-6 w-28 rounded-full bg-white/[0.08]" />
          </div>
          <div className="h-12 w-32 rounded-full bg-white/[0.07]" />
        </div>
      </div>
    </div>
  );
});

const EmptyCarsState = memo(function EmptyCarsState() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-[28px] border border-white/8 bg-[#1A1A1A]/84 px-8 py-16 text-center shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/8 text-[#D4AF37] shadow-[0_0_24px_rgba(212,175,55,0.1)]">
        <Search size={28} />
      </div>
      <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">No cars found</h3>
      <p className="mt-3 max-w-md text-sm leading-7 text-white/60">
        Try adjusting your search or filters to explore more premium vehicles available for instant booking.
      </p>
    </div>
  );
});

const CarCard = memo(function CarCard({ car }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/8 bg-[#1A1A1A] shadow-[0_18px_48px_rgba(0,0,0,0.24)] transition-all duration-300 hover:scale-[1.05] hover:border-[#D4AF37]/30 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.14),0_24px_56px_rgba(212,175,55,0.14)]">
      <div className="relative overflow-hidden rounded-t-[28px]">
        <img
          src={car.imageUrl}
          alt={car.name}
          loading="lazy"
          decoding="async"
          className="h-64 w-full rounded-t-[28px] object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,11,0.05)_0%,rgba(11,11,11,0.15)_42%,rgba(11,11,11,0.88)_100%)]" />
        <div className="absolute left-5 top-5 inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-black/45 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#F5D97A] backdrop-blur-md">
          {car.brand}
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold tracking-tight text-white">{car.name}</h3>
          <div className="flex items-center gap-2 text-sm text-white/52">
            <MapPin size={15} className="text-white/40" />
            <span>{car.location || 'Morocco'}</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 pt-1">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/38">Starting from</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-[#D4AF37]">
              {formatPrice(car.price)} <span className="text-lg text-[#F5D97A]">DH</span>
            </p>
          </div>

          <Link
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[linear-gradient(135deg,#D4AF37,#F5D97A)] px-5 py-3 text-sm font-semibold text-[#0B0B0B] shadow-[0_12px_28px_rgba(212,175,55,0.18)] transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.18),0_18px_32px_rgba(212,175,55,0.26)]"
            to={`/product/${car.id}`}
          >
            <span>Book Now</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
});

function Products() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [brand, setBrand] = useState('all');

  useEffect(() => {
    async function fetchCars() {
      try {
        const snapshot = await getDocs(collection(db, 'cars'));
        const carsData = snapshot.docs.map((doc) => {
          const data = doc.data() || {};

          return {
            id: doc.id,
            name: data.name || 'Premium Vehicle',
            price: Number(data.price || 0),
            imageUrl: data.imageUrl || FALLBACK_CAR_IMAGE,
            description: data.description || 'No description available.',
            type: data.type || data.category || 'Car',
            brand: normalizeBrand(data),
            year: data.year || '',
            mileage: data.mileage || '',
            location: data.location || 'Morocco',
          };
        });

        setCars(carsData);
      } catch (loadError) {
        console.error('Products cars error:', loadError);
        setError(loadError);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

  const brandOptions = useMemo(() => {
    const uniqueBrands = [...new Set(cars.map((car) => car.brand).filter(Boolean))].sort((left, right) =>
      left.localeCompare(right)
    );

    return ['all', ...uniqueBrands];
  }, [cars]);

  const filteredCars = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return cars.filter((car) => {
      const matchesSearch =
        normalizedSearch.length === 0 || car.name.toLowerCase().includes(normalizedSearch);
      const matchesBrand = brand === 'all' || car.brand === brand;
      const matchesPrice = matchesPriceRange(car.price, priceRange);

      return matchesSearch && matchesBrand && matchesPrice;
    });
  }, [brand, cars, priceRange, searchTerm]);

  if (loading) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-[#0B0B0B] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_24%)]" />
        <div className="relative mx-auto max-w-7xl space-y-12">
          <div className="max-w-3xl space-y-5">
            <div className="h-4 w-36 rounded-full bg-white/[0.06]" />
            <div className="h-14 w-full max-w-2xl rounded-full bg-white/[0.08]" />
            <div className="h-5 w-full max-w-xl rounded-full bg-white/[0.06]" />
          </div>
          <div className="grid gap-4 rounded-[30px] border border-white/8 bg-white/[0.03] p-4 backdrop-blur-xl md:grid-cols-3">
            <div className="h-[76px] rounded-2xl bg-white/[0.05]" />
            <div className="h-[76px] rounded-2xl bg-white/[0.05]" />
            <div className="h-[76px] rounded-2xl bg-white/[0.05]" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>

        <style>{`
          .skeleton-shimmer {
            background: linear-gradient(
              90deg,
              rgba(255,255,255,0.04) 0%,
              rgba(255,255,255,0.1) 22%,
              rgba(255,255,255,0.04) 44%,
              rgba(255,255,255,0.04) 100%
            );
            background-size: 220% 100%;
            animation: carsPageShimmer 1.8s linear infinite;
          }

          @keyframes carsPageShimmer {
            0% {
              background-position: 200% 0;
            }

            100% {
              background-position: -20% 0;
            }
          }
        `}</style>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#0B0B0B] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[30px] border border-red-500/15 bg-[#1A1A1A] p-8 text-white shadow-[0_18px_48px_rgba(0,0,0,0.24)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#F5D97A]">Cars</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Unable to load cars</h1>
          <p className="mt-3 text-white/65">There was a problem loading premium inventory from Firestore.</p>
          <pre className="mt-6 overflow-x-auto rounded-2xl border border-white/8 bg-black/30 p-4 text-sm text-white/72">
            {error.message}
          </pre>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#0B0B0B] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_32%),radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.04),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:120px_120px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 lg:gap-16">
        <header className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#F5D97A] backdrop-blur-md">
            Premium Fleet
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="bg-[linear-gradient(135deg,#D4AF37_0%,#F5D97A_35%,#FFFFFF_100%)] bg-clip-text text-transparent">
              Explore Luxury Cars
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
            Browse premium vehicles available for instant booking.
          </p>
        </header>

        <section className="rounded-[30px] border border-white/8 bg-white/[0.03] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
            <FilterControl icon={Search} label="Search">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by car name"
                className="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/34"
              />
            </FilterControl>

            <FilterControl icon={SlidersHorizontal} label="Price range">
              <select
                value={priceRange}
                onChange={(event) => setPriceRange(event.target.value)}
                className="mt-1 w-full appearance-none bg-transparent text-sm text-white outline-none"
              >
                {PRICE_RANGES.map((range) => (
                  <option key={range.value} value={range.value} className="bg-[#111111] text-white">
                    {range.label}
                  </option>
                ))}
              </select>
            </FilterControl>

            <FilterControl icon={SlidersHorizontal} label="Brand">
              <select
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className="mt-1 w-full appearance-none bg-transparent text-sm text-white outline-none"
              >
                {brandOptions.map((option) => (
                  <option key={option} value={option} className="bg-[#111111] text-white">
                    {option === 'all' ? 'All brands' : option}
                  </option>
                ))}
              </select>
            </FilterControl>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-white/8 pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">Available now</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} ready to book
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/52">
              Refined inventory browsing with a darker luxury interface, streamlined filtering, and instant access to premium listings.
            </p>
          </div>

          {filteredCars.length === 0 ? (
            <EmptyCarsState />
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default memo(Products);