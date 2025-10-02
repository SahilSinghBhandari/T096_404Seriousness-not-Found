import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  ProgressBar,
  ListGroup,
} from "react-bootstrap";
import { motion } from "framer-motion";

// Chart imports
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
ChartJS.register(ArcElement, Tooltip, Legend);


// ------- Helper small components --------
const SmallStat = ({ value, label }) => (
  <div className="text-center p-3">
    <h3 className="fw-bold text-success">{value}</h3>
    <p className="mb-0">{label}</p>
  </div>
);

// ---------- Main Page ----------
export default function MedicalSupportFull() {
  // Donation form state
  const [donation, setDonation] = useState({
    name: "",
    amount: "",
    purpose: "Medicines",
    message: "",
  });
  const [donationMsg, setDonationMsg] = useState("");

  // Volunteer form state
  const [volunteer, setVolunteer] = useState({
    name: "",
    email: "",
    area: "",
  });
  const [volMsg, setVolMsg] = useState("");

  // Chatbot
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Hi 👋 I'm CareBot. Ask me about donations, volunteering, or urgent needs." },
  ]);

  // Real-time and derived data
  const [progressPercent, setProgressPercent] = useState(0);
  const [raisedAmount, setRaisedAmount] = useState(0);
  const [goal] = useState(100000); // example target
  const [stats, setStats] = useState({
    patients: 0,
    surgeries: 0,
    medicines: 0,
    emergencies: 0,
  });
  const [urgentNeeds, setUrgentNeeds] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // Pie chart data (example distribution; ideally derived from real accounting)
  const [distribution, setDistribution] = useState({
    surgeries: 60,
    medicines: 30,
    admin: 10,
  });

  // Animated counters (simple)
  const animateTo = (target, setter, speed = 20) => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.ceil(target / speed);
      if (current >= target) {
        setter(target);
        clearInterval(interval);
      } else {
        setter(current);
      }
    }, 40);
  };

  // ---------- Firestore listeners ----------
  useEffect(() => {
    // Donations collection snapshot -> calculate raised amounts + leaderboard
    const donationsCol = collection(db, "donations");
    const unsub = onSnapshot(donationsCol, (snapshot) => {
      let total = 0;
      const donorsMap = {}; // aggregate by name to create leaderboard
      snapshot.forEach((doc) => {
        const data = doc.data();
        const amt = Number(data.amount) || 0;
        total += amt;
        if (data.name) donorsMap[data.name] = (donorsMap[data.name] || 0) + amt;
      });

      setRaisedAmount(total);
      setProgressPercent(Math.min(Math.round((total / goal) * 100), 100));

      // Build leaderboard from donorsMap
      const lb = Object.entries(donorsMap)
        .map(([name, amt]) => ({ name, amount: amt }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);
      setLeaderboard(lb);
    });

    // Urgent needs collection snapshot
    const urgentCol = collection(db, "urgent_needs");
    const unsubUrgent = onSnapshot(urgentCol, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setUrgentNeeds(list);
    });

    // Basic stats snapshot (you can maintain these in a separate doc in your project)
    const statsCol = collection(db, "stats");
    const unsubStats = onSnapshot(statsCol, (snapshot) => {
      // naive: sum up particular docs; for demo just compute locally
      let patients = 0, surgeries = 0, medicines = 0, emergencies = 0;
      snapshot.forEach((doc) => {
        const d = doc.data();
        patients += Number(d.patients || 0);
        surgeries += Number(d.surgeries || 0);
        medicines += Number(d.medicines || 0);
        emergencies += Number(d.emergencies || 0);
      });
      // animate counters to these values
      animateTo(patients, (val) => setStats((s) => ({ ...s, patients: val })));
      animateTo(surgeries, (val) => setStats((s) => ({ ...s, surgeries: val })));
      animateTo(medicines, (val) => setStats((s) => ({ ...s, medicines: val })));
      animateTo(emergencies, (val) => setStats((s) => ({ ...s, emergencies: val })));
    });

    return () => {
      unsub();
      unsubUrgent();
      unsubStats();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------ Handlers -------------------
  const submitDonation = async (e) => {
    e.preventDefault();
    if (!donation.name || !donation.amount) {
      setDonationMsg("Please enter name and amount.");
      return;
    }
    try {
      await addDoc(collection(db, "donations"), {
        ...donation,
        amount: Number(donation.amount),
        createdAt: serverTimestamp(),
      });
      setDonationMsg("Thank you! Your donation has been recorded.");
      setDonation({ name: "", amount: "", purpose: "Medicines", message: "" });
    } catch (err) {
      console.error(err);
      setDonationMsg("Error saving donation. Try again.");
    }
  };

  const submitVolunteer = async (e) => {
    e.preventDefault();
    if (!volunteer.name || !volunteer.email) {
      setVolMsg("Name and email are required.");
      return;
    }
    try {
      await addDoc(collection(db, "volunteers"), {
        ...volunteer,
        createdAt: serverTimestamp(),
      });
      setVolMsg("Thanks! We'll contact you soon.");
      setVolunteer({ name: "", email: "", area: "" });
    } catch (err) {
      console.error(err);
      setVolMsg("Error submitting. Try again.");
    }
  };

  // Add an urgent need (for demo / admin UI you can use the same form)
  const addUrgentNeed = async () => {
    try {
      await addDoc(collection(db, "urgent_needs"), {
        title: "Child needs heart surgery",
        description: "Surgery needed ASAP - target ₹20,000",
        target: 20000,
        raised: 0,
        createdAt: serverTimestamp(),
      });
      alert("Urgent need added (demo).");
    } catch (err) {
      console.error(err);
    }
  };

  // Chatbot logic (simple)
  const handleChatSubmit = (e) => {
    e.preventDefault();
    const input = e.target.chatInput.value.trim();
    if (!input) return;
    setChatMessages((m) => [...m, { from: "user", text: input }]);

    // basic rule-based replies
    let reply = "Sorry, I didn't understand. Try: 'donation', 'surgery', 'volunteer', 'urgent'.";
    const lower = input.toLowerCase();
    if (lower.includes("donation") || lower.includes("where")) {
      reply = `Donations fund medicines, surgeries and emergency aid. Current raised: ₹${raisedAmount}.`;
    } else if (lower.includes("surgery")) {
      reply = "To sponsor a surgery, select 'Surgery' in the donation form or contact admin@yourorg.org.";
    } else if (lower.includes("volunteer")) {
      reply = "Click Volunteer Signup and fill the form — our team will reach out.";
    } else if (lower.includes("urgent")) {
      reply = urgentNeeds.length
        ? `There are ${urgentNeeds.length} urgent cases. Check the Urgent Needs section.`
        : "No urgent cases currently.";
    }
    setTimeout(() => {
      setChatMessages((m) => [...m, { from: "bot", text: reply }]);
    }, 600);
    e.target.chatInput.value = "";
  };

  // Pie chart data for distribution
  const pieData = {
    labels: ["Surgeries", "Medicines", "Admin"],
    datasets: [
      {
        label: "Distribution",
        data: [distribution.surgeries, distribution.medicines, distribution.admin],
      },
    ],
  };

  // ---------- Render ----------
  return (
    <div>
      {/* HERO */}
      <div
        style={{
          height: "55vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1580281658629-82ae1a6a2d9b?auto=format&fit=crop&w=1600&q=60')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          color: "white",
        }}
      >
        <Container className="text-center">
          <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="display-4 fw-bold">
            Medical Support
          </motion.h1>
          <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lead">
            Saving lives, one step at a time. Join us to provide medicines, surgeries, and emergency aid.
          </motion.p>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <Button variant="success" size="lg">Support a Patient</Button>
            <Button variant="outline-light" size="lg">Sponsor Surgery</Button>
          </div>
        </Container>
      </div>

      {/* WHY + SERVICES */}
      <Container className="my-5 text-center">
        <h2 className="fw-bold">Why Medical Support?</h2>
        <p className="text-muted">Millions lack access to basic healthcare. With your help we provide direct medical support to those in need.</p>

        <Row className="mt-4 g-3">
          <Col md={3}>
            <Card className="h-100 shadow-sm p-3">
              <h5>💊 Free Medicines</h5>
              <p className="small text-muted">Essential medicines distributed to patients who cannot afford them.</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 shadow-sm p-3">
              <h5>🏥 Check-ups</h5>
              <p className="small text-muted">Regular health checkups for communities in need.</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 shadow-sm p-3">
              <h5>❤️ Surgeries</h5>
              <p className="small text-muted">Sponsor life-saving surgeries fully funded by donations.</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 shadow-sm p-3">
              <h5>🚑 Emergency Aid</h5>
              <p className="small text-muted">Immediate response and medical treatment for emergencies.</p>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* MAIN AREA: Donation form | Progress | Pie | Urgent Needs */}
      <Container className="my-5">
        <Row className="g-4">
          {/* Left column: donation form and urgent needs */}
          <Col lg={6}>
            <Card className="p-4 shadow-sm">
              <h4 className="fw-bold">Make a Donation</h4>
              <Form onSubmit={submitDonation}>
                <Row className="g-2">
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Your Name</Form.Label>
                      <Form.Control
                        value={donation.name}
                        onChange={(e) => setDonation({ ...donation, name: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Amount (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        value={donation.amount}
                        onChange={(e) => setDonation({ ...donation, amount: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-2">
                  <Form.Label>Purpose</Form.Label>
                  <Form.Select
                    value={donation.purpose}
                    onChange={(e) => setDonation({ ...donation, purpose: e.target.value })}
                  >
                    <option>Medicines</option>
                    <option>Surgery</option>
                    <option>Emergency Aid</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message (optional)</Form.Label>
                  <Form.Control
                    value={donation.message}
                    onChange={(e) => setDonation({ ...donation, message: e.target.value })}
                  />
                </Form.Group>

                <Button type="submit" variant="success">Donate Now</Button>

                {donationMsg && <div className="mt-3 text-success small">{donationMsg}</div>}
              </Form>
            </Card>

            <Card className="p-3 mt-4 shadow-sm">
              <h5 className="fw-bold">⚡ Urgent Needs</h5>
              <p className="small text-muted">Cases that require immediate attention. Donate directly to these when possible.</p>

              {urgentNeeds.length === 0 && (
                <div className="p-3 bg-white rounded">No urgent cases currently. (Admin: add via Firestore)</div>
              )}

              <ListGroup variant="flush">
                {urgentNeeds.map((u) => (
                  <ListGroup.Item key={u.id} className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">{u.title}</div>
                      <div className="small text-muted">{u.description}</div>
                    </div>
                    <div className="text-end">
                      <div className="small">Target ₹{u.target}</div>
                      <Button size="sm" variant="danger" className="mt-2">Donate</Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="mt-3">
                <small className="text-muted">Admin/demo: <Button size="sm" variant="outline-secondary" onClick={addUrgentNeed}>Add demo urgent need</Button></small>
              </div>
            </Card>
          </Col>

          {/* Right column: progress, stats, pie, leaderboard */}
          <Col lg={6}>
            <Card className="p-3 shadow-sm mb-3">
              <h5 className="fw-bold">Donation Progress</h5>
              <p className="small text-muted">₹{raisedAmount} raised of ₹{goal} goal</p>
              <ProgressBar now={progressPercent} label={`${progressPercent}%`} animated />
            </Card>

            <Row className="g-3">
              <Col md={6}>
                <Card className="p-3 shadow-sm">
                  <SmallStat value={`${stats.patients}+`} label="Patients Treated" />
                </Card>
              </Col>
              <Col md={6}>
                <Card className="p-3 shadow-sm">
                  <SmallStat value={`${stats.surgeries}+`} label="Surgeries Sponsored" />
                </Card>
              </Col>
            </Row>

            <Card className="p-3 mt-3 shadow-sm">
              <h6 className="fw-bold">Transparency: How donations are used</h6>
              <div style={{ maxWidth: 300, margin: "0 auto" }}>
                <Pie data={pieData} />
              </div>
              <div className="text-center mt-2 small text-muted">Example distribution (surgeries / medicines / admin)</div>
            </Card>

            <Card className="p-3 mt-3 shadow-sm">
              <h6 className="fw-bold">Top Donors</h6>
              {leaderboard.length === 0 && <div className="small text-muted">No donors yet (demo)</div>}
              <ListGroup variant="flush" className="mt-2">
                {leaderboard.map((d, idx) => (
                  <ListGroup.Item key={idx} className="d-flex justify-content-between">
                    <span>{d.name}</span>
                    <strong>₹{d.amount}</strong>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Patient Story */}
      <Container className="my-5 text-center">
        <h3 className="fw-bold">Patient Story</h3>
        <Card className="mx-auto shadow-sm" style={{ maxWidth: 800 }}>
          <Card.Body>
            <p>“Ali, age 10, was diagnosed with a heart condition. With community donations, he received life-saving surgery and is now healthy and back in school.”</p>
            <p className="fw-bold text-success">— Ali’s family</p>
          </Card.Body>
        </Card>
      </Container>


      {/* Final CTA */}
      <Container className="my-5 text-center">
        <h2 className="fw-bold">Be a Lifesaver</h2>
        <p className="text-muted">Your donation can change someone’s life today.</p>
        <Button variant="success" size="lg" className="me-2">Support a Patient</Button>
        <Button variant="outline-success" size="lg">Sponsor Surgery</Button>
      </Container>

      {/* Floating Chatbot */}
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 2000 }}>
        {chatOpen ? (
          <Card style={{ width: 320 }} className="shadow-lg">
            <Card.Header className="d-flex justify-content-between align-items-center bg-success text-white">
              CareBot
              <Button variant="light" size="sm" onClick={() => setChatOpen(false)}>✖</Button>
            </Card.Header>
            <Card.Body style={{ maxHeight: 280, overflowY: "auto" }}>
              {chatMessages.map((m, i) => (
                <div key={i} className={m.from === "bot" ? "text-start small text-success mb-2" : "text-end small mb-2"}>
                  <b>{m.from === "bot" ? "Bot: " : "You: "}</b>{m.text}
                </div>
              ))}
            </Card.Body>
            <Card.Footer>
              <Form onSubmit={handleChatSubmit} className="d-flex">
                <Form.Control name="chatInput" placeholder="Ask something..." />
                <Button type="submit" variant="success" className="ms-2">Send</Button>
              </Form>
            </Card.Footer>
          </Card>
        ) : (
          <Button variant="success" className="rounded-circle shadow" style={{ width: 56, height: 56 }} onClick={() => setChatOpen(true)}>💬</Button>
        )}
      </div>
    </div>
  );
}