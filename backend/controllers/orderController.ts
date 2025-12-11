import Order, { IOrder } from "@backend/models/Order";
import Product from "@backend/models/Product";
import { CreateOrderDTO } from "@/types/order.types";

/**
 * Create orders from cart (one order per seller)
 */
export const createOrders = async (
  userId: string,
  orderData: CreateOrderDTO
): Promise<IOrder[]> => {
  const { items, shippingAddress, paymentMethod, notes } = orderData;

  // Fetch product details WITHOUT populating seller
  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== items.length) {
    throw new Error("Some products were not found");
  }

  // Group items by seller
  const itemsBySeller = new Map<string, any[]>();

  for (const item of items) {
    const product = products.find((p) => p._id.toString() === item.productId);

    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    // Get sellerId as a string - sellerId is already an ObjectId, not populated
    const sellerId = product.sellerId.toString();

    if (!itemsBySeller.has(sellerId)) {
      itemsBySeller.set(sellerId, []);
    }

    itemsBySeller.get(sellerId)!.push({
      product,
      quantity: item.quantity,
    });
  }

  console.log("Orders to create:", itemsBySeller.size);

  // Create one order per seller
  const createdOrders: IOrder[] = [];

  for (const [sellerIdString, sellerItems] of itemsBySeller) {
    let subtotal = 0;

    const orderItems = sellerItems.map((item) => {
      const itemSubtotal = item.product.price * item.quantity;
      subtotal += itemSubtotal;

      return {
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || "",
      };
    });

    // Calculate shipping and tax
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shippingCost + tax;

    console.log("Creating order for seller:", sellerIdString);

    // Create order - sellerIdString is already a string representation of ObjectId
    const order = new Order({
      userId,
      sellerId: sellerIdString, // Use the string directly
      items: orderItems,
      shippingAddress,
      paymentMethod,
      notes,
      subtotal,
      shippingCost,
      tax,
      total,
      status: "processing",
      paymentStatus: "completed",
    });

    await order.save();

    // Update product stock
    for (const item of sellerItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    createdOrders.push(order);
  }

  console.log("Orders created:", createdOrders.length);

  return createdOrders;
};

/**
 * Get order by ID
 */
export const getOrderById = async (
  orderId: string,
  userId: string
): Promise<IOrder> => {
  const order = await Order.findById(orderId)
    .populate("userId", "firstname lastname email")
    .populate("sellerId", "shopName");

  if (!order) {
    throw new Error("Order not found");
  }

  // Verify user owns this order
  if (order.userId._id.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  return order;
};

/**
 * Get user's orders
 */
export const getUserOrders = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sellerId", "shopName"),
    Order.countDocuments({ userId }),
  ]);

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get seller's orders
 */
export const getSellerOrders = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  const Seller = (await import("@backend/models/Seller")).default;

  // Find seller by userId
  const seller = await Seller.findOne({ userId });

  if (!seller) {
    return {
      orders: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ sellerId: seller._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstname lastname email"),
    Order.countDocuments({ sellerId: seller._id }),
  ]);

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
