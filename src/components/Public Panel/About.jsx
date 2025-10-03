import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { FaComments, FaPaperPlane } from "react-icons/fa";
import Slider from "react-slick";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import PingalwadaSection from "./PingalwadaSection";

// OpenAI chatbot
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, 
  dangerouslyAllowBrowser: true,
});

export default function About() {
  const [donators, setDonators] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [pingalwadas, setPingalwadas] = useState([]);

  // Chatbot states
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! 👋 I’m your Pingalwara Assistant. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔊 Speak bot reply
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  // 🎤 Start listening to voice
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
    };
  };

  // ✅ Handle chatbot send with AI
  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant for Digital Pingalwara. Answer questions about donating, volunteering, jobs, and location in a simple and friendly way.",
          },
          ...messages.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
          { role: "user", content: input },
        ],
      });

      const reply = response.choices[0].message.content;
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
      speak(reply);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Sorry, I’m having trouble right now. Please try again later." },
      ]);
    }

    setLoading(false);
  };

  // === Firestore fetching code ===
  useEffect(() => {
    const fetchDonators = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "payments"));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setDonators(data.filter((d) => d.message));
      } catch (error) {
        console.error("Error fetching donators:", error);
      }
    };
    fetchDonators();
  }, []);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "volunteers"));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setVolunteers(data.filter((v) => v.message));
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };
    fetchVolunteers();
  }, []);

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

  // ✅ Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  // ✅ Static Projects Section Data
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

      {/* ✅ Floating ChatBot */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        <Button
          variant="primary"
          onClick={() => setIsOpen(!isOpen)}
          style={{ borderRadius: "50%", padding: "15px 18px" }}
        >
          <FaComments size={24} />
        </Button>
      </div>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            height: "420px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 10000,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#0d6efd",
              color: "white",
              padding: "10px",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            <strong>Pingalwara Assistant 🤖</strong>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.from === "user" ? "right" : "left",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    background: msg.from === "user" ? "#0d6efd" : "#f1f1f1",
                    color: msg.from === "user" ? "white" : "black",
                    maxWidth: "80%",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && <p className="text-muted fst-italic">Thinking...</p>}
          </div>

          {/* Input + Mic */}
          <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #ddd" }}>
            <Form.Control
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button variant="success" onClick={handleSend} className="ms-2" disabled={loading}>
              <FaPaperPlane />
            </Button>
            <Button variant="danger" onClick={startListening} className="ms-2">
              🎤
            </Button>
          </div>
        </div>
      )}
    </>
  );
}