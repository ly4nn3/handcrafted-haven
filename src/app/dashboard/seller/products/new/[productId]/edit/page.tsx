"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProductService } from "@/lib/api/productService";
import {
  CreateProductDTO,
  ProductResponse,
} from "@backend/types/product.types";
import ProductForm from "@/components/forms/ProductForm";
import styles from "./EditProduct.module.css";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await ProductService.getProductById(productId);

      if (result.success) {
        setProduct(result.data as ProductResponse);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CreateProductDTO) => {
    setSubmitting(true);
    setError(null);

    try {
      const result = await ProductService.updateProduct(productId, data);

      if (result.success) {
        router.push("/dashboard/seller?tab=Products");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to update product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading product...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p className={styles.error}>{error}</p>
        <button onClick={() => router.back()} className={styles.backButton}>
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Product Not Found</h2>
        <button onClick={() => router.back()} className={styles.backButton}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.editProductPage}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          ← Back
        </button>
        <h1 className={styles.title}>Edit Product</h1>
      </div>

      {error && (
        <div className={styles.errorBanner} role="alert">
          {error}
        </div>
      )}

      <div className={styles.formContainer}>
        <ProductForm
          initialData={{
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            images: product.images,
            tags: product.tags,
          }}
          onSubmit={handleSubmit}
          submitLabel="Update Product"
          isLoading={submitting}
        />
      </div>
    </div>
  );
}
