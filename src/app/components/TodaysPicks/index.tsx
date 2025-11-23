import styles from "@/app/components/TodaysPicks/TodaysPicks.module.css";

const products = Array.from({ length: 6 }).map((_, i) => `Product ${i + 1}`);
export default function TodaysPicks() {
  return (
    <section className={styles.todaysPicks}>
      <h2>Today's Picks</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product} className={styles.productCard}>
            <div className={styles.image}></div>
            <p>{product}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
