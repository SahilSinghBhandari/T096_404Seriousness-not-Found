import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import {
  FaFacebook,
  FaTwitter,
  FaPinterest,
  FaLinkedin,
  FaHeart,
  FaUsers,
  FaCalendarAlt,
  FaHandsHelping,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function About() {
  const [donators, setDonators] = useState([]);

  // ✅ Fetch payments (donators) from Firestore
  useEffect(() => {
    const fetchDonators = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "payments"));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setDonators(data.filter((d) => d.message)); // only with message
      } catch (error) {
        console.error("Error fetching donators:", error);
      }
    };
    fetchDonators();
  }, []);

  // ✅ Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      {/* Inline CSS */}
      <style>
        {`
          .hover-card, .volunteer-card, .donator-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .hover-card:hover, .volunteer-card:hover, .donator-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          }

          .zoom-img { transition: transform 0.4s ease; }
          .zoom-img:hover { transform: scale(1.05); }

          .social-icons svg {
            cursor: pointer;
            transition: color 0.3s ease, transform 0.3s ease;
          }
          .social-icons svg:hover {
            color: #f39c12;
            transform: scale(1.2);
          }

          .icon-hover {
            transition: transform 0.3s ease, color 0.3s ease;
          }
          .icon-hover:hover {
            transform: scale(1.3);
            color: #f39c12;
          }

          .fade-in {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 1s ease forwards;
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .custom-btn {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .custom-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          }
        `}
      </style>

      {/* Hero / Banner */}
      <div
        className="bg-dark text-white d-flex align-items-center justify-content-center fade-in"
        style={{ height: "250px" }}
      >
        <h2>About Us</h2>
      </div>

      {/* Reason of Helping */}
      <section className="py-5 fade-in">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col lg={6} className="text-center">
              <h3>Reason of Helping</h3>
            </Col>
          </Row>
          <Row className="text-center">
            <Col lg={4} md={6} className="mb-4 hover-card">
              <img src="/assets/img/help/1.png" alt="" className="mb-3 zoom-img" />
              <h4>Collecting Fund</h4>
              <p>Every penny brings hope for those in need.</p>
              <Button variant="warning" className="custom-btn">Donate Now</Button>
            </Col>
            <Col lg={4} md={6} className="mb-4 hover-card">
              <img src="/assets/img/help/2.png" alt="" className="mb-3 zoom-img" />
              <h4>Medical Support</h4>
              <p>Saving lives, one step at a time.</p>
              <Link to="/medical">
                <Button variant="success" className="custom-btn">Support a Patient</Button>
              </Link>
            </Col>
            <Col lg={4} md={6} className="mb-4 hover-card">
              <img src="/assets/img/help/3.png" alt="" className="mb-3 zoom-img" />
              <h4>Education Support</h4>
              <p>Empowering children for a brighter tomorrow.</p>
              <Button variant="primary" className="custom-btn">Sponsor a Child</Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Donators Section */}
      <section className="bg-light py-5 fade-in">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col lg={6} className="text-center">
              <h3>Our Donators ❤️</h3>
              <p>Messages of love and support from our generous donors.</p>
            </Col>
          </Row>
          <Slider {...settings}>
            {donators.length > 0 ? (
              donators.map((donor, index) => (
                <div key={index} className="px-3">
                  <Card className="shadow-lg border-0 p-3 donator-card h-100 text-center">
                    <Card.Body>
                      <p className="fst-italic">“{donor.message}”</p>
                      <h5 className="mt-3">{donor.donorName || "Anonymous"}</h5>
                      <p className="text-muted">
                        {donor.donorCity || ""} {donor.donorState ? `, ${donor.donorState}` : ""}
                      </p>
                    </Card.Body>
                  </Card>
                </div>
              ))
            ) : (
              <p className="text-center">No donors yet</p>
            )}
          </Slider>
        </Container>
      </section>

      {/* Activities Section */}
      <section className="bg-light py-5 fade-in">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <h3>Watch Our Latest Activities</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </Col>
            <Col lg={5} className="text-center video-box">
              <a
                href="https://www.youtube.com/watch?v=MG3jGHnBVQs"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/assets/img/video-placeholder.png"
                  alt="video"
                  width="100%"
                  className="zoom-img"
                />
              </a>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Counters */}
      <section className="py-5 text-white fade-in" style={{ background: "#222" }}>
        <Container>
          <Row>
            <Col md={3} className="text-center mb-4 counter-box">
              <FaCalendarAlt size={40} className="icon-hover" />
              <h3>120</h3>
              <p>Finished Events</p>
            </Col>
            <Col md={3} className="text-center mb-4 counter-box">
              <FaHeart size={40} className="icon-hover" />
              <h3>200+</h3>
              <p>People Helped</p>
            </Col>
            <Col md={3} className="text-center mb-4 counter-box">
              <FaUsers size={40} className="icon-hover" />
              <h3>80</h3>
              <p>Volunteers</p>
            </Col>
            <Col md={3} className="text-center mb-4 counter-box">
              <FaHandsHelping size={40} className="icon-hover" />
              <h3>50+</h3>
              <p>Ongoing Projects</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Volunteers */}
      <section className="py-5 fade-in">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col lg={6} className="text-center">
              <h3>Our Volunteers</h3>
            </Col>
          </Row>
          <Row>
            <Col lg={4} md={6} className="text-center mb-4 volunteer-card">
              <img
                src="/assets/img/volenteer/1.png"
                alt=""
                className="mb-3 rounded-circle zoom-img"
                width="150"
              />
              <h4>Sakil Khan</h4>
              <p>Donor</p>
              <div className="d-flex justify-content-center gap-3 social-icons">
                <FaFacebook />
                <FaPinterest />
                <FaLinkedin />
                <FaTwitter />
              </div>
            </Col>
            <Col lg={4} md={6} className="text-center mb-4 volunteer-card">
              <img
                src="/assets/img/volenteer/2.png"
                alt=""
                className="mb-3 rounded-circle zoom-img"
                width="150"
              />
              <h4>Emran Ahmed</h4>
              <p>Volunteer</p>
              <div className="d-flex justify-content-center gap-3 social-icons">
                <FaFacebook />
                <FaPinterest />
                <FaLinkedin />
                <FaTwitter />
              </div>
            </Col>
            <Col lg={4} md={6} className="text-center mb-4 volunteer-card">
              <img
                src="/assets/img/volenteer/3.png"
                alt=""
                className="mb-3 rounded-circle zoom-img"
                width="150"
              />
              <h4>Sabbir Ahmed</h4>
              <p>Volunteer</p>
              <div className="d-flex justify-content-center gap-3 social-icons">
                <FaFacebook />
                <FaPinterest />
                <FaLinkedin />
                <FaTwitter />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
