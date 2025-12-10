"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OrderResponse, OrderStatus } from "@/types/order.types";
import { OrderService } from "@/lib/api/orderService";
import OrderStatusBadge from "./OrderStatusBadge";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./SellerOrderCard.module.css";

interface SellerOrderCardProps {
  order: OrderResponse;
  onUpdate: (order: OrderResponse) => void;
}

export default function SellerOrderCard({
  order,
  onUpdate,
}: SellerOrderCardProps) {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setUpdating(true);
    setError("");

    try {
      const result = await OrderService.updateOrderStatus(order.id, {
        status: newStatus,
      });

      if (result.success) {
        onUpdate(result.data);
        setShowActions(false);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

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

  const nextStatuses = getNextStatuses(order.status);

  return (
    <div className={styles.orderCard}>
      <div className={styles.header}>
        <div className={styles.orderInfo}>
          <h3
            className={styles.orderId}
            onClick={() => router.push(`/dashboard/orders/${order.id}`)}
          >
            Order #{order.id.slice(-8)}
          </h3>
          <p className={styles.date}>
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Customer Info */}
      {order.user && (
        <div className={styles.customerInfo}>
          <p className={styles.customerLabel}>Customer:</p>
          <p className={styles.customerName}>
            {order.user.firstname} {order.user.lastname}
          </p>
          <p className={styles.customerEmail}>{order.user.email}</p>
        </div>
      )}

      {/* Items */}
      <div className={styles.items}>
        {order.items.slice(0, 2).map((item, index) => (
          <div key={index} className={styles.item}>
            <p className={styles.itemName}>{item.name}</p>
            <p className={styles.itemQuantity}>× {item.quantity}</p>
          </div>
        ))}
        {order.items.length > 2 && (
          <p className={styles.moreItems}>
            +{order.items.length - 2} more item(s)
          </p>
        )}
      </div>

      {/* Shipping Address */}
      <div className={styles.shippingInfo}>
        <p className={styles.shippingLabel}>Ship to:</p>
        <p className={styles.shippingAddress}>
          {order.shippingAddress.city}, {order.shippingAddress.state}
        </p>
      </div>

      <div className={styles.footer}>
        <div className={styles.total}>
          <span className={styles.totalLabel}>Total:</span>
          <span className={styles.totalAmount}>${order.total.toFixed(2)}</span>
        </div>

        <div className={styles.actions}>
          {nextStatuses.length > 0 && !showActions && (
            <button
              onClick={() => setShowActions(true)}
              className={styles.updateButton}
            >
              Update Status
            </button>
          )}

          <button
            onClick={() => router.push(`/dashboard/orders/${order.id}`)}
            className={styles.viewButton}
          >
            View Details →
          </button>
        </div>
      </div>

      {/* Status Update Actions */}
      {showActions && (
        <div className={styles.statusActions}>
          <p className={styles.statusActionsLabel}>Update order status:</p>
          <div className={styles.statusButtons}>
            {nextStatuses.map((status) => (
              <LoadingButton
                key={status}
                onClick={() => handleStatusUpdate(status)}
                loading={updating}
                disabled={updating}
                variant={status === "cancelled" ? "secondary" : "primary"}
              >
                Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
              </LoadingButton>
            ))}
            <button
              onClick={() => setShowActions(false)}
              className={styles.cancelButton}
              disabled={updating}
            >
              Cancel
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}
    </div>
  );
}
