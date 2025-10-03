// src/components/Public Pannel/PingalwadaSection.jsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function PingalwadaSection() {
  const [pingalwadas, setPingalwadas] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch Pingalwadas from Firestore
  useEffect(() => {
    const fetchPingalwadas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pingalwada"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPingalwadas(data);
      } catch (error) {
        console.error("Error fetching pingalwadas:", error);
      }
    };
    fetchPingalwadas();
  }, []);

  // ✅ Navigate with Pingalwada credentials
  const handleRedirect = (pg, type) => {
    if (!pg) return;

    if (type === "donate") {
      navigate("/donate", { state: pg });   // ✅ go to Donation page
    } else if (type === "volunteer") {
      navigate("/volunteer", { state: pg }); // ✅ go to Volunteer page
    }
  };

  return (
    <section className="bg-light py-5 fade-in">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col lg={6} className="text-center">
            <h3>Pingalwadas 🏥</h3>
            <p>Registered Pingalwadas across regions.</p>
          </Col>
        </Row>
        <Row>
          {pingalwadas.length > 0 ? (
            pingalwadas.map((pg) => (
              <Col lg={4} md={6} key={pg.id} className="mb-4">
                <Card className="shadow-lg border-0 p-4 h-100 text-center pingalwada-card">
                  {/* ✅ Display Cloudinary Image with fallback */}
                  <Card.Img
                    variant="top"
                    src={
                      pg.cloudinaryId
                        ? `https://res.cloudinary.com/drnhffg1d/image/upload/${pg.cloudinaryId}`
                        : "/assets/img/default-pingalwada.jpg"
                    }
                    alt={pg.name || "Pingalwada"}
                    className="mb-3"
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />

                  <Card.Body>
                    <h5>{pg.name || "Unnamed Pingalwada"}</h5>
                    <p className="text-muted">
                      {pg.location || "Location not available"}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {pg.capacity || "N/A"}
                    </p>
                    <p>
                      <strong>Services:</strong>{" "}
                      {pg.services?.length > 0 ? pg.services.join(", ") : "N/A"}
                    </p>
                    <p>{pg.description || "No description provided."}</p>

                    {/* ✅ Action Buttons */}
                    <div className="d-flex justify-content-center gap-2 mt-3">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleRedirect(pg, "donate")}
                      >
                        Donate
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleRedirect(pg, "volunteer")}
                      >
                        Volunteer
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">No Pingalwadas added yet</p>
          )}
        </Row>
      </Container>
    </section>
  );
}
