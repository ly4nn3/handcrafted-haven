"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductService } from "@/lib/api/productService";
import { CreateProductDTO } from "@backend/types/product.types";
import ProductForm from "@/components/forms/ProductForm";
import styles from "./NewProduct.module.css";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateProductDTO) => {
    setLoading(true);
    setError(null);

    try {
      const result = await ProductService.createProduct(data);

      if (result.success) {
        router.push("/dashboard/seller?tab=Products");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.newProductPage}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          ← Back
        </button>
        <h1 className={styles.title}>Create New Product</h1>
      </div>

      {error && (
        <div className={styles.errorBanner} role="alert">
          {error}
        </div>
      )}

      <div className={styles.formContainer}>
        <ProductForm
          onSubmit={handleSubmit}
          submitLabel="Create Product"
          isLoading={loading}
        />
      </div>
    </div>
  );
}
