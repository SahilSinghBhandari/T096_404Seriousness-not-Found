import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Table, Form, Card } from "react-bootstrap";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("donors");
  const [donors, setDonors] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [pingalwadaName, setPingalwadaName] = useState("");
  const [pingalwadas, setPingalwadas] = useState([]);

  const nav = useNavigate();

  // ✅ Fetch Donors from Firestore
  const fetchDonors = async () => {
    const querySnapshot = await getDocs(collection(db, "donors"));
    setDonors(querySnapshot.docs.map((doc) => doc.data()));
  };

  // ✅ Fetch Volunteers from Firestore
  const fetchVolunteers = async () => {
    const querySnapshot = await getDocs(collection(db, "volunteers"));
    setVolunteers(querySnapshot.docs.map((doc) => doc.data()));
  };

  // ✅ Fetch Pingalwadas from Firestore
  const fetchPingalwadas = async () => {
    const querySnapshot = await getDocs(collection(db, "pingalwada"));
    setPingalwadas(querySnapshot.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    fetchDonors();
    fetchVolunteers();
    fetchPingalwadas();
  }, []);

  // ✅ Add New Pingalwada
  const handleAddPingalwada = async (e) => {
    e.preventDefault();
    if (!pingalwadaName) {
      toast.error("Pingalwada name is required");
      return;
    }
    try {
      await addDoc(collection(db, "pingalwada"), {
        name: pingalwadaName,
        createdAt: serverTimestamp(),
      });
      toast.success("Pingalwada added successfully!");
      setPingalwadaName("");
      fetchPingalwadas();
    } catch (error) {
      toast.error("Error adding Pingalwada");
      console.error(error);
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully!");
    nav("/login");
  };

  return (
    <Container fluid className="d-flex">
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          minHeight: "100vh",
          backgroundColor: "#1e3c72",
          color: "white",
          padding: "20px",
        }}
      >
        <h4 className="text-center mb-4">Admin Panel</h4>
        <ul className="list-unstyled">
          <li>
            <Button
              variant={activeTab === "donors" ? "light" : "outline-light"}
              className="w-100 mb-2"
              onClick={() => setActiveTab("donors")}
            >
              Donors
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === "volunteers" ? "light" : "outline-light"}
              className="w-100 mb-2"
              onClick={() => setActiveTab("volunteers")}
            >
              Volunteers
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === "pingalwada" ? "light" : "outline-light"}
              className="w-100 mb-2"
              onClick={() => setActiveTab("pingalwada")}
            >
              Pingalwada
            </Button>
          </li>
          <li>
            <Button
              variant="danger"
              className="w-100 mt-5"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="flex-grow-1 p-4">
        {activeTab === "donors" && (
          <Card className="p-3">
            <h3>Donors List</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Total Donations</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((donor, i) => (
                  <tr key={i}>
                    <td>{donor.donorName}</td>
                    <td>{donor.donorEmail}</td>
                    <td>{donor.donorLocation}</td>
                    <td>{donor.totalDonations}</td>
                    <td>₹{donor.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}

        {activeTab === "volunteers" && (
          <Card className="p-3">
            <h3>Volunteers List</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Skills</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((volunteer, i) => (
                  <tr key={i}>
                    <td>{volunteer.name}</td>
                    <td>{volunteer.email}</td>
                    <td>{volunteer.phone}</td>
                    <td>{volunteer.skills}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}

        {activeTab === "pingalwada" && (
          <Card className="p-3">
            <h3>Add Pingalwada</h3>
            <Form onSubmit={handleAddPingalwada} className="d-flex gap-2 mb-3">
              <Form.Control
                type="text"
                placeholder="Enter Pingalwada name"
                value={pingalwadaName}
                onChange={(e) => setPingalwadaName(e.target.value)}
              />
              <Button type="submit" variant="success">
                Add
              </Button>
            </Form>

            <h5>Existing Pingalwadas</h5>
            <ul>
              {pingalwadas.map((p, i) => (
                <li key={i}>{p.name}</li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </Container>
  );
}
