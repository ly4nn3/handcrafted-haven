"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SellerService } from "@/lib/api/sellerService";
import { ProductService } from "@/lib/api/productService";
import { SellerProfile } from "@/types/frontend.types";
import { ProductResponse } from "@backend/types/product.types";
import ProductCard from "@/components/products/ProductCard";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./ShopPage.module.css";

export default function ShopPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = params.shopId as string;

  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShop();
    fetchProducts();
  }, [shopId]);

  const fetchShop = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await SellerService.getSellerById(shopId);

      if (result.success) {
        setSeller(result.data as SellerProfile);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load shop");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);

    try {
      const result = await ProductService.getProducts({
        sellerId: shopId,
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
        <p>Loading shop...</p>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className={styles.errorContainer}>
        <h2>Shop Not Found</h2>
        <p>{error || "The shop you're looking for doesn't exist."}</p>
        <LoadingButton onClick={() => router.push("/shop")}>
          Browse All Products
        </LoadingButton>
      </div>
    );
  }

  return (
    <div className={styles.shopPageContainer}>
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

          {/* Link to seller profile */}
          <Link href={`/seller/${shopId}`} className={styles.sellerLink}>
            <p className={styles.sellerName}>
              by {seller.user?.firstname} {seller.user?.lastname}
            </p>
          </Link>
        </div>

        <div className={styles.shopActions}>
          <LoadingButton variant="outline" onClick={() => router.push("/shop")}>
            Browse All Shops
          </LoadingButton>
        </div>
      </div>

      {/* Shop Stats */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{products.length}</span>
          <span className={styles.statLabel}>Products</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {seller.createdAt
              ? new Date(seller.createdAt).getFullYear()
              : "N/A"}
          </span>
          <span className={styles.statLabel}>Since</span>
        </div>
      </div>

      {/* Description */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>About This Shop</h2>
        <p className={styles.description}>
          {seller.description ||
            "Welcome to our shop! We create handcrafted products with care."}
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
          <div className={styles.emptyState}>
            <p>This shop hasn't listed any products yet.</p>
            <LoadingButton onClick={() => router.push("/shop")}>
              Browse Other Shops
            </LoadingButton>
          </div>
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
