import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, MapPin } from 'lucide-react';

const BADGE_TYPES = ['Luxury', 'Popular', 'Best Price'];
const BADGE_CLASS = {
  Luxury: 'car-card__badge car-card__badge--luxury',
  Popular: 'car-card__badge car-card__badge--popular',
  'Best Price': 'car-card__badge car-card__badge--bestprice',
};
const RATINGS = [4.7, 4.8, 4.9, 5.0];
const CLIENTS = ['80+', '120+', '150+', '200+'];

function hashStr(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function formatPrice(price) {
  return new Intl.NumberFormat('fr-MA').format(Number(price || 0));
}

function ProductCard({ product, onBookNowClick }) {
  const vehicleType = useMemo(
    () => (product.type && product.type !== 'All' ? product.type : 'Performance Line'),
    [product.type]
  );
  const vehicleMeta = useMemo(
    () => [product.year, product.mileage].filter(Boolean).join(' • '),
    [product.mileage, product.year]
  );

  const h = useMemo(() => hashStr(product.id || product.name || ''), [product.id, product.name]);
  const badge = product.badge || BADGE_TYPES[h % BADGE_TYPES.length];
  const rating = RATINGS[h % RATINGS.length];
  const clients = CLIENTS[(h >> 2) % CLIENTS.length];

  return (
    <article className="card car-card fade-in-section">
      <div className="car-card__media">
        <img src={product.imageUrl} alt={product.name} loading="lazy" decoding="async" />
        <span className={BADGE_CLASS[badge] ?? 'car-card__badge'}>{badge}</span>
      </div>
      <div className="card-body">
        <div className="car-card__meta">
          <p className="car-card__eyebrow">{vehicleType}</p>
          <h3>{product.name}</h3>
          {vehicleMeta && (
            <p className="car-card__subtitle">{vehicleMeta}</p>
          )}
        </div>

        {/* Stats row */}
        <div className="car-card__stats">
          <span className="car-card__stat">
            <Star size={13} fill="currentColor" className="car-card__stat-icon car-card__stat-icon--star" />
            {rating}
          </span>
          <span className="car-card__stat">
            <Users size={13} className="car-card__stat-icon" />
            {clients} clients
          </span>
          <span className="car-card__stat">
            <MapPin size={13} className="car-card__stat-icon" />
            Morocco
          </span>
        </div>

        <div className="car-card__footer">
          <div>
            <span className="car-card__price-label">Price Per Day</span>
            <p>{formatPrice(product.price)} DH</p>
          </div>
          {onBookNowClick ? (
            <button
              type="button"
              onClick={() => onBookNowClick(product)}
              className="card-link card-link--accent transition-all duration-300 ease-in-out"
            >
              Book Now
            </button>
          ) : (
            <Link
              className="card-link card-link--accent transition-all duration-300 ease-in-out"
              to={`/product/${product.id}`}
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);