import { useEffect, useState } from 'react';
import { getProducts } from '../firebase/firebase';
import ProductList from '../components/ProductList';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('ProductsPage: starting fetch');

    async function loadProducts() {
      try {
        const items = await getProducts();
        setProducts(items);
      } catch (loadError) {
        console.error('ProductsPage error:', loadError);
        setError(loadError.message || 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <section className="page section">
      <div className="container section__header section__header--stacked">
        <p className="section__eyebrow">All inventory</p>
        <h1>Browse all available cars</h1>
        <p className="section__copy">
          Live data from Firestore with loading state, responsive cards, and a safe empty fallback.
        </p>
      </div>

      <div className="container">
        {loading ? <LoadingState /> : null}
        {!loading && error ? <EmptyState title="Unable to load cars" description={error} /> : null}
        {!loading && !error && products.length === 0 ? <EmptyState /> : null}
        {!loading && !error && products.length > 0 ? <ProductList products={products} /> : null}
      </div>
    </section>
  );
}

export default ProductsPage;