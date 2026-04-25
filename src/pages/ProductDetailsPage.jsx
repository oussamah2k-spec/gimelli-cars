import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductById } from '../firebase/firebase';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

function formatPrice(price) {
  const amount = Number(price);
  return Number.isFinite(amount) ? amount : 0;
}

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('ProductDetailsPage: loading', id);

    async function loadProduct() {
      try {
        const item = await getProductById(id);

        if (!item) {
          setError('Car not found.');
          return;
        }

        setProduct(item);
      } catch (loadError) {
        console.error('ProductDetailsPage error:', loadError);
        setError(loadError.message || 'Failed to load car details.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return <LoadingState label="Loading car details..." />;
  }

  if (error) {
    return <EmptyState title="Unable to show this car" description={error} />;
  }

  return (
    <section className="page section">
      <div className="container product-details">
        <div className="product-details__media">
          <img loading="lazy" src={product.imageUrl} alt={product.name} />
        </div>

        <div className="product-details__content">
          <p className="section__eyebrow">Car details</p>
          <h1>{product.name}</h1>
          <p className="product-details__price">{formatPrice(product.price)} DH</p>
          <p className="product-details__description">{product.description}</p>

          <div className="product-details__actions">
            <Link className="button button--primary" to="/products">
              Back to inventory
            </Link>
            <a className="button button--secondary" href="mailto:sales@gimellimotors.com">
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailsPage;