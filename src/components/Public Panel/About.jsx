import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import {
  FaHeart,
  FaUsers,
  FaCalendarAlt,
  FaHandsHelping,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import PingalwadaSection from "./PingalwadaSection";



export default function About() {
  const [donators, setDonators] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [pingalwadas, setPingalwadas] = useState([]);

  // ✅ Fetch payments (donators)
  useEffect(() => {
    const fetchDonators = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "payments"));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setDonators(data.filter((d) => d.message));
      } catch (error) {
        console.error("Error fetching donators:", error);
      }
    };
    fetchDonators();
  }, []);

  // ✅ Fetch volunteers
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "volunteers"));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setVolunteers(data.filter((v) => v.message));
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };
    fetchVolunteers();
  }, []);

  // ✅ Fetch Pingalwadas
  useEffect(() => {
    const fetchPingalwadas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pingalwada"));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setPingalwadas(data);
      } catch (error) {
        console.error("Error fetching pingalwadas:", error);
      }
    };
    fetchPingalwadas();
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
          .hover-card, .volunteer-card, .donator-card, .pingalwada-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .hover-card:hover, .volunteer-card:hover, .donator-card:hover, .pingalwada-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          }
          .zoom-img { transition: transform 0.4s ease; }
          .zoom-img:hover { transform: scale(1.05); }
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

      {/* Volunteers Section */}
      <section className="py-5 fade-in">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col lg={6} className="text-center">
              <h3>Our Volunteers 🤝</h3>
              <p>Heartfelt messages and support from our volunteers.</p>
            </Col>
          </Row>
          <Row>
            {volunteers.length > 0 ? (
              volunteers.map((vol, index) => (
                <Col lg={4} md={6} key={index} className="mb-4">
                  <Card className="shadow-lg border-0 p-4 h-100 text-center volunteer-card">
                    <Card.Body>
                      <p className="fst-italic">“{vol.message}”</p>
                      <h5 className="mt-3">{vol.name || "Anonymous"}</h5>
                      <p className="text-muted">{vol.email}</p>
                      <p><strong>Availability:</strong> {vol.availability}</p>
                      {vol.interests?.length > 0 && (
                        <p><strong>Interests:</strong> {vol.interests.join(", ")}</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="text-center">No volunteers yet</p>
            )}
          </Row>
        </Container>
      </section>

      {/* Pingalwada Section */}
<PingalwadaSection />
    </>
  );
}
