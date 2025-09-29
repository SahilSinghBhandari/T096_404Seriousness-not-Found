import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";

export default function PublicPanel() {
  return (
    <div>
      {/* Top Info Bar */}
      <div className="bg-light text-dark py-2 border-bottom">
        <Container className="d-flex justify-content-between small">
          <div>
            <FaClock className="me-2" />
            Mon - Sat: 6.00 am - 10.00 pm, Sunday Closed
          </div>
          <div>
            <FaEnvelope className="me-2" /> info@pingalwara.org{" "}
            <FaPhoneAlt className="ms-4 me-2" /> +91 98765 43210
          </div>
        </Container>
      </div>

      {/* Navbar */}
      <Navbar expand="lg" bg="white" className="shadow-sm py-3">
        <Container>
          <Navbar.Brand href="#">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/6/64/Pingalwara_logo.png"
              alt="Logo"
              height="40"
              className="me-2"
            />
            <span className="fw-bold text-primary">Pingalwara</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto me-3 fw-semibold">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">About</Nav.Link>
              <Nav.Link href="#">Services</Nav.Link>
              <Nav.Link href="#">Donate</Nav.Link>
              <Nav.Link href="#">Contact</Nav.Link>
            </Nav>
            <Button variant="primary" className="fw-semibold px-4">
              Contribute
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <header
        className="text-white text-center d-flex align-items-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/6646915/pexels-photo-6646915.jpeg')",
          height: "500px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* Dark Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 80, 0.6)",
          }}
        ></div>

        {/* Content */}
        <Container style={{ position: "relative", zIndex: 2 }}>
          <p className="fw-semibold text-uppercase">Help the Needy</p>
          <h1 className="display-4 fw-bold mb-4">
            Together We Can Make a Difference
          </h1>
          <div>
            <Button variant="primary" size="lg" className="me-3 fw-semibold">
              Donate Now
            </Button>
            <Button variant="warning" size="lg" className="fw-semibold">
              Volunteer
            </Button>
          </div>
        </Container>
      </header>
    </div>
  );
}