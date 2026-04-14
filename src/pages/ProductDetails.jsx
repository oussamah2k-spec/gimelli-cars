import React from "react";
import { useParams } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore"; // Custom hook to interact with Firestore
import { useAuth } from "../contexts/AuthContext";
import AppScreenLoader from "../components/AppScreenLoader";

const ProductDetails = () => {
  const { productId } = useParams();
  const { currentUser } = useAuth();
  const { document, error, loading } = useFirestore("products", productId);

  if (loading) {
    return <AppScreenLoader />;
  }

  if (error) {
    return <div>Error loading product details: {error.message}</div>;
  }

  if (!document) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="product-details">
      <h1>{document.name}</h1>
      <img src={document.imageUrl} alt={document.name} />
      <p>{document.description}</p>
      <p>Price: ${document.price}</p>
      <p>Available Stock: {document.stock}</p>
      {currentUser && (
        <button>Add to Cart</button>
      )}
    </div>
  );
};

export default ProductDetails;