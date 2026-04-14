import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <article className="product-card">
      {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : null}
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <Link to={`/product/${product.id}`}>View details</Link>
    </article>
  );
}

export default ProductCard;