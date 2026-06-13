import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import LazyImage from "./LazyImage";

const ProductCard = memo(({ product, variant = "catalog", priority = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (variant === "collection") {
      navigate(`/categories/${product.slug}`);
      return;
    }
    navigate(`/catalog-details/${product.slug}`);
  };

  return (
    <article className="product-card" onClick={handleClick}>
      <div className="product-card__media">
        <LazyImage
          src={product.image}
          alt={product.title || "Naqshzari piece"}
          eager={priority}
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>
      <h3 className="product-card__title">{product.title}</h3>
    </article>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
