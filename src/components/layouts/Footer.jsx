import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaDribbble, FaInstagram, FaHeart } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-5">
      <Container>
        <Row className="mb-4">
          {/* Logo & About */}
          <Col md={4}>
            <div className="mb-3">
              <img src="/assets/img/footer_logo.png" alt="Logo" width="180" />
            </div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </p>
            <div className="d-flex gap-3 fs-4">
              <a href="#" className="text-light"><FaFacebook /></a>
              <a href="#" className="text-light"><FaTwitter /></a>
              <a href="#" className="text-light"><FaDribbble /></a>
              <a href="#" className="text-light"><FaInstagram /></a>
            </div>
          </Col>

          {/* Services */}
          <Col md={2}>
            <h5 className="fw-bold">Services</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Donate</a></li>
              <li><a href="#" className="text-light text-decoration-none">Sponsor</a></li>
              <li><a href="#" className="text-light text-decoration-none">Fundraise</a></li>
              <li><a href="#" className="text-light text-decoration-none">Volunteer</a></li>
              <li><a href="#" className="text-light text-decoration-none">Partner</a></li>
              <li><a href="#" className="text-light text-decoration-none">Jobs</a></li>
            </ul>
          </Col>

          {/* Contacts */}
          <Col md={3}>
            <h5 className="fw-bold">Contacts</h5>
            <p>
              +2(305) 587-3407 <br />
              info@loveuscharity.com <br />
              Flat 20, Reynolds Neck, North Helenaville, FV77 8WS
            </p>
          </Col>

          {/* Top News */}
          <Col md={3}>
            <h5 className="fw-bold">Top News</h5>
            <div className="d-flex mb-3">
              <img src="/assets/img/news/news_1.png" alt="News" width="60" className="me-2 rounded" />
              <div>
                <a href="#" className="text-light text-decoration-none">
                  <h6 className="mb-1">School for African Children</h6>
                </a>
                <small>Jun 12, 2019</small>
              </div>
            </div>
            <div className="d-flex">
              <img src="/assets/img/news/news_2.png" alt="News" width="60" className="me-2 rounded" />
              <div>
                <a href="#" className="text-light text-decoration-none">
                  <h6 className="mb-1">Education Support Program</h6>
                </a>
                <small>Jun 15, 2019</small>
              </div>
            </div>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="pt-3 border-top">
          <Col className="text-center">
            <p className="mb-0">
              Made with <FaHeart className="text-danger" /> by{" "}
              <a href="https://colorlib.com" className="text-warning text-decoration-none" target="_blank" rel="noreferrer">
                
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}