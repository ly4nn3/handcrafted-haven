"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { ProductResponse } from "@backend/types/product.types";

export interface CartItem {
  product: ProductResponse;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: ProductResponse, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getCartTotal: () => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getItemCount: () => 0,
  getCartTotal: () => 0,
  isInCart: () => false,
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = safeGetLocalStorage("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error("Failed to parse stored cart:", error);
      }
    }
    setMounted(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      safeSetLocalStorage("cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  const addToCart = useCallback(
    (product: ProductResponse, quantity: number) => {
      setItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          // Update quantity of existing item
          const newQuantity = existingItem.quantity + quantity;
          const maxQuantity = product.stock;

          return prevItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: Math.min(newQuantity, maxQuantity) }
              : item
          );
        } else {
          // Add new item
          return [...prevItems, { product, quantity }];
        }
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.min(quantity, item.product.stock) }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getCartTotal = useCallback(() => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [items]);

  const isInCart = useCallback(
    (productId: string) => {
      return items.some((item) => item.product.id === productId);
    },
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getCartTotal,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Safe localStorage operations
 */
const safeGetLocalStorage = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("localStorage.getItem error:", error);
    return null;
  }
};

const safeSetLocalStorage = (key: string, value: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("localStorage.setItem error:", error);
  }
};
