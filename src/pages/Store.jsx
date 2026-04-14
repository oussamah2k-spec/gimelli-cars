import React from "react";
import { useEffect, useState } from "react";
import { fetchProducts } from "../firebase/products";
import ProductCard from "../components/ProductCard";
import AppScreenLoader from "../components/AppScreenLoader";

function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <AppScreenLoader />;
  }

  return (
    <div className="store-container">
      <h1>Store</h1>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
}

export default Store;