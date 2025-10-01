import React, { useState, useRef } from "react";
import { Container, Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Webcam from "react-webcam";

const Volunter= () => {
  const [image, setImage] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);

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
    setImage(dataURLtoFile(imageSrc, "webcam.jpg"));
    setShowCamera(false);
  };

  // ✅ Convert base64 → File
  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  // ✅ Handle gallery upload
  const handleGallery = (e) => {
    setImage(e.target.files[0]);
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

  // ✅ Submit form (Image required check)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.availability) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    if (!image) {
      toast.error("⚠️ Please upload or capture your photo before submitting.");
      return;
    }

    console.log("Volunteer Data:", {
      ...formData,
      image,
    });

    alert("🎉 Thank you for registering as a volunteer!");
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      availability: "",
      interests: [],
    });
    setImage(null);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={7}>
          <Card className="shadow-lg border-0 p-4">
            <h2 className="text-center text-success mb-4">
              Become a Volunteer 🤝
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
                    src={URL.createObjectURL(image)}
                    alt="profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <i className="bi bi-person-circle fs-1 text-muted mt-4"></i>
                )}
              </div>
              <p className="text-muted small mt-2">
                {image ? "Photo selected ✅" : "Click to add your photo (Required)"}
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

              {/* Availability Dropdown */}
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

              {/* Interests Checkbox */}
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
                <Form.Label>Why do you want to volunteer? (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Write your message..."
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="d-grid">
                <Button type="submit" variant="success" size="lg">
                  Submit Application ✅
                </Button>
              </div>
            </Form>
          </Card>
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
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleGallery}
            />
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

export default Volunter;