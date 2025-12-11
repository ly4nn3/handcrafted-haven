"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductService } from "@/lib/api/productService";
import { ProductResponse } from "@backend/types/product.types";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./ProductsTab.module.css";

export default function ProductsTab() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [showInactive]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await ProductService.getMyProducts(showInactive);

      if (result.success) {
        setProducts(result.data as ProductResponse[]);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeletingId(productId);

    try {
      const result = await ProductService.deleteProduct(productId);

      if (result.success) {
        setProducts(products.filter((p) => p.id !== productId));
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (product: ProductResponse) => {
    try {
      const result = await ProductService.updateProduct(product.id, {
        isActive: !product.isActive,
      });

      if (result.success) {
        setProducts(
          products.map((p) =>
            p.id === product.id ? { ...p, isActive: !p.isActive } : p
          )
        );
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.error}>{error}</p>
        <LoadingButton onClick={fetchProducts}>Retry</LoadingButton>
      </div>
    );
  }

  return (
    <div className={styles.productsTab}>
      <div className={styles.header}>
        <h2 className={styles.title}>My Products</h2>
        <div className={styles.headerActions}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
            <span>Show inactive</span>
          </label>
          <LoadingButton
            onClick={() => router.push("/dashboard/seller/products/new")}
          >
            + Add Product
          </LoadingButton>
        </div>
      </div>

      {products.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't added any products yet.</p>
          <LoadingButton
            onClick={() => router.push("/dashboard/seller/products/new")}
          >
            Create Your First Product
          </LoadingButton>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImage}>
                {product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div className={styles.noImage}>No Image</div>
                )}
                {!product.isActive && (
                  <span className={styles.inactiveBadge}>Inactive</span>
                )}
              </div>

              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productCategory}>{product.category}</p>
                <p className={styles.productPrice}>
                  ${product.price.toFixed(2)}
                </p>
                <p className={styles.productStock}>Stock: {product.stock}</p>
              </div>

              <div className={styles.productActions}>
                <button
                  onClick={() =>
                    router.push(`/dashboard/seller/products/${product.id}/edit`)
                  }
                  className={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(product)}
                  className={styles.toggleButton}
                >
                  {product.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className={styles.deleteButton}
                  disabled={deletingId === product.id}
                >
                  {deletingId === product.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
