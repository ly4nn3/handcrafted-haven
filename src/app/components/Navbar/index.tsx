"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/components/Navbar/Navbar.module.css";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const theme = "light"; // add DARK later for dynamic themes

  const logoSrc =
    theme === "light"
      ? "/assets/logo/on-light.svg"
      : "/assets/logo/on-dark.svg";

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Image
          src={logoSrc}
          alt="Handcrafted Haven Logo"
          width={200}
          height={100}
        />

        <h1 className={styles.brandName}>Handcrafted Haven</h1>
      </div>

      {/* Desktop */}
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

      <button className={styles.cta}>Login</button>

      {/* Hamburger button on smaller devices */}
      <button className={styles.hamburger} onClick={toggleMenu}>
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

      {/* Menu */}
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
          <button className={styles.cta}>Login</button>
        </div>
      )}
    </header>
  );
}
