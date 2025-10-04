export default function Home() {
  return (
    <div className="container">
      <nav>
        <div className="nav-container">
          <h1 className="logo">New Domain</h1>
          <ul className="nav-links">
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      <header>
        <div className="hero-bg"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to New Domain</h1>
          <p className="hero-subtitle">
            Experience premium services with cutting-edge technology and exceptional quality.
          </p>
          <a href="#services" className="cta-button">Explore Services</a>
        </div>
      </header>

      <main>
        <section className="services" id="services">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <span className="card-icon">🚗</span>
              <h3><a href="#transportation">Transportation</a></h3>
              <p>Luxury transportation services with premium vehicles and professional drivers.</p>
            </div>
            <div className="service-card">
              <span className="card-icon">📦</span>
              <h3><a href="#courier">Courier Services</a></h3>
              <p>Reliable and secure courier services for all your delivery needs.</p>
            </div>
            <div className="service-card">
              <span className="card-icon">💻</span>
              <h3><a href="#web-design">Web Design</a></h3>
              <p>Professional web design and development services.</p>
            </div>
          </div>
        </section>

        <section className="transportation" id="transportation">
          <h2>Transportation Services</h2>
          <p>Experience luxury transportation with our premium fleet of vehicles.</p>
          <div className="features-grid">
            <div className="feature-item">
              <h3>Luxury Vehicles</h3>
              <p>Premium cars and SUVs for your comfort and style.</p>
            </div>
            <div className="feature-item">
              <h3>Professional Drivers</h3>
              <p>Experienced and courteous drivers at your service.</p>
            </div>
            <div className="feature-item">
              <h3>24/7 Availability</h3>
              <p>Round-the-clock service for your transportation needs.</p>
            </div>
          </div>
        </section>

        <section className="courier" id="courier">
          <h2>Courier Services</h2>
          <p>Reliable and secure delivery services for all your packages.</p>
          <div className="features-grid">
            <div className="feature-item">
              <h3>Fast Delivery</h3>
              <p>Quick and efficient delivery to your destination.</p>
            </div>
            <div className="feature-item">
              <h3>Secure Packaging</h3>
              <p>Safe and secure packaging for valuable items.</p>
            </div>
            <div className="feature-item">
              <h3>Tracking</h3>
              <p>Real-time tracking for all your shipments.</p>
            </div>
          </div>
        </section>

        <section className="web-design" id="web-design">
          <h2>Web Design Services</h2>
          <p>Professional web design and development for your business.</p>
          <div className="features-grid">
            <div className="feature-item">
              <h3>Responsive Design</h3>
              <p>Mobile-friendly websites that work on all devices.</p>
            </div>
            <div className="feature-item">
              <h3>Modern Technologies</h3>
              <p>Using the latest web technologies and frameworks.</p>
            </div>
            <div className="feature-item">
              <h3>SEO Optimized</h3>
              <p>Search engine optimized for better visibility.</p>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <h2>Contact Us</h2>
          <p>Get in touch with us for more information about our services.</p>
          <a href="mailto:info@newdomain.com" className="cta-button">Contact Us</a>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <p>&copy; 2024 New Domain. All rights reserved.</p>
          <ul className="footer-links">
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
