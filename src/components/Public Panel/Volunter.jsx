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

// Firebase
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

const Volunteer = () => {
  const [image, setImage] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    setImage(imageSrc);
    setShowCamera(false);
  };

  // ✅ Upload from gallery
  const handleGallery = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
    setShowOptions(false);
  };

  
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

  // ✅ Submit volunteer form
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

    setLoading(true);

    try {
      console.log("Submitting volunteer data:", formData);

      let imageUrl = "";

      // ✅ Save volunteer data in Firestore
      const volunteerRef = await addDoc(collection(db, "volunteers"), {
        ...formData,
        imageUrl: "",
        status: "pending", // Admin can later approve/reject
        createdAt: serverTimestamp(),
      });

      console.log("Volunteer added with ID:", volunteerRef.id);

      // ✅ Upload image if available
      if (image) {
        try {
          const storage = getStorage();
          const storageRef = ref(
            storage,
            `volunteers/${volunteerRef.id}-${Date.now()}.jpg`
          );

          console.log("Uploading image...");
          await uploadString(storageRef, image, "data_url");
          imageUrl = await getDownloadURL(storageRef);

          // Update Firestore with image URL
          await updateDoc(doc(db, "volunteers", volunteerRef.id), { imageUrl });

          console.log("Image uploaded:", imageUrl);
        } catch (imgError) {
          console.error("Image upload failed:", imgError);
          toast.error("⚠️ Image upload failed, but data saved.");
        }
      }

      toast.success("🎉 Volunteer application submitted! Awaiting admin approval.");
      setSubmitted(true);

      // ✅ Reset form
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
      console.error("Error saving volunteer:", error);
      toast.error("❌ Something went wrong, please try again.");
    } finally {
      setLoading(false); // ✅ Always reset loader
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={7}>
          {!submitted ? (
            <Card className="shadow-lg border-0 p-4">
              <h2 className="text-center text-success mb-4">
                Volunteer with Us 🤝
              </h2>

              {/* Profile Image Upload */}
              <div className="text-center mb-4">
                <div
                  className="rounded-circle border d-inline-block overflow-hidden"
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
                  {image ? "Photo selected ✅" : "Click to add your photo (Optional)"}
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
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Availability *</Form.Label>
                  <Form.Select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
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
                    {["Teaching", "Fundraising", "Medical Help", "Event Management"].map(
                      (interest, idx) => (
                        <Form.Check
                          key={idx}
                          inline
                          label={interest}
                          type="checkbox"
                          value={interest}
                          checked={formData.interests.includes(interest)}
                          onChange={handleCheckbox}
                        />
                      )
                    )}
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
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="success" size="lg" disabled={loading}>
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
              <p>Your application is submitted. It will be visible after admin approval.</p>
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