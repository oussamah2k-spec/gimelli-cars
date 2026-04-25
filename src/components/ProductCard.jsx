import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

function formatPrice(price) {
  const amount = Number(price);
  return Number.isFinite(amount) ? amount : 0;
}

function ProductCard({ product, onBookNowClick }) {
  const location = useMemo(() => product?.location || 'Morocco', [product?.location]);
  const rating = useMemo(() => {
    const parsed = Number(product?.rating);
    if (Number.isFinite(parsed) && parsed > 0) return parsed.toFixed(1);
    return '5.0';
  }, [product?.rating]);

  if (!product) return null;

  return (
    <article className="card car-card fade-in-section">
      <div className="car-card__media">
        <img
          src={product.imageUrl}
          alt={product.name || 'Luxury rental car'}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="card-body">
        <div className="car-card__details">
          <h3>{product.name || 'Premium Car'}</h3>
          <p className="car-card__location">
            <MapPin size={14} className="car-card__location-icon" aria-hidden="true" />
            {location}
          </p>
          <div className="car-card__rating" aria-label={`Rating ${rating} out of 5`}>
            <span className="car-card__stars" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={14} fill="currentColor" className="car-card__star" />
              ))}
            </span>
            <span className="car-card__rating-value">({rating})</span>
          </div>
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