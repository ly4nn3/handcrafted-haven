"use client";

import { useRouter } from "next/navigation";
import { OrderResponse } from "@/types/order.types";
import OrderStatusBadge from "./OrderStatusBadge";
import styles from "./OrderCard.module.css";

interface OrderCardProps {
  order: OrderResponse;
}

export default function OrderCard({ order }: OrderCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/orders/${order.id}`);
  };

  return (
    <div className={styles.orderCard} onClick={handleClick}>
      <div className={styles.header}>
        <div className={styles.orderInfo}>
          <h3 className={styles.orderId}>Order #{order.id.slice(-8)}</h3>
          <p className={styles.date}>
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className={styles.shopInfo}>
        {order.seller && (
          <p className={styles.shopName}>Shop: {order.seller.shopName}</p>
        )}
      </div>

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

      <div className={styles.footer}>
        <div className={styles.total}>
          <span className={styles.totalLabel}>Total:</span>
          <span className={styles.totalAmount}>${order.total.toFixed(2)}</span>
        </div>
        <button className={styles.viewButton}>View Details →</button>
      </div>
    </div>
  );
}
