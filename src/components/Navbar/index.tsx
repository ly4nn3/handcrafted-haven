"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Navbar.module.css";
import { useUser } from "@/app/context/UserContext";
import { useCart } from "@/app/context/CartContext";
import { AuthService } from "@/lib/api/authService";

export default function NavBar() {
  const { user, setUser } = useUser();
  const { getItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const cartItemCount = getItemCount();

  const toggleMenu = () => setIsOpen(!isOpen);

  const logout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setIsDropdownOpen(false);
    setIsOpen(false);

    try {
      await AuthService.logout();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const theme = "light";
  const logoSrc =
    theme === "light"
      ? "/assets/logo/on-light.svg"
      : "/assets/logo/on-dark.svg";

  return (
    <header className={styles.navbar}>
      {/* Brand */}
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src={logoSrc}
            alt="Handcrafted Haven Logo"
            width={200}
            height={100}
          />
        </Link>
        <Link href="/">
          <h1 className={styles.brandName}>Handcrafted Haven</h1>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className={styles.navLinks}>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={pathname === link.href ? styles.activeLink : ""}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className={styles.userSection}>
        {/* Cart Icon */}
        <Link
          href="/cart"
          className={styles.cartButton}
          aria-label="Shopping cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
          </svg>
          {cartItemCount > 0 && (
            <span className={styles.cartBadge}>{cartItemCount}</span>
          )}
        </Link>

        {/* Not logged in → Login */}
        {!user && (
          <Link href="/auth/login" className={styles.cta}>
            Login
          </Link>
        )}

        {/* Logged-in user → dropdown for Dashboard/Profile + Logout */}
        {user && (
          <div
            className={styles.userDropdownWrapper}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className={styles.userButton} aria-label="User menu">
              <span className={styles.userIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                >
                  <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
                </svg>
              </span>
              <span>{user.firstname}</span>
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className={styles.userDropdownContent}>
                <Link
                  href={
                    user.role === "seller"
                      ? "/dashboard/seller"
                      : "/dashboard/user"
                  }
                  className={styles.userDropdownButton}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {user.role === "seller" ? "Dashboard" : "Profile"}
                </Link>
                <button
                  onClick={logout}
                  className={styles.userDropdownButton}
                  disabled={loggingOut}
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="var(--night)"
        >
          <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
        </svg>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={pathname === link.href ? styles.activeLink : ""}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* Cart Link for Mobile */}
          <Link
            href="/cart"
            className={styles.mobileCartLink}
            onClick={() => setIsOpen(false)}
          >
            Cart {cartItemCount > 0 && `(${cartItemCount})`}
          </Link>

          {!user && (
            <Link
              href="/auth/login"
              className={styles.cta}
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}

          {user && (
            <>
              <Link
                href={
                  user.role === "seller"
                    ? "/dashboard/seller"
                    : "/dashboard/user"
                }
                className={styles.cta}
                onClick={() => setIsOpen(false)}
              >
                {user.role === "seller" ? "Dashboard" : "Profile"}
              </Link>
              <button
                onClick={logout}
                className={styles.cta}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
