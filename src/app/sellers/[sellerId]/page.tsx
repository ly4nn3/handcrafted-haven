"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { SellerService } from "@/lib/api/sellerService";
import { ProductService } from "@/lib/api/productService";
import { SellerProfile } from "@/types/frontend.types";
import { ProductResponse } from "@backend/types/product.types";
import ProductCard from "@/components/products/ProductCard";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./SellerPage.module.css";

export default function SellerPage() {
  const params = useParams();
  const sellerId = params.sellerId as string;

  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSeller();
    fetchProducts();
  }, [sellerId]);

  const fetchSeller = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await SellerService.getSellerById(sellerId);

      if (result.success) {
        setSeller(result.data as SellerProfile);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load seller profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);

    try {
      const result = await ProductService.getProducts({
        sellerId: sellerId,
      });

      if (result.success) {
        setProducts(result.data.products);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading seller profile...</p>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className={styles.errorContainer}>
        <h2>Seller Not Found</h2>
        <p>{error || "The seller you're looking for doesn't exist."}</p>
        <LoadingButton onClick={() => window.history.back()}>
          Go Back
        </LoadingButton>
      </div>
    );
  }

  return (
    <div className={styles.sellerPageContainer}>
      {/* Banner */}
      {seller.bannerImage && (
        <div className={styles.bannerContainer}>
          <Image
            src={seller.bannerImage}
            alt={`${seller.shopName} banner`}
            width={1200}
            height={300}
            className={styles.banner}
            priority
          />
        </div>
      )}

      {/* Shop Header */}
      <div className={styles.shopHeader}>
        <div className={styles.shopAvatar}>
          {seller.shopName[0].toUpperCase()}
        </div>
        <div className={styles.shopInfo}>
          <h1 className={styles.shopName}>{seller.shopName}</h1>
          <p className={styles.sellerName}>
            by {seller.user?.firstname} {seller.user?.lastname}
          </p>
        </div>
      </div>

      {/* Description */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>About This Shop</h2>
        <p className={styles.description}>
          {seller.description || "No description available."}
        </p>
      </section>

      {/* Products */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Products ({products.length})</h2>
        {productsLoading ? (
          <div className={styles.loadingProducts}>
            <div className={styles.spinner} />
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <p className={styles.emptyState}>
            This seller hasn't listed any products yet.
          </p>
        ) : (
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
