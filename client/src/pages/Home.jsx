import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div className="hero-section">
        <header className="hero-header">
          <div className="logo">
            EcoMap
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#2ecc40" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: "0.3rem"}}>
              <path d="M12 2C10 10 2 12 2 12s2 8 10 10c8-2 10-10 10-10s-8-2-10-10z"/>
            </svg>
          </div>
          <nav>
            <Link to="/">Environment Map</Link>
            <Link to="/reports" style={{ marginLeft: "2rem" }}>Issue Reports</Link>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
          </nav>
        </header>
        <div className="hero-content">
          <h1>
            Together We Protect <br />
            Our <span className="green-text">Green Home</span>
          </h1>
          <p>
            Discover environmental issues and report them instantly. Government responds quickly, volunteers participate actively. Let's create a better living environment together.
          </p>
          <div className="hero-buttons">
            <Link to="/report" className="primary-btn">Report Issue Now</Link>
            <Link to="/" className="secondary-btn">View Environment Map</Link>
          </div>
        </div>
      </div>
      <section className="platform-features">
        <h2 className="features-title">Platform Features</h2>
        <p className="features-subtitle">Easy-to-use environmental monitoring platform</p>
        <div className="features-cards">
          <div className="feature-card feature-green">
            <div className="feature-icon">
              {/* Location Icon */}
              <svg width="32" height="32" fill="#21b573" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            </div>
            <h3>Quick Location Reporting</h3>
            <p>Precisely mark problem locations on the map, upload photos and detailed descriptions for quick understanding by relevant departments</p>
          </div>
          <div className="feature-card feature-blue">
            <div className="feature-icon">
              {/* Government Icon */}
              <svg width="32" height="32" fill="#2979ff" viewBox="0 0 24 24"><path d="M12 2L2 7v2h20V7L12 2zm0 2.18L18.09 7H5.91L12 4.18zM4 10v10h16V10H4zm2 2h2v6H6v-6zm4 0h2v6h-2v-6zm4 0h2v6h-2v-6z"/></svg>
            </div>
            <h3>Government Quick Response</h3>
            <p>Relevant departments handle issues promptly, update resolution progress, ensuring every environmental problem gets proper attention</p>
          </div>
          <div className="feature-card feature-orange">
            <div className="feature-icon">
              {/* Volunteer Icon */}
              <svg width="32" height="32" fill="#ff7043" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <h3>Volunteer Participation</h3>
            <p>Volunteers can participate in problem resolution, upload progress photos, and work together to maintain a beautiful environment</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;