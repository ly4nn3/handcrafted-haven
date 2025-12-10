"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem as CartItemType } from "@/app/context/CartContext";
import styles from "./CartItem.module.css";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const { product, quantity } = item;

  const itemTotal = product.price * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      onUpdateQuantity(product.id, newQuantity);
    }
  };

  const handleRemove = () => {
    onRemove(product.id);
    setShowRemoveConfirm(false);
  };

  return (
    <div className={styles.cartItem}>
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className={styles.imageLink}>
        <div className={styles.imageContainer}>
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={styles.image}
              sizes="120px"
            />
          ) : (
            <div className={styles.noImage}>No Image</div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className={styles.info}>
        <Link href={`/products/${product.id}`} className={styles.productLink}>
          <h3 className={styles.productName}>{product.name}</h3>
        </Link>
        <p className={styles.category}>{product.category}</p>
        {product.seller && (
          <Link
            href={`/sellers/${product.sellerId}`}
            className={styles.sellerLink}
          >
            by {product.seller.shopName}
          </Link>
        )}
        <p className={styles.price}>${product.price.toFixed(2)} each</p>
      </div>

      {/* Quantity Controls */}
      <div className={styles.quantitySection}>
        <label className={styles.quantityLabel}>Quantity</label>
        <div className={styles.quantityControls}>
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className={styles.quantityButton}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              handleQuantityChange(parseInt(e.target.value) || 1)
            }
            className={styles.quantityInput}
            min="1"
            max={product.stock}
          />
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className={styles.quantityButton}
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        {quantity >= product.stock && (
          <p className={styles.stockWarning}>Max stock reached</p>
        )}
      </div>

      {/* Item Total */}
      <div className={styles.totalSection}>
        <p className={styles.totalLabel}>Total</p>
        <p className={styles.totalPrice}>${itemTotal.toFixed(2)}</p>
      </div>

      {/* Remove Button */}
      <div className={styles.removeSection}>
        {showRemoveConfirm ? (
          <div className={styles.removeConfirm}>
            <p>Remove?</p>
            <button onClick={handleRemove} className={styles.confirmButton}>
              Yes
            </button>
            <button
              onClick={() => setShowRemoveConfirm(false)}
              className={styles.cancelButton}
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowRemoveConfirm(true)}
            className={styles.removeButton}
            aria-label="Remove item"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
