"use client";

import { VALID_CATEGORIES } from "@backend/utils/productValidation";
import styles from "./FilterBar.module.css";

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  minPrice: string;
  onMinPriceChange: (price: string) => void;
  maxPrice: string;
  onMaxPriceChange: (price: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

export default function FilterBar({
  selectedCategory,
  onCategoryChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sortBy,
  onSortChange,
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters =
    selectedCategory || minPrice || maxPrice || sortBy !== "createdAt-desc";

  return (
    <div className={styles.filterBar}>
      <div className={styles.filters}>
        {/* Category Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={styles.select}
          >
            <option value="">All Categories</option>
            {VALID_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Price Range</label>
          <div className={styles.priceInputs}>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className={styles.priceInput}
              min="0"
            />
            <span className={styles.priceSeparator}>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className={styles.priceInput}
              min="0"
            />
          </div>
        </div>

        {/* Sort */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={styles.select}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="averageRating-desc">Highest Rated</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button onClick={onClearFilters} className={styles.clearButton}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
