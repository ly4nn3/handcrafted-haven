"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderService } from "@/lib/api/orderService";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./Success.module.css";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId === null) return;

    if (!orderId) {
      router.push("/");
      return;
    }

    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    if (!orderId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await OrderService.getOrderById(orderId);

      if (result.success) {
        setOrder(result.data);
      } else {
        setError(result.error || "Unable to load order details");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.errorContainer}>
        <h2>Order Not Found</h2>
        <p>{error || "Unable to load order details"}</p>
        <LoadingButton onClick={() => router.push("/")}>
          Go to Home
        </LoadingButton>
      </div>
    );
  }

  return (
    <div className={styles.successPage}>
      <div className={styles.successCard}>
        <div className={styles.iconContainer}>
          <div className={styles.successIcon}>✓</div>
        </div>

        <h1 className={styles.title}>Order Placed Successfully!</h1>
        <p className={styles.subtitle}>
          Thank you for your order. We've received your order and will start
          processing it soon.
        </p>

        <div className={styles.orderInfo}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Order ID:</span>
            <span className={styles.value}>{order._id}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Status:</span>
            <span className={`${styles.value} ${styles.statusBadge}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Total Amount:</span>
            <span className={styles.value}>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.itemsSection}>
          <h3 className={styles.sectionTitle}>Order Items</h3>
          <div className={styles.items}>
            {order.items.map((item: any, index: number) => (
              <div key={index} className={styles.item}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemQuantity}>
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className={styles.itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.shippingSection}>
          <h3 className={styles.sectionTitle}>Shipping Address</h3>
          <div className={styles.address}>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && (
              <p>{order.shippingAddress.addressLine2}</p>
            )}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <LoadingButton onClick={() => router.push("/orders")}>
            View My Orders
          </LoadingButton>
          <button
            onClick={() => router.push("/shop")}
            className={styles.secondaryButton}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
