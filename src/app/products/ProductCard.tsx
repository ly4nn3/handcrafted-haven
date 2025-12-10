"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductResponse } from "@backend/types/product.types";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: ProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div className={styles.productCard} onClick={handleClick}>
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
        {product.stock === 0 && (
          <span className={styles.outOfStock}>Out of Stock</span>
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
      </div>
    </div>
  );
}
