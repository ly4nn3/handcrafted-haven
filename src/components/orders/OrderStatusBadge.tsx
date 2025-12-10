import { OrderStatus } from "@/types/order.types";
import styles from "./OrderStatusBadge.module.css";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig = {
    pending: { label: "Pending", color: "yellow" },
    processing: { label: "Processing", color: "blue" },
    shipped: { label: "Shipped", color: "purple" },
    delivered: { label: "Delivered", color: "green" },
    cancelled: { label: "Cancelled", color: "red" },
  };

  const config = statusConfig[status];

  return (
    <span className={`${styles.badge} ${styles[config.color]}`}>
      {config.label}
    </span>
  );
}
