import { Card, ProgressBar, Button, Row, Col, Container, Alert } from "react-bootstrap";
import { urgentNeeds } from "../PublicPannel/UrgentNeeds";
import { useNavigate } from "react-router-dom";

export default function UrgentNeeds() {
  const nav = useNavigate();

  // Handler for donation redirect
  const handleContribute = (need) => {
    // Pass selected item as state to Donation page
    nav("/donate", { state: { item: need.item, suggestedAmount: need.required - need.received } });
  };

  return (
    <Container id="needs" className="py-5">
      <h2 className="text-center mb-4 fw-bold text-success">Urgent Needs</h2>

      {urgentNeeds.length === 0 ? (
        <Alert variant="info" className="text-center">
          🎉 All urgent needs are currently fulfilled. Thank you for your support!
        </Alert>
      ) : (
        <Row>
          {urgentNeeds.map((need) => {
            const progress = Math.round((need.received / need.required) * 100);

            return (
              <Col key={need.id} md={4} className="mb-4">
                <Card
                  className={`shadow-sm h-100 border-3 ${
                    need.priority === "High" ? "border-danger" : "border-light"
                  }`}
                >
                  {/* Item Image */}
                  <Card.Img
                    variant="top"
                    src={need.image}
                    alt={need.item}
                    style={{ height: "150px", objectFit: "contain", padding: "20px" }}
                  />
                  <Card.Body>
                    <Card.Title>{need.item}</Card.Title>
                    <Card.Text className="text-muted small">{need.description}</Card.Text>

                    {/* Progress */}
                    <p className="mb-1">
                      <strong>{need.received}</strong> / {need.required} fulfilled
                    </p>
                    <ProgressBar
                      now={progress}
                      label={`${progress}%`}
                      variant={
                        progress < 50 ? "danger" : progress < 80 ? "warning" : "success"
                      }
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
                    <Button
                      variant="success"
                      className="w-100"
                      onClick={() => handleContribute(need)}
                      disabled={progress >= 100}
                    >
                      {progress >= 100 ? "Fulfilled ✅" : "Contribute"}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}
