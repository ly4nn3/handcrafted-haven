import Link from "next/link";
import Image from "next/image";
import { ProductResponse } from "@backend/types/product.types";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: ProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Safe fallbacks
  const sellerId = product.seller?.id || product.sellerId;
  const shopName = product.seller?.shopName || "Unknown Shop";
  const hasUserInfo =
    product.seller?.user?.firstname && product.seller?.user?.lastname;
  const isOutOfStock = product.stock === 0;

  return (
    <div className={styles.productCard}>
      {/* Product Image - Clickable */}
      <Link href={`/products/${product.id}`} className={styles.imageContainer}>
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={styles.image}
          />
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && <div className={styles.outOfStock}>Out of Stock</div>}
      </Link>

      {/* Product Content */}
      <div className={styles.content}>
        {/* Product Name - Clickable */}
        <Link href={`/products/${product.id}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>

        {/* Category */}
        <p className={styles.category}>{product.category}</p>

        {/* Footer Section */}
        <div className={styles.footer}>
          {/* Price */}
          <div className={styles.priceSection}>
            <p className={styles.price}>${product.price.toFixed(2)}</p>
          </div>

          {/* Rating */}
          {product.totalReviews > 0 && (
            <div className={styles.rating}>
              <span className={styles.stars}>
                {"★".repeat(Math.round(product.averageRating))}
                {"☆".repeat(5 - Math.round(product.averageRating))}
              </span>
              <span className={styles.reviewCount}>
                ({product.totalReviews})
              </span>
            </div>
          )}

          {/* Seller Info - Clickable */}
          <p className={styles.seller}>
            by <Link href={`/shop/${sellerId}`}>{shopName}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
