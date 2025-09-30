
import { Card, ProgressBar, Button, Row, Col, Container } from "react-bootstrap";
import { urgentNeeds } from "./components/Public Panel/urgentNeedsData";

export default function UrgentNeeds() {
  return (
    <Container id="needs" className="py-5">
      <h2 className="text-center mb-4 fw-bold text-success">Urgent Needs</h2>
      <Row>
        {urgentNeeds.map((need) => {
          const progress = Math.round((need.received / need.required) * 100);

          return (
            <Col key={need.id} md={4} className="mb-4">
              <Card className="shadow-sm h-100">
                {/* Item Image */}
                <Card.Img
                  variant="top"
                  src={need.image}
                  alt={need.item}
                  style={{ height: "150px", objectFit: "contain", padding: "20px" }}
                />
                <Card.Body>
                  <Card.Title>{need.item}</Card.Title>
                  <Card.Text className="text-muted small">
                    {need.description}
                  </Card.Text>

                  {/* Progress */}
                  <p className="mb-1">
                    <strong>{need.received}</strong> / {need.required} fulfilled
                  </p>
                  <ProgressBar
                    now={progress}
                    label={`${progress}%`}
                    variant={progress < 50 ? "danger" : progress < 80 ? "warning" : "success"}
                    className="mb-3"
                  />

                  {/* Priority */}
                  <p>
                    Priority:{" "}
                    <span
                      className={`badge ${
                        need.priority === "High"
                          ? "bg-danger"
                          : need.priority === "Medium"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {need.priority}
                    </span>
                  </p>

                  {/* Contribute Button */}
                  <Button variant="success" className="w-100">
                    Contribute
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}