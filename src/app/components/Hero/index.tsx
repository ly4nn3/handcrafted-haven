"use client";

import { useState, useEffect } from "react";
import styles from "@/app/components/Hero/Hero.module.css";

const slides = [
  {
    title: "Latest Promotions",
    subtitle: "Discover our newest artisanal pieces",
    cta: "Shop Now",
  },
  {
    title: "Special Offers",
    subtitle: "Limited-time deals on handcrafted items",
    cta: "Explore",
  },
  {
    title: "Trending Now",
    subtitle: "Check out what's trending",
    cta: "Browse",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.hero}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`${styles.slide} ${
            index === currentSlide ? styles.active : ""
          }`}
        >
          <h1>{slide.title}</h1>
          <p>{slide.subtitle}</p>
          <button className={styles.cta}>{slide.cta}</button>
        </div>
      ))}

      {/* Navigation */}
      <div className={styles.dots}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${
              index === currentSlide ? styles.activeDot : ""
            }`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </section>
  );
}
