import styles from "@/app/components/Categories/Categories.module.css";

const categories = ["Decor", "Jewelry", "Art", "Kitchen"];

export default function Categories() {
  return (
    <section className={styles.categories}>
      <h2>Categories</h2>
      <div className={styles.row}>
        {categories.map((cat) => (
          <div key={cat} className={styles.categoryCard}>
            <div className={styles.image}></div>
            <p>{cat}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
