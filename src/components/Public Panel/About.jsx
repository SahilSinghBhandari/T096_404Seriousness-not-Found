import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Form, Image, Modal } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import PingalwadaSection from "./PingalwadaSection";

export default function About() {
  const [pingalwadas, setPingalwadas] = useState([]);
  const [showVideo, setShowVideo] = useState(false);

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

  // ✅ Project Data
  const projects = [
    {
      title: "Patients",
      image: "./assets/img/p.jpg",
      description:
        "At present there are over 1804 patients who are destitute and most of them are going to spend their entire life in Pingalwara.",
      points: ["8 Branches", "Old Age Home", "Play Room", "Sensory Room"],
    },
    {
      title: "Education",
      image: "./assets/img/e.png",
      description:
        "Pingalwara provides education to 775 poor and needy slum-dwelling children from nearby villages.",
      points: ["Free Education", "Free Books & Uniform", "Free Transport", "100% Result"],
    },
    {
      title: "Medical Facilities",
      image: "./assets/img/h.jpg",
      description:
        "A medical laboratory and dispensary has been established for the treatment of patients.",
      points: ["Dispensary & Lab", "Dental Clinic", "Operation Theatre", "Homeopathy"],
    },
    {
      title: "Printing Press",
      image: "./assets/img/cel.jpg",
      description:
        "Puran Printing Press provides free literature regarding Religion, Social Issues, Economics, Heritage & Health.",
      points: ["50,000 pages/day", "80 Books Annually", "Expenditure: Rs. 3.80 crore"],
    },
  ];

  return (
    <>
      {/* ✅ Hero Section */}
      <div style={{ background: "#f8f9fa", padding: "60px 20px" }}>
        <Container>
          <Row className="align-items-center">
            {/* Left Side - Motivation Lines */}
            <Col md={6} className="mb-4 mb-md-0">
              <h1 className="fw-bold text-dark">
                "Service to Humanity, <br /> is Service to God"
              </h1>
              <p className="text-muted fs-5 mt-3">
                Pingalwara, founded by <strong>Bhagat Puran Singh Ji</strong>,  
                stands as a beacon of hope for the helpless, the destitute, and the sick.  
                We believe every life deserves dignity, compassion, and care.  
              </p>

              <div className="d-flex gap-3 mt-4">
                <Button variant="success" size="lg">
                  Join Our Mission
                </Button>
                <Button variant="outline-success" size="lg" onClick={() => setShowVideo(true)}>
                  🎬 Watch Story
                </Button>
              </div>
            </Col>

            {/* Right Side - Image Grid */}
            <Col md={6} className="text-center">
              <Row>
                <Col xs={6} className="mb-3">
                  <Image
                    src="./assets/img/11.jpg"
                    alt="Pingalwara Children"
                    fluid
                    rounded
                    style={{ borderRadius: "15px", height: "200px", objectFit: "cover" }}
                  />
                </Col>
                <Col xs={6} className="mb-3">
                  <Image
                    src="./assets/img/12.jpg"
                    alt="Helping Patients"
                    fluid
                    rounded
                    style={{ borderRadius: "15px", height: "200px", objectFit: "cover" }}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <Image
                    src="./assets/img/13..jpg"
                    alt="Education Support"
                    fluid
                    rounded
                    style={{ borderRadius: "15px", height: "200px", objectFit: "cover" }}
                  />
                </Col>
                <Col xs={6}>
                  <Image
                    src="./assets/img/14.jpg"
                    alt="Medical Aid"
                    fluid
                    rounded
                    style={{ borderRadius: "15px", height: "200px", objectFit: "cover" }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      {/* 🎥 Modal for Video */}
      <Modal show={showVideo} onHide={() => setShowVideo(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Pingalwada Documentary 🎥</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="ratio ratio-16x9">
            <iframe
              src="https://www.youtube.com/embed/jBVqYpEYRGw"
              title="Pingalwada Documentary"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </Modal.Body>
      </Modal>

      {/* ✅ Existing Pingalwada Section */}
      <PingalwadaSection />

      {/* ✅ OUR PROJECTS SECTION */}
      <Container className="py-5">
        <h2 className="text-center text-white bg-primary py-2 mb-4 rounded">OUR PROJECTS</h2>
        <Row>
          {projects.map((project, idx) => (
            <Col md={6} lg={3} key={idx} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={project.image}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="text-primary">{project.title}</Card.Title>
                  <Card.Text>{project.description}</Card.Text>
                  <ul>
                    {project.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
