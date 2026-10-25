
import "./Home.css";

const collections = [
  {
    number: "01",
    title: "Sofas",
    description: "Comfort, character and timeless design.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85",
    link: "https://www.fezmofurniture.com/sofa-collection/",
    categories: [
      ["Chesterfield Sofas", "https://www.fezmofurniture.com/chesterfield-sofa/"],
      ["Low & Mid-Back Sofas", "https://www.fezmofurniture.com/low-and-mid-back-sofas/"],
      ["Headrest Sofas", "https://www.fezmofurniture.com/headrest/"],
      ["Sofa Cum Beds", "https://www.fezmofurniture.com/sofa-cum-bed/"],
      ["Wooden & Cane Sofas", "https://www.fezmofurniture.com/wooden-and-cane-design-sofas/"],
      ["Recliners", "https://www.fezmofurniture.com/recliners-2/"],
      ["Lounge & Wing Chairs", "https://www.fezmofurniture.com/lounge-chairs/"],
    ],
  },
  {
    number: "02",
    title: "Bedroom",
    description: "Create a calm and comfortable place to unwind.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
    link: "https://www.fezmofurniture.com/bedroom-collection/",
    categories: [
      ["Beds & Panels", "https://www.fezmofurniture.com/bed-and-panels/"],
      ["Bedside Tables", "https://www.fezmofurniture.com/bed-side-tables/"],
    ],
  },
  {
    number: "03",
    title: "Dining",
    description: "Bring people together around the table.",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85",
    link: "https://www.fezmofurniture.com/dinning-collection/",
    categories: [
      ["Dining Tables", "https://www.fezmofurniture.com/dining-table/"],
      ["Dining Chairs", "https://www.fezmofurniture.com/dining-chairs/"],
      ["Breakfast Counter Chairs", "https://www.fezmofurniture.com/breakfast-counter-chair/"],
    ],
  },
  {
    number: "04",
    title: "More Furniture",
    description: "The finishing touches that bring a room together.",
    image:
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=1200&q=85",
    link: "https://www.fezmofurniture.com/other-furnitures/",
    categories: [
      ["Center Tables", "https://www.fezmofurniture.com/center-tables/"],
      ["TV Console Units", "https://www.fezmofurniture.com/tv-console-unit/"],
      ["Diwans", "https://www.fezmofurniture.com/diwan/"],
      ["Outdoor Furniture", "https://www.fezmofurniture.com/outdoor-furniture-in-chennai/"],
    ],
  },
];

