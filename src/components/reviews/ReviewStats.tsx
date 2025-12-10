"use client";

import { ReviewStats as ReviewStatsType } from "@backend/types/review.types";
import styles from "./ReviewStats.module.css";

interface ReviewStatsProps {
  stats: ReviewStatsType;
}

export default function ReviewStats({ stats }: ReviewStatsProps) {
  const { averageRating, totalReviews, ratingDistribution } = stats;

  const getPercentage = (count: number): number => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className={styles.reviewStats}>
      <div className={styles.summary}>
        <div className={styles.averageRating}>
          <span className={styles.ratingNumber}>
            {averageRating.toFixed(1)}
          </span>
          <div className={styles.stars}>
            {"★".repeat(Math.round(averageRating))}
            {"☆".repeat(5 - Math.round(averageRating))}
          </div>
          <span className={styles.totalReviews}>
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </span>
        </div>
      </div>

      <div className={styles.distribution}>
        {[5, 4, 3, 2, 1].map((rating) => {
          const count =
            ratingDistribution[rating as keyof typeof ratingDistribution];
          const percentage = getPercentage(count);

          return (
            <div key={rating} className={styles.distributionRow}>
              <span className={styles.ratingLabel}>{rating} ★</span>
              <div className={styles.barContainer}>
                <div
                  className={styles.bar}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className={styles.percentage}>{percentage}%</span>
              <span className={styles.count}>({count})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
