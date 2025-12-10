"use client";

import { useState, FormEvent } from "react";
import {
  CreateProductDTO,
  UpdateProductDTO,
} from "@backend/types/product.types";
import { VALID_CATEGORIES } from "@backend/utils/productValidation";
import FormField from "@/components/ui/FormField";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./ProductForm.module.css";

interface ProductFormProps {
  initialData?: Partial<CreateProductDTO> & { isActive?: boolean };
  onSubmit: (data: CreateProductDTO) => Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit,
  submitLabel = "Save Product",
  isLoading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    category: initialData?.category || "",
    stock: initialData?.stock?.toString() || "",
    images: initialData?.images || [""],
    tags: initialData?.tags?.join(", ") || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    if (formData.images.length < 10) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
    }
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    const stock = parseInt(formData.stock);
    if (isNaN(stock) || stock < 0) {
      newErrors.stock = "Valid stock quantity is required";
    }

    const validImages = formData.images.filter((img) => img.trim() !== "");
    if (validImages.length === 0) {
      newErrors.images = "At least one image URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const validImages = formData.images.filter((img) => img.trim() !== "");
    const tags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const productData: CreateProductDTO = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      images: validImages,
      tags,
    };

    await onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.productForm} noValidate>
      <FormField
        label="Product Name"
        value={formData.name}
        onChange={(val) => updateField("name", val)}
        error={errors.name}
        placeholder="Handcrafted Wooden Bowl"
        required
        disabled={isLoading}
      />

      <div className={styles.formField}>
        <label className={styles.label}>
          Description <span className={styles.required}>*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Describe your product in detail..."
          className={`${styles.textarea} ${
            errors.description ? styles.error : ""
          }`}
          rows={6}
          required
          disabled={isLoading}
        />
        {errors.description && (
          <span className={styles.errorText}>{errors.description}</span>
        )}
      </div>

      <div className={styles.row}>
        <FormField
          label="Price ($)"
          type="number"
          value={formData.price}
          onChange={(val) => updateField("price", val)}
          error={errors.price}
          placeholder="29.99"
          required
          disabled={isLoading}
        />

        <FormField
          label="Stock Quantity"
          type="number"
          value={formData.stock}
          onChange={(val) => updateField("stock", val)}
          error={errors.stock}
          placeholder="10"
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.formField}>
        <label className={styles.label}>
          Category <span className={styles.required}>*</span>
        </label>
        <select
          value={formData.category}
          onChange={(e) => updateField("category", e.target.value)}
          className={`${styles.select} ${errors.category ? styles.error : ""}`}
          required
          disabled={isLoading}
        >
          <option value="">Select a category</option>
          {VALID_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className={styles.errorText}>{errors.category}</span>
        )}
      </div>

      <div className={styles.formField}>
        <label className={styles.label}>
          Product Images <span className={styles.required}>*</span>
        </label>
        <div className={styles.imagesContainer}>
          {formData.images.map((image, index) => (
            <div key={index} className={styles.imageField}>
              <input
                type="url"
                value={image}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={styles.imageInput}
                disabled={isLoading}
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className={styles.removeButton}
                  disabled={isLoading}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        {formData.images.length < 10 && (
          <button
            type="button"
            onClick={addImageField}
            className={styles.addButton}
            disabled={isLoading}
          >
            + Add Another Image
          </button>
        )}
        {errors.images && (
          <span className={styles.errorText}>{errors.images}</span>
        )}
        <p className={styles.helpText}>Add 1-10 image URLs for your product</p>
      </div>

      <FormField
        label="Tags (Optional)"
        value={formData.tags}
        onChange={(val) => updateField("tags", val)}
        placeholder="handmade, wooden, eco-friendly"
        disabled={isLoading}
      />
      <p className={styles.helpText}>Separate tags with commas</p>

      <div className={styles.actions}>
        <LoadingButton type="submit" loading={isLoading} disabled={isLoading}>
          {submitLabel}
        </LoadingButton>
      </div>
    </form>
  );
}
