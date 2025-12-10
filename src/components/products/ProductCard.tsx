"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductResponse } from "@backend/types/product.types";
import { useCart } from "@/app/context/CartContext";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: ProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, isInCart } = useCart();

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    addToCart(product, 1);
  };

  const productInCart = isInCart(product.id);
  const isOutOfStock = product.stock === 0;

  return (
    <div className={styles.productCard} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}
        {isOutOfStock && (
          <span className={styles.outOfStock}>Out of Stock</span>
        )}
        {productInCart && !isOutOfStock && (
          <span className={styles.inCartBadge}>In Cart</span>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>

        <p className={styles.category}>{product.category}</p>

        <div className={styles.footer}>
          <div className={styles.priceSection}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
          </div>

          <div className={styles.rating}>
            <span className={styles.stars}>
              {"★".repeat(Math.round(product.averageRating))}
              {"☆".repeat(5 - Math.round(product.averageRating))}
            </span>
            <span className={styles.reviewCount}>({product.totalReviews})</span>
          </div>
        </div>

        {product.seller && (
          <p className={styles.seller}>by {product.seller.shopName}</p>
        )}

        {/* Quick Add to Cart Button */}
        {!isOutOfStock && (
          <button
            onClick={handleAddToCart}
            className={styles.quickAddButton}
            aria-label="Add to cart"
          >
            {productInCart ? "Add More" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}
