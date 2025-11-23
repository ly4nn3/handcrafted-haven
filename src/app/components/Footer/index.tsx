import styles from "@/app/components/Footer/Footer.module.css";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>
        &copy; {year} Handcrafted Haven. All rights reserved. |{" "}
        <Link href="/attributions" className={styles.link}>
          Attributions
        </Link>
      </p>
    </footer>
  );
}
