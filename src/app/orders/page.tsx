"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { OrderService } from "@/lib/api/orderService";
import { OrderResponse, OrderStatus } from "@/types/order.types";
import OrderCard from "@/components/orders/OrderCard";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./Orders.module.css";

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login?redirect=/orders");
    }
  }, [user, userLoading, router]);

  // Fetch orders
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await OrderService.getUserOrders(
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

  if (userLoading) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.ordersPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Orders</h1>
      </div>

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
          <p>Start shopping to create your first order!</p>
          <LoadingButton onClick={() => router.push("/shop")}>
            Browse Products
          </LoadingButton>
        </div>
      ) : (
        <>
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
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
