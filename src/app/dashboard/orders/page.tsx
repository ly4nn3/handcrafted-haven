"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { OrderService } from "@/lib/api/orderService";
import { OrderResponse, OrderStatus, OrderStats } from "@/types/order.types";
import SellerOrderCard from "@/components/orders/SellerOrderCard";
import OrderStatsCards from "@/components/orders/OrderStatsCards";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./SellerOrders.module.css";

export default function SellerOrdersPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Redirect if not seller
  useEffect(() => {
    if (!userLoading && (!user || user.role !== "seller")) {
      router.push("/");
    }
  }, [user, userLoading, router]);

  // Fetch statistics
  useEffect(() => {
    if (!user || user.role !== "seller") return;

    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const result = await OrderService.getSellerStats();
        if (result.success) {
          setStats(result.data);
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  // Fetch orders
  useEffect(() => {
    if (!user || user.role !== "seller") return;

    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await OrderService.getSellerOrders(
          page,
          10,
          statusFilter === "all" ? undefined : statusFilter
        );

        if (result.success) {
          setOrders(result.data.orders);
          setTotalPages(result.data.pagination.totalPages);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, page, statusFilter]);

  const handleOrderUpdate = (updatedOrder: OrderResponse) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    // Refresh stats
    if (user && user.role === "seller") {
      OrderService.getSellerStats().then((result) => {
        if (result.success) {
          setStats(result.data);
        }
      });
    }
  };

  if (userLoading) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.sellerOrdersPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Order Management</h1>
      </div>

      {/* Statistics Cards */}
      {!statsLoading && stats && <OrderStatsCards stats={stats} />}

      {/* Status Filter */}
      <div className={styles.filters}>
        {[
          "all",
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ].map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status as OrderStatus | "all");
              setPage(1);
            }}
            className={`${styles.filterButton} ${
              statusFilter === status ? styles.active : ""
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {stats &&
              status !== "all" &&
              ` (${stats.ordersByStatus[status as OrderStatus] || 0})`}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className={styles.loading}>
          <p>Loading orders...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📦</div>
          <h2>No orders found</h2>
          <p>
            {statusFilter === "all"
              ? "You haven't received any orders yet."
              : `No ${statusFilter} orders.`}
          </p>
        </div>
      ) : (
        <>
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <SellerOrderCard
                key={order.id}
                order={order}
                onUpdate={handleOrderUpdate}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={styles.paginationButton}
              >
                ← Previous
              </button>
              <span className={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={styles.paginationButton}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
