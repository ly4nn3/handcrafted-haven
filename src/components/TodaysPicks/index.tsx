"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductService } from "@/lib/api/productService";
import { ProductResponse } from "@backend/types/product.types";
import styles from "@/components/TodaysPicks/TodaysPicks.module.css";

export default function TodaysPicks() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch latest 6 products sorted by creation date
        const result = await ProductService.getProducts({
          sortBy: "createdAt",
          order: "desc",
          page: 1,
          limit: 6,
        });

        if (result.success) {
          setProducts(result.data.products);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  if (loading) {
    return (
      <section className={styles.todaysPicks}>
        <h2>Today's Picks</h2>
        <div className={styles.loading}>
          <p>Loading products...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.todaysPicks}>
        <h2>Today's Picks</h2>
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className={styles.todaysPicks}>
        <h2>Today's Picks</h2>
        <div className={styles.empty}>
          <p>No products available yet. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.todaysPicks}>
      <div className={styles.header}>
        <h2>Today's Picks</h2>
        <button
          className={styles.viewAllButton}
          onClick={() => router.push("/shop")}
        >
          View All →
        </button>
      </div>
      <div className={styles.grid}>
        {products.map((product) => (
          <div
            key={product.id}
            className={styles.productCard}
            onClick={() => handleProductClick(product.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleProductClick(product.id);
              }
            }}
          >
            <div className={styles.imageContainer}>
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className={styles.noImage}>No Image</div>
              )}
              {!product.isActive && (
                <div className={styles.inactiveBadge}>Unavailable</div>
              )}
              {product.stock === 0 && product.isActive && (
                <div className={styles.outOfStockBadge}>Out of Stock</div>
              )}
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
              {product.averageRating > 0 && (
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
              {product.seller && (
                <p className={styles.sellerName}>
                  by {product.seller.shopName}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
