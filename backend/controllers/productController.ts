import Product, { IProduct } from "@backend/models/Product";
import Seller from "@backend/models/Seller";

export const addProduct = async (data: {
  sellerId: string;
  productData: {
    name: string;
    description?: string;
    price: number;
    images?: string[];
    categories?: string[];
  };
}) => {
  const { sellerId, productData } = data;

  const seller = await Seller.findById(sellerId);
  if (!seller) throw new Error("Seller not found");

  const product: IProduct = new Product({
    sellerId,
    ...productData,
  });

  await product.save();

  seller.products.push(product._id);
  await seller.save();

  return product;
};
