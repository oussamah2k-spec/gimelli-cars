import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';

function formatPrice(price) {
  return new Intl.NumberFormat('fr-MA').format(Number(price || 0));
}

function ProductCard({ product, onBookNowClick }) {
  const vehicleType = useMemo(
    () => (product.type && product.type !== 'All' ? product.type : 'Performance Line'),
    [product.type]
  );
  const vehicleMeta = useMemo(
    () => [product.year, product.mileage, product.location].filter(Boolean).join(' • '),
    [product.location, product.mileage, product.year]
  );

  return (
    <article className="card car-card fade-in-section">
      <div className="car-card__media">
        <img src={product.imageUrl} alt={product.name} loading="lazy" decoding="async" />
        <span className="car-card__badge">{vehicleType}</span>
      </div>
      <div className="card-body">
        <div className="car-card__meta">
          <p className="car-card__eyebrow">Luxury Drive</p>
          <h3>{product.name}</h3>
          <p className="car-card__subtitle">
            {vehicleMeta || 'Precision, comfort, and performance in one machine'}
          </p>
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