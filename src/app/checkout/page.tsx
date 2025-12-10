"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useUser } from "@/app/context/UserContext";
import { OrderService } from "@/lib/api/orderService";
import { ShippingAddress } from "@/types/order.types";
import FormField from "@/components/ui/FormField";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./Checkout.module.css";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCart();
  const { user, loading: userLoading } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Shipping form
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [notes, setNotes] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, userLoading, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod,
        notes,
      };

      const result = await OrderService.createOrder(orderData);

      if (result.success) {
        clearCart();
        router.push(`/orders/${result.data.id}?success=true`);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || items.length === 0) {
    return (
      <div className={styles.loading}>
        <p>Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.container}>
        {/* Checkout Form */}
        <div className={styles.formSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Shipping Information */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Shipping Information</h2>

              <FormField
                label="Full Name"
                value={shippingAddress.fullName}
                onChange={(value) =>
                  setShippingAddress({ ...shippingAddress, fullName: value })
                }
                required
                placeholder="John Doe"
              />

              <FormField
                label="Address Line 1"
                value={shippingAddress.addressLine1}
                onChange={(value) =>
                  setShippingAddress({
                    ...shippingAddress,
                    addressLine1: value,
                  })
                }
                required
                placeholder="123 Main St"
              />

              <FormField
                label="Address Line 2 (Optional)"
                value={shippingAddress.addressLine2 || ""}
                onChange={(value) =>
                  setShippingAddress({
                    ...shippingAddress,
                    addressLine2: value,
                  })
                }
                placeholder="Apt 4B"
              />

              <div className={styles.row}>
                <FormField
                  label="City"
                  value={shippingAddress.city}
                  onChange={(value) =>
                    setShippingAddress({ ...shippingAddress, city: value })
                  }
                  required
                  placeholder="New York"
                />

                <FormField
                  label="State"
                  value={shippingAddress.state}
                  onChange={(value) =>
                    setShippingAddress({ ...shippingAddress, state: value })
                  }
                  required
                  placeholder="NY"
                />
              </div>

              <div className={styles.row}>
                <FormField
                  label="Postal Code"
                  value={shippingAddress.postalCode}
                  onChange={(value) =>
                    setShippingAddress({
                      ...shippingAddress,
                      postalCode: value,
                    })
                  }
                  required
                  placeholder="10001"
                />

                <FormField
                  label="Country"
                  value={shippingAddress.country}
                  onChange={(value) =>
                    setShippingAddress({ ...shippingAddress, country: value })
                  }
                  required
                  placeholder="USA"
                />
              </div>

              <FormField
                label="Phone Number"
                type="tel"
                value={shippingAddress.phone}
                onChange={(value) =>
                  setShippingAddress({ ...shippingAddress, phone: value })
                }
                required
                placeholder="(555) 123-4567"
              />
            </section>

            {/* Payment Method */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Payment Method</h2>

              <div className={styles.paymentMethods}>
                {[
                  { value: "credit_card", label: "Credit Card" },
                  { value: "debit_card", label: "Debit Card" },
                  { value: "paypal", label: "PayPal" },
                  { value: "cash_on_delivery", label: "Cash on Delivery" },
                ].map((method) => (
                  <label key={method.value} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className={styles.radio}
                    />
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Order Notes */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Order Notes (Optional)</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special delivery instructions..."
                className={styles.textarea}
                rows={4}
                maxLength={500}
              />
            </section>

            {error && <p className={styles.error}>{error}</p>}

            <LoadingButton
              type="submit"
              loading={loading}
              disabled={loading}
              variant="primary"
            >
              Place Order - ${total.toFixed(2)}
            </LoadingButton>
          </form>
        </div>

        {/* Order Summary */}
        <div className={styles.summarySection}>
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.items}>
              {items.map((item) => (
                <div key={item.product.id} className={styles.summaryItem}>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.product.name}</p>
                    <p className={styles.itemQuantity}>Qty: {item.quantity}</p>
                  </div>
                  <p className={styles.itemPrice}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className={styles.divider} />

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className={styles.free}>FREE</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>

            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className={styles.divider} />

            <div className={styles.totalRow}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
