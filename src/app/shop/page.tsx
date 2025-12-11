"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductService, GetProductsParams } from "@/lib/api/productService";
import {
  ProductResponse,
  PaginatedProducts,
} from "@backend/types/product.types";
import SearchBar from "@/components/products/SearchBar";
import FilterBar from "@/components/products/FilterBar";
import ProductGrid from "@/components/products/ProductGrid";
import Pagination from "@/components/products/Pagination";
import styles from "./Shop.module.css";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  // Filter state
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "createdAt-desc"
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, minPrice, maxPrice, sortBy, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    const [sortField, sortOrder] = sortBy.split("-");

    const params: GetProductsParams = {
      page: currentPage,
      limit: 20,
      sortBy: sortField as any,
      order: sortOrder as any,
    };

    if (searchQuery) params.search = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    if (minPrice) params.minPrice = parseFloat(minPrice);
    if (maxPrice) params.maxPrice = parseFloat(maxPrice);

    try {
      const result = await ProductService.getProducts(params);

      if (result.success) {
        const data = result.data as PaginatedProducts;
        setProducts(data.products);
        setPagination(data.pagination);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    updateURL({ search: query, page: "1" });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateURL({ category, page: "1" });
  };

  const handlePriceChange = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
    updateURL({ minPrice: min, maxPrice: max, page: "1" });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
    updateURL({ sort, page: "1" });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("createdAt-desc");
    setCurrentPage(1);
    router.push("/shop");
  };

  const updateURL = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    router.push(`/shop?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <div className={styles.shopPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shop Handcrafted Products</h1>
        <p className={styles.subtitle}>
          Discover unique, handmade items from talented artisans
        </p>
      </div>

      <SearchBar onSearch={handleSearch} initialValue={searchQuery} />

      <FilterBar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        minPrice={minPrice}
        onMinPriceChange={(val) => handlePriceChange(val, maxPrice)}
        maxPrice={maxPrice}
        onMaxPriceChange={(val) => handlePriceChange(minPrice, val)}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
      />

      {error ? (
        <div className={styles.errorContainer}>
          <p className={styles.error}>{error}</p>
          <button onClick={fetchProducts} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className={styles.resultsHeader}>
            <p className={styles.resultsCount}>
              {loading ? "Loading..." : `${pagination.total} products found`}
            </p>
          </div>

          <ProductGrid products={products} loading={loading} />

          {!loading && products.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.shopPage}>
          <div className={styles.header}>
            <h1 className={styles.title}>Loading...</h1>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
