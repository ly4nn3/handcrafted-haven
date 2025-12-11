import styles from "./About.module.css";

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>About Handcrafted Haven</h1>
          <p className={styles.subtitle}>Where artisans meet collectors</p>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.content}>
        <div className="container">
          {/* Our Story */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Story</h2>
            <div className={styles.textContent}>
              <p>
                Handcrafted Haven aims to provide a platform for artisans and
                crafters to showcase and sell their unique handcrafted items. It
                serves as a virtual marketplace, connecting talented creators
                with potential customers who appreciate the beauty and quality
                of handmade products. This platform focuses on fostering a sense
                of community, supporting local artisans, and promoting
                sustainable consumption.
              </p>
              <p>
                Handcrafted Haven aims to revolutionize the way handcrafted
                items are discovered, appreciated, and acquired. By providing a
                digital platform for artisans to showcase their creativity and
                connect with a broader audience, fostering a thriving community
                of passionate creators and conscious consumers.
              </p>
            </div>
          </div>

          {/* Mission & Values */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <div className={styles.textContent}>
              <p>
                To connect talented artisans with customers who appreciate the
                beauty and quality of handcrafted goods. We believe in
                supporting small businesses and preserving traditional crafts
                while embracing modern e-commerce.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Values</h2>
            <div className={styles.valuesGrid}>
              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>🎨</div>
                <h3 className={styles.valueTitle}>Quality Craftsmanship</h3>
                <p className={styles.valueText}>
                  Every product is carefully crafted by skilled artisans who
                  take pride in their work.
                </p>
              </div>

              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>🤝</div>
                <h3 className={styles.valueTitle}>Support Artisans</h3>
                <p className={styles.valueText}>
                  We empower independent creators by providing a platform to
                  showcase and sell their unique pieces.
                </p>
              </div>

              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>🌱</div>
                <h3 className={styles.valueTitle}>Sustainability</h3>
                <p className={styles.valueText}>
                  We promote eco-friendly practices and sustainable materials in
                  handcrafted goods.
                </p>
              </div>

              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>💎</div>
                <h3 className={styles.valueTitle}>Uniqueness</h3>
                <p className={styles.valueText}>
                  Each item is one-of-a-kind, bringing character and personality
                  to your home.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <div className={styles.stepsGrid}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <h3 className={styles.stepTitle}>Discover</h3>
                <p className={styles.stepText}>
                  Browse our curated collection of handcrafted items from
                  talented artisans.
                </p>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <h3 className={styles.stepTitle}>Connect</h3>
                <p className={styles.stepText}>
                  Learn about the artisans behind each piece and their unique
                  stories.
                </p>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <h3 className={styles.stepTitle}>Purchase</h3>
                <p className={styles.stepText}>
                  Securely buy unique, handmade items and support independent
                  creators.
                </p>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>4</div>
                <h3 className={styles.stepTitle}>Enjoy</h3>
                <p className={styles.stepText}>
                  Receive your carefully packaged treasure and enjoy owning
                  something truly special.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>
              Ready to Discover Unique Pieces?
            </h2>
            <p className={styles.ctaText}>
              Explore our marketplace and find something special today.
            </p>
            <div className={styles.ctaButtons}>
              <a href="/shop" className={styles.primaryButton}>
                Shop Now
              </a>
              <a href="/auth/register" className={styles.secondaryButton}>
                Become a Seller
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
