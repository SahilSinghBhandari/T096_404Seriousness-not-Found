// src/components/Public Pannel/Volunteer.jsx
import React, { useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Webcam from "react-webcam";

// Firebase Firestore
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useLocation } from "react-router-dom";

const Volunteer = () => {
  const [image, setImage] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const webcamRef = useRef(null);

  // ✅ Get Pingalwada info from navigation state
  const location = useLocation();
  const pingalwada = location.state;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    availability: "",
    interests: [],
  });

  // ✅ Capture photo from webcam
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setShowCamera(false);
  };

  // ✅ Handle gallery upload
  const handleGallery = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
    setShowOptions(false);
  };

  // ✅ Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle checkbox
  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    let updatedInterests = [...formData.interests];
    if (checked) {
      updatedInterests.push(value);
    } else {
      updatedInterests = updatedInterests.filter((i) => i !== value);
    }
    setFormData({ ...formData, interests: updatedInterests });
  };

  // ✅ Submit form (store in Firestore under Pingalwada subcollection)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.availability ||
      !formData.message
    ) {
      toast.warn("⚠️ Please fill all required fields including your message.");
      return;
    }

    if (!image) {
      toast.warn("⚠️ Please upload or capture your photo before submitting.");
      return;
    }

    if (!pingalwada?.id) {
      toast.error("❌ Pingalwada info missing. Please go back and try again.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Store under pingalwada/{pingalwadaId}/volunteers
      await addDoc(
        collection(db, "pingalwada", pingalwada.id, "volunteers"),
        {
          ...formData,
          image, // base64 string
          pingalwadaId: pingalwada.id,
          pingalwadaName: pingalwada.name,
          createdAt: serverTimestamp(),
        }
      );

      setLoading(false);
      setSubmitted(true);
      toast.success("🎉 Volunteer registered successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        availability: "",
        interests: [],
      });
      setImage(null);
    } catch (error) {
      setLoading(false);
      console.error("Error saving volunteer:", error);
      toast.error("❌ Something went wrong, please try again.");
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={7}>
          {!submitted ? (
            <Card className="shadow-lg border-0 p-4">
              <h2 className="text-center text-success mb-4">
                Volunteer at {pingalwada?.name || "Pingalwada"} 🤝
              </h2>

              {/* Profile Image Upload */}
              <div className="text-center mb-4">
                <div
                  className={`rounded-circle border d-inline-block overflow-hidden ${
                    !image ? "border-danger" : ""
                  }`}
                  style={{
                    width: "120px",
                    height: "120px",
                    cursor: "pointer",
                    background: "#f0f0f0",
                  }}
                  onClick={() => setShowOptions(true)}
                >
                  {image ? (
                    <img
                      src={image}
                      alt="profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <i className="bi bi-person-circle fs-1 text-muted mt-4"></i>
                  )}
                </div>
                <p className="text-muted small mt-2">
                  {image
                    ? "Photo selected ✅"
                    : "Click to add your photo (Required)"}
                </p>
              </div>

              {/* Volunteer Form */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your phone number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Availability *</Form.Label>
                  <Form.Select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Availability --</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Weekends">Weekends</option>
                    <option value="Anytime">Anytime</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Area of Interest</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Teaching"
                      type="checkbox"
                      value="Teaching"
                      checked={formData.interests.includes("Teaching")}
                      onChange={handleCheckbox}
                    />
                    <Form.Check
                      inline
                      label="Fundraising"
                      type="checkbox"
                      value="Fundraising"
                      checked={formData.interests.includes("Fundraising")}
                      onChange={handleCheckbox}
                    />
                    <Form.Check
                      inline
                      label="Medical Help"
                      type="checkbox"
                      value="Medical Help"
                      checked={formData.interests.includes("Medical Help")}
                      onChange={handleCheckbox}
                    />
                    <Form.Check
                      inline
                      label="Event Management"
                      type="checkbox"
                      value="Event Management"
                      checked={formData.interests.includes("Event Management")}
                      onChange={handleCheckbox}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Why do you want to volunteer? *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write your message..."
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Submit Application ✅"
                    )}
                  </Button>
                </div>
              </Form>
            </Card>
          ) : (
            <Alert variant="success" className="text-center p-5 shadow-lg">
              <h3>🎉 Thank you for registering as a Volunteer!</h3>
              <p>We will get in touch with you shortly.</p>
              <Button variant="primary" onClick={() => setSubmitted(false)}>
                Register Another Volunteer
              </Button>
            </Alert>
          )}
        </Col>
      </Row>

      {/* Options Modal */}
      <Modal show={showOptions} onHide={() => setShowOptions(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Button
            className="m-2"
            variant="primary"
            onClick={() => {
              setShowOptions(false);
              setShowCamera(true);
            }}
          >
            Open Camera 📷
          </Button>

          <label className="btn btn-success m-2">
            Select from Gallery 🖼
            <input type="file" accept="image/*" hidden onChange={handleGallery} />
          </label>
        </Modal.Body>
      </Modal>

      {/* Camera Modal */}
      <Modal show={showCamera} onHide={() => setShowCamera(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Take a Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={480}
            height={360}
            videoConstraints={{ facingMode: "user" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCamera(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={capture}>
            Capture ✅
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Volunteer;
