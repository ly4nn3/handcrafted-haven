"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./Cart.module.css";

export default function CartPage() {
  const router = useRouter();
  const { items, loading, updateQuantity, removeFromCart, clearCart } =
    useCart();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  // Show loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading your cart...</p>
      </div>
    );
  }

  // Show empty state
  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.emptyIcon}>🛒</div>
        <h2 className={styles.emptyTitle}>Your cart is empty</h2>
        <p className={styles.emptyText}>
          Add some amazing handcrafted products to get started!
        </p>
        <LoadingButton onClick={() => router.push("/shop")}>
          Browse Products
        </LoadingButton>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shopping Cart</h1>
        <button onClick={clearCart} className={styles.clearButton}>
          Clear Cart
        </button>
      </div>

      <div className={styles.cartContainer}>
        {/* Cart Items */}
        <div className={styles.itemsSection}>
          <div className={styles.itemsHeader}>
            <span className={styles.itemCount}>
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          <div className={styles.items}>
            {items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className={styles.summarySection}>
          <CartSummary onCheckout={handleCheckout} />
        </div>
      </div>

      {/* Continue Shopping */}
      <div className={styles.footer}>
        <button
          onClick={() => router.push("/shop")}
          className={styles.continueButton}
        >
          ← Continue Shopping
        </button>
      </div>
    </div>
  );
}
