import styles from "./LoadingButton.module.css";

interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export default function LoadingButton({
  children,
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  variant = "primary",
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${styles.button} ${styles[variant]} ${
        loading ? styles.loading : ""
      }`}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
