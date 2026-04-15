import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getFeaturedProducts } from '../firebase/firebase';
import ProductList from '../components/ProductList';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('HomePage: loading featured products');

    async function loadFeaturedProducts() {
      try {
        const featuredProducts = await getFeaturedProducts(3);
        setProducts(featuredProducts);
      } catch (loadError) {
        console.error('HomePage featured products error:', loadError);
        setError(loadError.message || 'Failed to load featured products.');
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedProducts();
  }, []);

  return (
    <div className="page page--home">
      <section className="hero">
        <div className="container hero__layout">
          <div className="hero__content">
            <p className="hero__kicker">Trusted premium inventory</p>
            <h1>Find your next car with showroom-grade confidence.</h1>
            <p className="hero__copy">
              Explore curated listings, detailed specifications, and a responsive buying experience built for modern dealerships.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" to="/products">
                Browse Cars
              </Link>
              <Link className="button button--secondary" to="/admin">
                Add Inventory
              </Link>
            </div>
          </div>

          <div className="hero__panel">
            <div className="hero__stat">
              <strong>48h</strong>
              <span>Average listing refresh cycle</span>
            </div>
            <div className="hero__stat">
              <strong>100%</strong>
              <span>Responsive car browsing experience</span>
            </div>
            <div className="hero__stat">
              <strong>Firestore</strong>
              <span>Live inventory directly from Firebase</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container section__header">
          <div>
            <p className="section__eyebrow">Latest cars</p>
            <h2>Recently added inventory</h2>
          </div>
          <Link className="text-link" to="/products">
            View all cars
          </Link>
        </div>

        <div className="container">
          {loading ? <LoadingState label="Loading featured cars..." /> : null}
          {!loading && error ? <EmptyState title="Unable to load featured cars" description={error} /> : null}
          {!loading && !error && products.length === 0 ? <EmptyState /> : null}
          {!loading && !error && products.length > 0 ? <ProductList products={products} /> : null}
        </div>
      </section>
    </div>
  );
}

export default HomePage;