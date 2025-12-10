"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductService } from "@/lib/api/productService";
import { ProductResponse } from "@backend/types/product.types";
import { useCart } from "@/app/context/CartContext";
import ImageGallery from "@/components/products/ImageGallery";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import LoadingButton from "@/components/ui/LoadingButton";
import styles from "./ProductDetail.module.css";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const { addToCart, isInCart } = useCart();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await ProductService.getProductById(productId);

      if (result.success) {
        setProduct(result.data as ProductResponse);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product, quantity);
    setAddedToCart(true);

    // Reset the "Added to Cart" message after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;

    addToCart(product, quantity);
    router.push("/cart");
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && product && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Product Not Found</h2>
        <p>{error || "The product you're looking for doesn't exist."}</p>
        <LoadingButton onClick={() => router.push("/shop")}>
          Back to Shop
        </LoadingButton>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const productInCart = isInCart(product.id);

  return (
    <div className={styles.productDetailPage}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/shop">Shop</Link>
        <span className={styles.separator}>›</span>
        <Link href={`/shop?category=${product.category}`}>
          {product.category}
        </Link>
        <span className={styles.separator}>›</span>
        <span className={styles.current}>{product.name}</span>
      </nav>

      <div className={styles.productContainer}>
        {/* Image Gallery */}
        <div className={styles.imageSection}>
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Product Info */}
        <div className={styles.infoSection}>
          <h1 className={styles.productName}>{product.name}</h1>

          {/* Rating */}
          <div className={styles.ratingSection}>
            <div className={styles.stars}>
              {"★".repeat(Math.round(product.averageRating))}
              {"☆".repeat(5 - Math.round(product.averageRating))}
            </div>
            <span className={styles.ratingText}>
              {product.averageRating.toFixed(1)} ({product.totalReviews}{" "}
              {product.totalReviews === 1 ? "review" : "reviews"})
            </span>
            {/* Scroll to reviews */}
            <button
              onClick={() => {
                const reviewsSection =
                  document.getElementById("reviews-section");
                reviewsSection?.scrollIntoView({ behavior: "smooth" });
              }}
              className={styles.reviewsLink}
            >
              See all reviews
            </button>
          </div>

          {/* Price */}
          <div className={styles.priceSection}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            <span className={styles.category}>{product.category}</span>
          </div>

          {/* Stock Status */}
          <div className={styles.stockSection}>
            {isOutOfStock ? (
              <span className={styles.outOfStock}>Out of Stock</span>
            ) : (
              <span className={styles.inStock}>{product.stock} in stock</span>
            )}
          </div>

          {/* Already in Cart Notice */}
          {productInCart && !addedToCart && (
            <div className={styles.inCartNotice}>
              <span>✓ This item is already in your cart</span>
              <Link href="/cart" className={styles.viewCartLink}>
                View Cart
              </Link>
            </div>
          )}

          {/* Added to Cart Success Message */}
          {addedToCart && (
            <div className={styles.addedToCartMessage}>
              ✓ Added {quantity} {quantity === 1 ? "item" : "items"} to cart!
            </div>
          )}

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className={styles.quantitySection}>
              <label className={styles.label}>Quantity:</label>
              <div className={styles.quantityControls}>
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className={styles.quantityButton}
                  disabled={quantity <= 1}
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
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.actions}>
            <LoadingButton
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              variant="primary"
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </LoadingButton>

            {!isOutOfStock && (
              <button onClick={handleBuyNow} className={styles.buyNowButton}>
                Buy Now
              </button>
            )}
          </div>

          {/* Seller Info */}
          {product.seller && (
            <div className={styles.sellerSection}>
              <h3 className={styles.sellerTitle}>Sold by</h3>
              <Link
                href={`/sellers/${product.sellerId}`}
                className={styles.sellerLink}
              >
                <div className={styles.sellerInfo}>
                  <div className={styles.sellerAvatar}>
                    {product.seller.shopName[0].toUpperCase()}
                  </div>
                  <div>
                    <p className={styles.sellerName}>
                      {product.seller.shopName}
                    </p>
                    <p className={styles.viewShop}>View Shop →</p>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className={styles.tagsSection}>
              <h3 className={styles.tagsTitle}>Tags</h3>
              <div className={styles.tags}>
                {product.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description Section */}
      <div className={styles.descriptionSection}>
        <h2 className={styles.sectionTitle}>Product Description</h2>
        <p className={styles.description}>{product.description}</p>
      </div>

      {/* Reviews Section */}
      <div id="reviews-section">
        <ReviewsSection productId={productId} />
      </div>
    </div>
  );
}
