import { OrderResponse, OrderStatus } from "@/types/order.types";
import styles from "./OrderTimeline.module.css";

interface OrderTimelineProps {
  order: OrderResponse;
}

export default function OrderTimeline({ order }: OrderTimelineProps) {
  const allStatuses: OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
  ];

  const currentIndex = allStatuses.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className={styles.timeline}>
      <h2 className={styles.title}>Order Status</h2>

      {isCancelled ? (
        <div className={styles.cancelled}>
          <div className={styles.cancelledIcon}>✕</div>
          <p className={styles.cancelledText}>Order Cancelled</p>
          {order.statusHistory.find((h) => h.status === "cancelled")
            ?.timestamp && (
            <p className={styles.cancelledDate}>
              {new Date(
                order.statusHistory.find(
                  (h) => h.status === "cancelled"
                )!.timestamp
              ).toLocaleString()}
            </p>
          )}
        </div>
      ) : (
        <div className={styles.steps}>
          {allStatuses.map((status, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const statusEntry = order.statusHistory.find(
              (h) => h.status === status
            );

            return (
              <div
                key={status}
                className={`${styles.step} ${
                  isCompleted ? styles.completed : ""
                } ${isCurrent ? styles.current : ""}`}
              >
                <div className={styles.stepIcon}>
                  {isCompleted ? "✓" : index + 1}
                </div>
                <div className={styles.stepContent}>
                  <p className={styles.stepLabel}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </p>
                  {statusEntry && (
                    <p className={styles.stepDate}>
                      {new Date(statusEntry.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
                {index < allStatuses.length - 1 && (
                  <div
                    className={`${styles.stepLine} ${
                      isCompleted ? styles.completedLine : ""
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
