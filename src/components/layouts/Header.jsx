
import { FaPhone, FaEnvelope, FaFacebook, FaPinterest, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      {/* Top Bar */}
      <div className="bg-light border-bottom py-2">
        <Container className="d-flex justify-content-between small">
          <div>
            <FaPhone className="me-2" /> +1 (454) 556-5656
            <FaEnvelope className="ms-4 me-2" /> Yourmail@gmail.com
          </div>
          <div>
            <a href="#"><FaFacebook className="me-3" /></a>
            <a href="#"><FaPinterest className="me-3" /></a>
            <a href="#"><FaLinkedin className="me-3" /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </Container>
      </div>

      {/* Navbar */}
      <Navbar expand="lg" bg="white" className="shadow-sm py-3">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src="/assets/img/logo.png" alt="Logo" height="40" className="me-2" />
            <span className="fw-bold text-primary">Pingalwara</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto fw-semibold">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              
              <NavDropdown title="Blog" id="blog-dropdown">
                <NavDropdown.Item as={Link} to="/blog">Blog</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/single-blog">Single Blog</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Pages" id="pages-dropdown">
                <NavDropdown.Item as={Link} to="/elements">Elements</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/cause">Cause</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            </Nav>

            <Button variant="primary" className="ms-3 fw-semibold">Make a Donate</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
