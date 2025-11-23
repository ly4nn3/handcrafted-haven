import styles from "@/app/attributions/Attributions.module.css";

export default function AttributionsPage() {
  return (
    <main className={styles.main}>
      <h1>Attributions</h1>
      <p>
        Brand logo icons by{" "}
        <a
          href="https://thenounproject.com/creator/Maludk/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Laymik
        </a>{" "}
        from Noun Project
      </p>
    </main>
  );
}
