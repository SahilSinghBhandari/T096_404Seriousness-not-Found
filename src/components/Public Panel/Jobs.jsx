import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
  const [jobsByCategory, setJobsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  // ✅ Fetch jobs and group by category
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const jobs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Group jobs by category
        const grouped = jobs.reduce((acc, job) => {
          const category = job.category || "Other";
          if (!acc[category]) acc[category] = [];
          acc[category].push(job);
          return acc;
        }, {});

        setJobsByCategory(grouped);
      } catch (error) {
        console.error("❌ Error fetching jobs:", error);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  // ✅ Handle Apply button
  const handleApply = (job) => {
    nav("/volunteer", { state: { job } });
  };

  return (
    <Container className="py-5">
      <h2 className="text-center text-primary mb-4">Volunteer Opportunities 🤝</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading opportunities...</p>
        </div>
      ) : Object.keys(jobsByCategory).length === 0 ? (
        <p className="text-center">
          No volunteer opportunities available right now. Please check back later.
        </p>
      ) : (
        Object.keys(jobsByCategory).map((category) => (
          <div key={category} className="mb-5">
            <h3 className="text-success mb-4">{category} Jobs</h3>
            <Row>
              {jobsByCategory[category].map((job) => (
                <Col md={6} lg={4} key={job.id} className="mb-4">
                  <Card className="shadow-sm border-0 h-100">
                    <Card.Body>
                      <Card.Title className="text-primary">{job.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {job.category}
                      </Card.Subtitle>
                      <Card.Text>{job.description}</Card.Text>
                      <ul>
                        <li><strong>📍 Location:</strong> {job.location}</li>
                        <li><strong>⏳ Time Commitment:</strong> {job.time}</li>
                        <li><strong>🛠 Skills Required:</strong> {job.skills}</li>
                      </ul>
                      <Button
                        variant="primary"
                        className="mt-2"
                        onClick={() => handleApply(job)}
                      >
                        Apply Now
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))
      )}
    </Container>
  );
}