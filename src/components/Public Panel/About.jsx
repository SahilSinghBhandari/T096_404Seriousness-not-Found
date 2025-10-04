import { useState } from "react";
import { Container, Row, Col, Button, Image, Modal, Form } from "react-bootstrap";
import PingalwadaSection from "./PingalwadaSection";

export default function About() {
  const [showVideo, setShowVideo] = useState(false);

  // ✅ Chatbot states
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! 👋 How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  // ✅ FAQ data
  const faq = {
    "who founded pingalwara": "Pingalwara was founded by Bhagat Puran Singh Ji 🙏",
    "what is pingalwara": "Pingalwara is a home for the sick, destitute, and needy people, providing care and dignity ❤️",
    "how can i donate": "You can donate online through our 'Donate' page 💳",
    "where is pingalwara located": "Pingalwara is located in Amritsar, Punjab 📍",
    "how to volunteer": "You can register as a volunteer on our Volunteer page 🙌",
  };

  // ✅ Handle message send
  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.toLowerCase();
    const botReply =
      faq[userMsg] || "Sorry, I don’t have an answer for that yet. 🙏";

    setMessages([
      ...messages,
      { sender: "user", text: input },
      { sender: "bot", text: botReply }
    ]);

    setInput("");
  };

  // ✅ Voice Input using Web Speech API
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition 😢");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN"; // you can change to "hi-IN" for Hindi, "pa-IN" for Punjabi
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  return (
    <>
      {/* ✅ Hero Section */}
      <div style={{ background: "#f8f9fa", padding: "60px 20px" }}>
        <Container>
          <Row className="align-items-center">
            {/* Left Side */}
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
                <Button variant="success" size="lg">Join Our Mission</Button>
                <Button variant="outline-success" size="lg" onClick={() => setShowVideo(true)}>
                  🎬 Watch Story
                </Button>
              </div>
            </Col>

            {/* Right Side - Image Grid */}
            <Col md={6} className="text-center">
              <Row>
                <Col xs={6} className="mb-3">
                  <Image src="./assets/img/11.jpg" alt="Pingalwara Children"
                    fluid rounded style={{ borderRadius: "15px", height: "200px", objectFit: "cover" }} />
                </Col>
                <Col xs={6} className="mb-3">
                  <Image src="./assets/img/12.jpg" alt="Helping Patients"
                    fluid rounded style={{ borderRadius: "15px", height: "200px", objectFit: "cover" }} />
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <Image src="./assets/img/13..jpg" alt="Education Support"
                    fluid rounded style={{ borderRadius: "15px", height: "200px", objectFit: "cover" }} />
                </Col>
                <Col xs={6}>
                  <Image src="./assets/img/14.jpg" alt="Medical Aid"
                    fluid rounded style={{ borderRadius: "15px", height: "200px", objectFit: "cover" }} />
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

      {/* ✅ Keep only Pingalwada Section */}
      <PingalwadaSection />

      {/* 💬 Floating Chatbot Button */}
      <Button
        variant="success"
        className="position-fixed bottom-0 end-0 m-4 rounded-circle"
        style={{ width: "60px", height: "60px" }}
        onClick={() => setShowChat(true)}
      >
        💬
      </Button>

      {/* Chatbot Modal */}
      <Modal show={showChat} onHide={() => setShowChat(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chat with Us</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 p-2 rounded ${
                msg.sender === "user"
                  ? "bg-primary text-white text-end"
                  : "bg-light text-dark"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer className="d-flex gap-2">
          <Form.Control
            type="text"
            value={input}
            placeholder="Type a message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button variant="secondary" onClick={handleVoiceInput}>
            {listening ? "🎤 Listening..." : "🎙 Speak"}
          </Button>
          <Button variant="success" onClick={handleSend}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}