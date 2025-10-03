import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import PingalwadaSection from "./PingalwadaSection";
import { FaComments, FaPaperPlane } from "react-icons/fa";

// ✅ OpenAI with Hardcoded Key (Hackathon only)
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "sk-your-api-key-here",   // ⚠️ Replace with your real key
  dangerouslyAllowBrowser: true,
});

export default function About() {
  const [donators, setDonators] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [pingalwadas, setPingalwadas] = useState([]);

  // Chatbot states
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! 👋 I’m your Pingalwara Assistant. How can I help?" }
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
        model: "gpt-4o-mini", // fast & cheap
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for Digital Pingalwara. Answer questions about donating, volunteering, jobs, and location in a simple and friendly way.",
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
      speak(reply); // 🔊 bot speaks
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Sorry, I’m having trouble right now. Please try again later." },
      ]);
    }

    setLoading(false);
  };

  // === Firestore fetching code (same as before) ===
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

  return (
    <>
      {/* Your existing Hero, Donators, Volunteers, PingalwadaSection */}
      <PingalwadaSection />

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