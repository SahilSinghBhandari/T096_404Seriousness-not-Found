import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Modal, Form } from "react-bootstrap";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Jobs() {
  const [jobsByCategory, setJobsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    message: "",
  });


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const jobs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

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


  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowForm(true);
  };


  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      await addDoc(collection(db, "applications"), {
        ...formData,
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        createdAt: serverTimestamp(),
      });

      toast.success("✅ Application submitted successfully!");
      setShowForm(false);


      setFormData({ name: "", email: "", phone: "", skills: "", message: "" });
    } catch (error) {
      console.error("❌ Error submitting application:", error);
      toast.error("Failed to submit application. Try again.");
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-center text-primary mb-4">Volunteer Opportunities at AshaDeep🤝</h2>

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
                        onClick={() => handleApplyClick(job)}
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

      {/* ✅ Application Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Apply for {selectedJob?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleApplicationSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Skills</Form.Label>
              <Form.Control
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Why do you want to join?</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" variant="success" className="w-100">
              Submit Application
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}