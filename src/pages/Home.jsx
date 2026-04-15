import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import CarBrandsSlider from '../components/CarBrandsSlider';
import Features from '../components/Features';
import ProductCard from '../components/ProductCard';
import AppScreenLoader from '../components/AppScreenLoader';
import PremiumHero from '../components/PremiumHero';
import { db } from '../firebase/firebase';

function Home() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBookNow = useCallback(() => {
    navigate('/cars');
  }, [navigate]);

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
            imageUrl: data.imageUrl || '',
            description: data.description || 'No description available.',
            type: data.type || data.category || 'Car',
            year: data.year || '',
            mileage: data.mileage || '',
            location: data.location || '',
          };
        });
        setCars(carsData);
      } catch (loadError) {
        console.error('Home cars error:', loadError);
        setError(loadError);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

  return (
    <div className="page-shell home-page-shell">
      <PremiumHero carsCount={cars.length} />

      <section className="list-section fade-in-section home-page-section">
        <div className="container section-header">
          <div>
            <span className="eyebrow">Latest arrivals</span>
            <h2>Recently Added Vehicles</h2>
          </div>
          <Link className="section-link" to="/cars">
            Explore full garage
          </Link>
        </div>

        <div className="container">
          {loading ? <AppScreenLoader /> : null}
          {!loading && error ? <p className="status-message">Failed to load cars.</p> : null}
          {!loading && !error && cars.length === 0 ? <p className="status-message">No cars available</p> : null}
          {!loading && !error && cars.length > 0 ? (
            <div className="products-grid">
              {cars.map((car) => (
                <ProductCard key={car.id} product={car} onBookNowClick={handleBookNow} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <Features />
      <CarBrandsSlider />
    </div>
  );
}

export default Home;