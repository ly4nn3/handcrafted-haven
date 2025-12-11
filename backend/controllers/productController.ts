import Product, { IProduct } from "@backend/models/Product";
import Seller from "@backend/models/Seller";
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilter,
  ProductSort,
} from "@backend/types/product.types";

/**
 * Create a new product (seller only)
 */
export const createProduct = async (
  userId: string,
  productData: CreateProductDTO
): Promise<IProduct> => {
  // Verify user is a seller and get seller ID
  const seller = await Seller.findOne({ userId });
  if (!seller) {
    throw new Error("Seller profile not found");
  }

  const product = new Product({
    ...productData,
    sellerId: seller._id,
  });

  await product.save();

  // Add product to seller's product list
  seller.products.push(product._id);
  await seller.save();

  return product;
};

/**
 * Get all products with filtering, sorting, and pagination
 */
export const getProducts = async (
  filter: ProductFilter = {},
  sort: ProductSort = { field: "createdAt", order: "desc" },
  page: number = 1,
  limit: number = 20
) => {
  const query: any = {};

  // Build filter query
  if (filter.category) {
    query.category = filter.category;
  }

  if (filter.sellerId) {
    query.sellerId = filter.sellerId;
  }

  if (filter.isActive !== undefined) {
    query.isActive = filter.isActive;
  }

  if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
    query.price = {};
    if (filter.minPrice !== undefined) {
      query.price.$gte = filter.minPrice;
    }
    if (filter.maxPrice !== undefined) {
      query.price.$lte = filter.maxPrice;
    }
  }

  if (filter.search) {
    query.$text = { $search: filter.search };
  }

  if (filter.tags && filter.tags.length > 0) {
    query.tags = { $in: filter.tags };
  }

  // Build sort
  const sortQuery: any = {};
  sortQuery[sort.field] = sort.order === "asc" ? 1 : -1;

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "sellerId",
        select: "shopName userId",
        populate: {
          path: "userId",
          select: "firstname lastname email",
        },
      }),
    Product.countDocuments(query),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get single product by ID
 */
export const getProductById = async (productId: string): Promise<IProduct> => {
  const product = await Product.findById(productId).populate({
    path: "sellerId",
    select: "shopName userId",
    populate: {
      path: "userId",
      select: "firstname lastname email",
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

/**
 * Get products by seller
 */
export const getProductsBySeller = async (
  userId: string,
  includeInactive: boolean = false
): Promise<IProduct[]> => {
  const seller = await Seller.findOne({ userId });
  if (!seller) {
    throw new Error("Seller not found");
  }

  const query: any = { sellerId: seller._id };
  if (!includeInactive) {
    query.isActive = true;
  }

  return Product.find(query)
    .sort({ createdAt: -1 })
    .populate({
      path: "sellerId",
      select: "shopName userId",
      populate: {
        path: "userId",
        select: "firstname lastname email",
      },
    });
};

/**
 * Update product (seller only)
 */
export const updateProduct = async (
  userId: string,
  productId: string,
  updates: UpdateProductDTO
): Promise<IProduct> => {
  const seller = await Seller.findOne({ userId });
  if (!seller) {
    throw new Error("Seller profile not found");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Verify ownership
  if (product.sellerId.toString() !== seller._id.toString()) {
    throw new Error("Unauthorized: You can only update your own products");
  }

  Object.assign(product, updates);
  await product.save();

  // Return with populated data
  return product.populate({
    path: "sellerId",
    select: "shopName userId",
    populate: {
      path: "userId",
      select: "firstname lastname email",
    },
  });
};

/**
 * Delete product (seller only)
 */
export const deleteProduct = async (
  userId: string,
  productId: string
): Promise<void> => {
  const seller = await Seller.findOne({ userId });
  if (!seller) {
    throw new Error("Seller profile not found");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Verify ownership
  if (product.sellerId.toString() !== seller._id.toString()) {
    throw new Error("Unauthorized: You can only delete your own products");
  }

  await Product.findByIdAndDelete(productId);

  // Remove from seller's product list
  seller.products = seller.products.filter((id) => id.toString() !== productId);
  await seller.save();
};
