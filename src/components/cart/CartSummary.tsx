"use client";

import { useCart } from "@/app/context/CartContext";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./CartSummary.module.css";

interface CartSummaryProps {
  onCheckout?: () => void;
}

export default function CartSummary({ onCheckout }: CartSummaryProps) {
  const { items, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={styles.cartSummary}>
      <h2 className={styles.title}>Order Summary</h2>

      <div className={styles.summaryRow}>
        <span className={styles.label}>
          Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
        </span>
        <span className={styles.value}>${subtotal.toFixed(2)}</span>
      </div>

      <div className={styles.summaryRow}>
        <span className={styles.label}>Shipping</span>
        <span className={styles.value}>
          {shipping === 0 ? (
            <span className={styles.free}>FREE</span>
          ) : (
            `$${shipping.toFixed(2)}`
          )}
        </span>
      </div>

      {shipping > 0 && subtotal < 50 && (
        <p className={styles.shippingNote}>
          Add ${(50 - subtotal).toFixed(2)} more for free shipping!
        </p>
      )}

      <div className={styles.summaryRow}>
        <span className={styles.label}>Estimated Tax</span>
        <span className={styles.value}>${tax.toFixed(2)}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalValue}>${total.toFixed(2)}</span>
      </div>

      <LoadingButton
        onClick={onCheckout}
        disabled={items.length === 0}
        variant="primary"
      >
        Proceed to Checkout
      </LoadingButton>
    </div>
  );
}
