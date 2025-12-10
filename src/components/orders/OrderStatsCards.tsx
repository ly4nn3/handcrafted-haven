import { OrderStats } from "@/types/order.types";
import styles from "./OrderStatsCards.module.css";

interface OrderStatsCardsProps {
  stats: OrderStats;
}

export default function OrderStatsCards({ stats }: OrderStatsCardsProps) {
  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div className={styles.statIcon}>📊</div>
        <div className={styles.statContent}>
          <p className={styles.statLabel}>Total Orders</p>
          <p className={styles.statValue}>{stats.totalOrders}</p>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon}>💰</div>
        <div className={styles.statContent}>
          <p className={styles.statLabel}>Total Revenue</p>
          <p className={styles.statValue}>${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon}>📈</div>
        <div className={styles.statContent}>
          <p className={styles.statLabel}>Avg Order Value</p>
          <p className={styles.statValue}>
            ${stats.averageOrderValue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon}>⏳</div>
        <div className={styles.statContent}>
          <p className={styles.statLabel}>Pending Orders</p>
          <p className={styles.statValue}>
            {stats.ordersByStatus.pending || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
