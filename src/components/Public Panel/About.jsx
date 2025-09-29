import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaPinterest, FaLinkedin, FaHeart, FaUsers, FaCalendarAlt, FaHandsHelping } from "react-icons/fa";

export default function About() {
  return (
    <>
      {/* Hero / Banner */}
      <div className="bg-dark text-white d-flex align-items-center justify-content-center" style={{ height: "250px" }}>
        <h2>About Us</h2>
      </div>

      {/* Reason of Helping */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col lg={6} className="text-center">
              <h3>Reason of Helping</h3>
            </Col>
          </Row>
          <Row className="text-center">
            <Col lg={4} md={6} className="mb-4">
              <img src="/assets/img/help/1.png" alt="" className="mb-3" />
              <h4>Collecting Fund</h4>
              <p>Lorem ipsum is dummy text used in laying out print.</p>
              <a href="#">Read More</a>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <img src="/assets/img/help/2.png" alt="" className="mb-3" />
              <h4>Medical Support</h4>
              <p>Lorem ipsum is dummy text used in laying out print.</p>
              <a href="#">Read More</a>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <img src="/assets/img/help/3.png" alt="" className="mb-3" />
              <h4>Education Support</h4>
              <p>Lorem ipsum is dummy text used in laying out print.</p>
              <a href="#">Read More</a>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Activities Section */}
      <section className="bg-light py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <h3>Watch Our Latest Activities</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <Button variant="warning">Donate Now</Button>
            </Col>
            <Col lg={5} className="text-center">
              <a href="https://www.youtube.com/watch?v=MG3jGHnBVQs" target="_blank" rel="noreferrer">
                <img src="/assets/img/video-placeholder.png" alt="video" width="100%" />
              </a>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Counters */}
      <section className="py-5 text-white" style={{ background: "#222" }}>
        <Container>
          <Row>
            <Col md={3} className="text-center mb-4">
              <FaCalendarAlt size={40} />
              <h3>120</h3>
              <p>Finished Events</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <FaHeart size={40} />
              <h3>200+</h3>
              <p>People Helped</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <FaUsers size={40} />
              <h3>80</h3>
              <p>Volunteers</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <FaHandsHelping size={40} />
              <h3>50+</h3>
              <p>Ongoing Projects</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Volunteers */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col lg={6} className="text-center">
              <h3>Our Volunteers</h3>
            </Col>
          </Row>
          <Row>
            <Col lg={4} md={6} className="text-center mb-4">
              <img src="/assets/img/volenteer/1.png" alt="" className="mb-3 rounded-circle" width="150" />
              <h4>Sakil Khan</h4>
              <p>Donor</p>
              <div className="d-flex justify-content-center gap-3">
                <FaFacebook /><FaPinterest /><FaLinkedin /><FaTwitter />
              </div>
            </Col>
            <Col lg={4} md={6} className="text-center mb-4">
              <img src="/assets/img/volenteer/2.png" alt="" className="mb-3 rounded-circle" width="150" />
              <h4>Emran Ahmed</h4>
              <p>Volunteer</p>
              <div className="d-flex justify-content-center gap-3">
                <FaFacebook /><FaPinterest /><FaLinkedin /><FaTwitter />
              </div>
            </Col>
            <Col lg={4} md={6} className="text-center mb-4">
              <img src="/assets/img/volenteer/3.png" alt="" className="mb-3 rounded-circle" width="150" />
              <h4>Sabbir Ahmed</h4>
              <p>Volunteer</p>
              <div className="d-flex justify-content-center gap-3">
                <FaFacebook /><FaPinterest /><FaLinkedin /><FaTwitter />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Donation Form */}
      <section className="bg-light py-5">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col lg={6} className="text-center">
              <h3>Make a Donation</h3>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col lg={6}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Donation Amount</Form.Label>
                  <Form.Control type="number" placeholder="Enter amount" />
                </Form.Group>
                <div className="d-flex gap-3 mb-3">
                  <Form.Check type="radio" label="$10" name="donation" />
                  <Form.Check type="radio" label="$30" name="donation" />
                  <Form.Check type="radio" label="Other" name="donation" />
                </div>
                <Button variant="danger" className="w-100">Donate Now</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}