"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { OrderService } from "@/lib/api/orderService";
import { OrderResponse } from "@/types/order.types";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import OrderTimeline from "@/components/orders/OrderTimeline";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./OrderDetails.module.css";

function OrderDetailsContent({ orderId }: { orderId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: userLoading } = useUser();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);

  const showSuccess = searchParams.get("success") === "true";

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoading && !user) {
      router.push(`/login?redirect=/orders/${orderId}`);
    }
  }, [user, userLoading, router, orderId]);

  // Fetch order details
  useEffect(() => {
    if (!user) return;

    const fetchOrder = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await OrderService.getOrderById(orderId);

        if (result.success) {
          setOrder(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, orderId]);

  const handleCancelOrder = async () => {
    if (!order) return;

    setCancelling(true);
    setError("");

    try {
      const result = await OrderService.cancelOrder(order.id, cancelReason);

      if (result.success) {
        setOrder(result.data);
        setShowCancelForm(false);
        setCancelReason("");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className={styles.loading}>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.error}>
        <h2>Error</h2>
        <p>{error || "Order not found"}</p>
        <LoadingButton onClick={() => router.push("/orders")}>
          Back to Orders
        </LoadingButton>
      </div>
    );
  }

  const canCancel = ["pending", "processing"].includes(order.status);

  return (
    <div className={styles.orderDetailsPage}>
      {/* Success Message */}
      {showSuccess && (
        <div className={styles.successBanner}>
          <p>✓ Order placed successfully!</p>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <button
          onClick={() => router.push("/orders")}
          className={styles.backButton}
        >
          ← Back to Orders
        </button>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Order #{order.id.slice(-8)}</h1>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className={styles.container}>
        {/* Order Timeline */}
        <div className={styles.timeline}>
          <OrderTimeline order={order} />
        </div>

        {/* Order Details */}
        <div className={styles.details}>
          {/* Items */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Items</h2>
            <div className={styles.items}>
              {order.items.map((item, index) => (
                <div key={index} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemPrice}>
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className={styles.itemTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>${order.shippingCost.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.totalRow}>
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Shipping Address</h2>
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
          </section>

          {/* Tracking */}
          {order.trackingNumber && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Tracking Information</h2>
              <div className={styles.tracking}>
                <p className={styles.trackingNumber}>{order.trackingNumber}</p>
              </div>
            </section>
          )}

          {/* Cancel Order */}
          {canCancel && !showCancelForm && (
            <button
              onClick={() => setShowCancelForm(true)}
              className={styles.cancelButton}
            >
              Cancel Order
            </button>
          )}

          {showCancelForm && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Cancel Order</h2>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation (optional)"
                className={styles.textarea}
                rows={4}
              />
              <div className={styles.cancelActions}>
                <LoadingButton
                  onClick={handleCancelOrder}
                  loading={cancelling}
                  variant="primary"
                >
                  Confirm Cancellation
                </LoadingButton>
                <button
                  onClick={() => setShowCancelForm(false)}
                  className={styles.cancelCancelButton}
                  disabled={cancelling}
                >
                  Nevermind
                </button>
              </div>
            </section>
          )}

          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <Suspense
      fallback={
        <div className={styles.loading}>
          <p>Loading order details...</p>
        </div>
      }
    >
      <OrderDetailsContent orderId={params.orderId} />
    </Suspense>
  );
}
