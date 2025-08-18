import "./Home.css"; // Create this file for custom styles
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="hero-section">
      <header className="hero-header">
        <div className="logo">EcoMap</div>
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
  );
}

export default Home;