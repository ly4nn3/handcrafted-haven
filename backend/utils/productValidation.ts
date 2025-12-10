import {
  CreateProductDTO,
  UpdateProductDTO,
} from "@backend/types/product.types";
import { ValidationError } from "./validation";

const VALID_CATEGORIES = [
  "Jewelry",
  "Home Decor",
  "Clothing",
  "Accessories",
  "Art",
  "Pottery",
  "Woodwork",
  "Textiles",
  "Other",
];

/**
 * Validate create product data
 */
export const validateCreateProduct = (data: any): CreateProductDTO => {
  if (
    !data.name ||
    typeof data.name !== "string" ||
    data.name.trim().length === 0
  ) {
    throw new ValidationError("Product name is required", "name");
  }

  if (data.name.length > 200) {
    throw new ValidationError(
      "Product name must be 200 characters or less",
      "name"
    );
  }

  if (
    !data.description ||
    typeof data.description !== "string" ||
    data.description.trim().length === 0
  ) {
    throw new ValidationError("Product description is required", "description");
  }

  if (data.description.length > 2000) {
    throw new ValidationError(
      "Description must be 2000 characters or less",
      "description"
    );
  }

  if (typeof data.price !== "number" || data.price < 0) {
    throw new ValidationError(
      "Valid price is required (must be 0 or greater)",
      "price"
    );
  }

  if (!data.category || !VALID_CATEGORIES.includes(data.category)) {
    throw new ValidationError(
      `Category must be one of: ${VALID_CATEGORIES.join(", ")}`,
      "category"
    );
  }

  if (
    typeof data.stock !== "number" ||
    data.stock < 0 ||
    !Number.isInteger(data.stock)
  ) {
    throw new ValidationError("Stock must be a non-negative integer", "stock");
  }

  if (!Array.isArray(data.images) || data.images.length === 0) {
    throw new ValidationError("At least one image is required", "images");
  }

  if (data.images.length > 10) {
    throw new ValidationError("Maximum 10 images allowed", "images");
  }

  // Validate image URLs
  for (const image of data.images) {
    if (typeof image !== "string" || image.trim().length === 0) {
      throw new ValidationError("All images must be valid URLs", "images");
    }
  }

  return {
    name: data.name.trim(),
    description: data.description.trim(),
    price: Number(data.price),
    category: data.category,
    stock: Number(data.stock),
    images: data.images.map((img: string) => img.trim()),
    tags: Array.isArray(data.tags)
      ? data.tags.filter(
          (tag: any) => typeof tag === "string" && tag.trim().length > 0
        )
      : [],
  };
};

/**
 * Validate update product data
 */
export const validateUpdateProduct = (data: any): UpdateProductDTO => {
  const updates: UpdateProductDTO = {};

  if (data.name !== undefined) {
    if (typeof data.name !== "string" || data.name.trim().length === 0) {
      throw new ValidationError(
        "Product name must be a non-empty string",
        "name"
      );
    }
    if (data.name.length > 200) {
      throw new ValidationError(
        "Product name must be 200 characters or less",
        "name"
      );
    }
    updates.name = data.name.trim();
  }

  if (data.description !== undefined) {
    if (
      typeof data.description !== "string" ||
      data.description.trim().length === 0
    ) {
      throw new ValidationError(
        "Description must be a non-empty string",
        "description"
      );
    }
    if (data.description.length > 2000) {
      throw new ValidationError(
        "Description must be 2000 characters or less",
        "description"
      );
    }
    updates.description = data.description.trim();
  }

  if (data.price !== undefined) {
    if (typeof data.price !== "number" || data.price < 0) {
      throw new ValidationError("Price must be 0 or greater", "price");
    }
    updates.price = Number(data.price);
  }

  if (data.category !== undefined) {
    if (!VALID_CATEGORIES.includes(data.category)) {
      throw new ValidationError(
        `Category must be one of: ${VALID_CATEGORIES.join(", ")}`,
        "category"
      );
    }
    updates.category = data.category;
  }

  if (data.stock !== undefined) {
    if (
      typeof data.stock !== "number" ||
      data.stock < 0 ||
      !Number.isInteger(data.stock)
    ) {
      throw new ValidationError(
        "Stock must be a non-negative integer",
        "stock"
      );
    }
    updates.stock = Number(data.stock);
  }

  if (data.images !== undefined) {
    if (!Array.isArray(data.images) || data.images.length === 0) {
      throw new ValidationError("At least one image is required", "images");
    }
    if (data.images.length > 10) {
      throw new ValidationError("Maximum 10 images allowed", "images");
    }
    updates.images = data.images.map((img: string) => img.trim());
  }

  if (data.tags !== undefined) {
    if (Array.isArray(data.tags)) {
      updates.tags = data.tags.filter(
        (tag: any) => typeof tag === "string" && tag.trim().length > 0
      );
    }
  }

  if (data.isActive !== undefined) {
    if (typeof data.isActive !== "boolean") {
      throw new ValidationError("isActive must be a boolean", "isActive");
    }
    updates.isActive = data.isActive;
  }

  return updates;
};

export { VALID_CATEGORIES };
export const PRODUCT_CATEGORIES = VALID_CATEGORIES;
