"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { OrderService } from "@/lib/api/orderService";
import { OrderResponse, OrderStatus } from "@/types/order.types";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import OrderTimeline from "@/components/orders/OrderTimeline";
import FormField from "@/components/ui/FormField";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./SellerOrderDetails.module.css";

export default function SellerOrderDetailsPage({
  params,
}: {
  params: { orderId: string };
}) {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [statusNote, setStatusNote] = useState("");

  // Redirect if not seller
  useEffect(() => {
    if (!userLoading && (!user || user.role !== "seller")) {
      router.push("/");
    }
  }, [user, userLoading, router]);

  // Fetch order details
  useEffect(() => {
    if (!user || user.role !== "seller") return;

    const fetchOrder = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await OrderService.getOrderById(params.orderId);

        if (result.success) {
          setOrder(result.data);
          setTrackingNumber(result.data.trackingNumber || "");
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
  }, [user, params.orderId]);

  const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    const transitions: { [key in OrderStatus]: OrderStatus[] } = {
      pending: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered", "cancelled"],
      delivered: [],
      cancelled: [],
    };
    return transitions[currentStatus];
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !selectedStatus) return;

    setUpdating(true);
    setUpdateError("");

    try {
      const result = await OrderService.updateOrderStatus(order.id, {
        status: selectedStatus,
        trackingNumber: trackingNumber || undefined,
        note: statusNote || undefined,
      });

      if (result.success) {
        setOrder(result.data);
        setSelectedStatus("");
        setStatusNote("");
        alert("Order status updated successfully!");
      } else {
        setUpdateError(result.error);
      }
    } catch (err) {
      setUpdateError("Failed to update order status");
    } finally {
      setUpdating(false);
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
        <LoadingButton onClick={() => router.push("/dashboard/orders")}>
          Back to Orders
        </LoadingButton>
      </div>
    );
  }

  const nextStatuses = getNextStatuses(order.status);

  return (
    <div className={styles.sellerOrderDetailsPage}>
      {/* Header */}
      <div className={styles.header}>
        <button
          onClick={() => router.push("/dashboard/orders")}
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
          {/* Customer Information */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Customer Information</h2>
            {order.user && (
              <div className={styles.customerInfo}>
                <p>
                  <strong>Name:</strong> {order.user.firstname}{" "}
                  {order.user.lastname}
                </p>
                <p>
                  <strong>Email:</strong> {order.user.email}
                </p>
              </div>
            )}
          </section>

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

          {/* Order Notes */}
          {order.notes && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Customer Notes</h2>
              <div className={styles.notes}>
                <p>{order.notes}</p>
              </div>
            </section>
          )}

          {/* Update Order Status */}
          {nextStatuses.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Update Order Status</h2>
              <form onSubmit={handleUpdateStatus} className={styles.updateForm}>
                <div className={styles.formField}>
                  <label className={styles.label}>New Status *</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as OrderStatus)
                    }
                    className={styles.select}
                    required
                  >
                    <option value="">Select status...</option>
                    {nextStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedStatus === "shipped" && (
                  <FormField
                    label="Tracking Number"
                    value={trackingNumber}
                    onChange={setTrackingNumber}
                    placeholder="Enter tracking number"
                  />
                )}

                <div className={styles.formField}>
                  <label className={styles.label}>Note (Optional)</label>
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Add a note about this status update..."
                    className={styles.textarea}
                    rows={3}
                    maxLength={500}
                  />
                </div>

                {updateError && (
                  <p className={styles.errorMessage}>{updateError}</p>
                )}

                <LoadingButton
                  type="submit"
                  loading={updating}
                  disabled={!selectedStatus || updating}
                  variant="primary"
                >
                  Update Status
                </LoadingButton>
              </form>
            </section>
          )}

          {/* Tracking Information (Display) */}
          {order.trackingNumber && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Tracking Information</h2>
              <div className={styles.tracking}>
                <p className={styles.trackingNumber}>{order.trackingNumber}</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
