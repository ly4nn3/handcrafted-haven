"use client";

import { useRouter } from "next/navigation";
import styles from "./Categories.module.css";

const categories = [
  { name: "Home Decor", value: "Home Decor", icon: "🏠" },
  { name: "Jewelry", value: "Jewelry", icon: "💎" },
  { name: "Art", value: "Art", icon: "🎨" },
  { name: "Pottery", value: "Pottery", icon: "🏺" },
  { name: "Clothing", value: "Clothing", icon: "👗" },
  { name: "Woodwork", value: "Woodwork", icon: "🌿" },
  { name: "Textiles", value: "Textiles", icon: "🧶" },
  { name: "Accessories", value: "Accessories", icon: "👜" },
];

export default function Categories() {
  const router = useRouter();

  const handleCategoryClick = (categoryValue: string) => {
    router.push(`/shop?category=${encodeURIComponent(categoryValue)}`);
  };

  return (
    <section className={styles.categories}>
      <h2>Shop by Category</h2>
      <div className={styles.grid}>
        {categories.map((cat) => (
          <div
            key={cat.value}
            className={styles.categoryCard}
            onClick={() => handleCategoryClick(cat.value)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleCategoryClick(cat.value);
              }
            }}
          >
            <div className={styles.iconContainer}>
              <span className={styles.icon}>{cat.icon}</span>
            </div>
            <p className={styles.categoryName}>{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
