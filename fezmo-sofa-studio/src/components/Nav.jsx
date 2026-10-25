
import "./Nav.css";

export default function Nav() {
  return (
    <header className="site-header">
      <a
        className="brand"
        href="/"
        aria-label="Fezmo Furniture homepage"
      >
        <span className="brand-name">FEZMO</span>
        <span className="brand-subtitle">F U R N I T U R E</span>
      </a>

      <nav className="main-nav" aria-label="Main navigation">
        <a href="/#collections">Collections</a>
        <a href="/#approach">Our Approach</a>
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
  );
}
