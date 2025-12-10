"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/Hero/Hero.module.css";

const slides = [
  {
    title: "Latest Promotions",
    subtitle: "Discover our newest artisanal pieces",
    cta: "Shop Now",
    link: "/shop",
  },
  {
    title: "Special Offers",
    subtitle: "Limited-time deals on handcrafted items",
    cta: "Explore",
    link: "/shop?sortBy=price&order=asc",
  },
  {
    title: "Trending Now",
    subtitle: "Check out what's trending",
    cta: "Browse",
    link: "/shop?sortBy=averageRating&order=desc",
  },
];

export default function Hero() {
  const router = useRouter();
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
          <button
            className={styles.cta}
            onClick={() => router.push(slide.link)}
          >
            {slide.cta}
          </button>
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
            role="button"
            aria-label={`Go to slide ${index + 1}`}
          ></span>
        ))}
      </div>
    </section>
  );
}
