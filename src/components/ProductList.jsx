import ProductCard from './ProductCard';

function ProductList({ products }) {
  return (
    <div className="cars-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;