import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(90deg, #1e3c72, #2a5298)", // matches your sidebar
        color: "white",
        padding: "40px 0 20px",
        marginTop: "40px",
      }}
    >
      <Container>
        <Row className="mb-4">
          {/* About Ashadeep */}
          <Col md={4}>
            <h5 className="fw-bold">🌼 Pingalwara Care Foundation</h5>
            <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
              A digital initiative of Pingalwara to spread kindness, 
              connect volunteers, and support those in need.  
              Together, we build hope and compassion. 💙
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4}>
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled" style={{ fontSize: "14px" }}>
              <li><Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link></li>
              <li><Link to="/donate" style={{ color: "white", textDecoration: "none" }}>Donate</Link></li>
              <li><Link href="/volunteer" style={{ color: "white", textDecoration: "none" }}>Volunteer</Link></li>
              <li><Link to="/job" style={{ color: "white", textDecoration: "none" }}>Job Opportunities</Link></li>
              {/* <li><a href="/contact" style={{ color: "white", textDecoration: "none" }}>Contact</a></li> */}
            </ul>
          </Col>

          {/* Social Media */}
          <Col md={4}>
            <h5 className="fw-bold">Connect With Us</h5>
            <div className="d-flex gap-3 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <FaFacebook size={22} color="white" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <FaTwitter size={22} color="white" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <FaInstagram size={22} color="white" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <FaLinkedin size={22} color="white" />
              </a>
            </div>
          </Col>
        </Row>

        <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />

        {/* Bottom Line */}
        <Row>
          <Col className="text-center" style={{ fontSize: "13px" }}>
            © {new Date().getFullYear()} Pingalwara Care Foundation. 
            Made with <FaHeart color="red" /> for humanity.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}