function Home() {
  return (
    <main className="home-page" id="top">
      {/* Announcement */}
      <div className="announcement">
        Thoughtfully chosen furniture for the way you live.
      </div>

      {/* Navigation */}
      <header className="site-header">
        <a className="brand" href="/" aria-label="Fezmo Furniture homepage">
          <span className="brand-name">FEZMO</span>
          <span className="brand-subtitle">F U R N I T U R E</span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#collections">Collections</a>
          <a href="#approach">Our Approach</a>
          <a href="/visualizer">Room Visualizer</a>
        </nav>

        <a
          className="header-contact"
          href="https://www.fezmofurniture.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official Website ↗
        </a>
      </header>

      {/* Hero */}
      <section className="hero">
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=90"
          alt="Elegant contemporary living room"
          fetchPriority="high"
        />

        <div className="hero-overlay" />

        <div className="hero-content">
          <p className="hero-eyebrow">
            FEZMO FURNITURE · MADE FOR LIVING
          </p>

          <h1>
            Spaces that feel
            <br />
            <em>like you.</em>
          </h1>

          <p className="hero-description">
            Discover furniture that brings comfort, character and
            thoughtful design into the spaces you call home.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#collections">
              Explore Collections <span>↗</span>
            </a>

            <a className="hero-text-link" href="/visualizer">
              Visualize a sofa in your room
            </a>
          </div>
        </div>

        <div className="hero-bottom">
          <span>DESIGNED AROUND YOUR LIFE</span>
          <span>01 — DISCOVER YOUR STYLE</span>
        </div>
      </section>

      {/* Introduction */}
      <section className="intro-section">
        <div className="intro-label">
          <span className="small-line" />
          A MORE PERSONAL SPACE
        </div>

        <div className="intro-content">
          <h2>
            Good furniture makes
            <br />
            a house feel <em>like home.</em>
          </h2>

          <p>
            From the sofa that anchors your living room to the details
            that complete your space, discover furniture for everyday
            comfort and lasting style.
          </p>

          <a
            className="underlined-link"
            href="https://www.fezmofurniture.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discover Fezmo Furniture <span>↗</span>
          </a>
        </div>
      </section>

      {/* Collections */}
      <section className="collections-section" id="collections">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIND YOUR FAVOURITES</p>
            <h2>
              Explore our <em>collections.</em>
            </h2>
          </div>

          <p className="section-side-note">
            Pieces for every corner.
            <br />
            Possibilities for every home.
          </p>
        </div>

        <div className="collection-grid">
          {collections.map((collection) => (
            <article
              className="collection-card"
              key={collection.number}
            >
              <a
                className="collection-image-link"
                href={collection.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Explore ${collection.title} collection`}
              >
                <img
                  className="collection-image"
                  src={collection.image}
                  alt={`${collection.title} furniture inspiration`}
                  loading="lazy"
                />

                <span className="collection-number">
                  {collection.number}
                </span>

                <span className="collection-arrow">↗</span>
              </a>

              <div className="collection-details">
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>

                <a
                  className="collection-main-link"
                  href={collection.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore collection <span>↗</span>
                </a>

                <div className="category-links">
                  {collection.categories.map(([name, url]) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {name}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="all-collections">
          <a
            className="outline-button"
            href="https://www.fezmofurniture.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Browse the official Fezmo website <span>↗</span>
          </a>
        </div>
      </section>

      {/* Our Approach */}
      <section className="approach-section" id="approach">
        <div className="approach-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
            alt="Thoughtfully styled contemporary interior"
            loading="lazy"
          />

          <span className="image-caption">
            YOUR SPACE, YOUR WAY
          </span>
        </div>

        <div className="approach-content">
          <p className="eyebrow">THE FEZMO APPROACH</p>

          <h2>
            Designed for
            <br />
            living. Chosen
            <br />
            <em>by you.</em>
          </h2>

          <p>
            Furniture is more than what fills a room. It is where you
            relax, gather, celebrate and make memories. Explore different
            styles and discover pieces that suit your home and your life.
          </p>

          <a
            className="underlined-link"
            href="https://www.fezmofurniture.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore the collection <span>↗</span>
          </a>
        </div>
      </section>

      {/* NEW Room Visualizer promotion */}
      <section className="visualizer-promo">
        <div className="visualizer-copy">
          <p className="eyebrow">YOUR SPACE, REIMAGINED</p>

          <h2>
            See your favourite sofa
            <br />
            <em>in your own room.</em>
          </h2>

          <p>
            Found a sofa you love on the Fezmo website? Upload its photo
            along with a picture of your room and explore a new way to
            plan your space.
          </p>

          <a className="primary-button" href="/visualizer">
            Try Room Visualizer <span>↗</span>
          </a>

          <span className="visualizer-note">
            Start with your sofa photo and your room photo.
          </span>
        </div>

        <div className="visualizer-visual">
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85"
            alt="Sofa inspiration for a living room"
            loading="lazy"
          />

          <div className="visualizer-floating-card">
            <span className="floating-icon">✳</span>

            <div>
              <strong>Your room. Your style.</strong>
              <span>Imagine a new look for your space</span>
            </div>
          </div>
        </div>
      </section>

      {/* Closing section */}
      <section className="closing-section">
        <p className="eyebrow">A HOME THAT FEELS RIGHT</p>

        <h2>
          Find the pieces
          <br />
          <em>that feel like you.</em>
        </h2>

        <a
          className="closing-link"
          href="https://www.fezmofurniture.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore Fezmo Furniture <span>↗</span>
        </a>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <a className="footer-brand" href="/">
          FEZMO
          <span>F U R N I T U R E</span>
        </a>

        <p>Furniture for the spaces that matter.</p>

        <div className="footer-links">
          <a href="#collections">Collections</a>
          <a href="#approach">Our Approach</a>
          <a href="/visualizer">Room Visualizer</a>

          <a
            href="https://www.fezmofurniture.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Official Website ↗
          </a>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Fezmo Furniture
          </span>

          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Back to top ↑
          </a>
        </div>
      </footer>
    </main>
  );
}

export default Home;
