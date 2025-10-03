// src/components/Admin/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Form,
  Card,
  Modal,
} from "react-bootstrap";
import { signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("home");
  const [users, setUsers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [pingalwadas, setPingalwadas] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Pingalwada form data
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contactPerson: "",
    phone: "",
    managerEmail: "",
    managerPassword: "",
    capacity: "",
    services: [],
    description: "",
    cloudinaryId: "",
    razorpayKey: "",
  });

  const nav = useNavigate();

  // ✅ Fetch Users (exclude main admins)
  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const allUsers = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setUsers(allUsers.filter((u) => u.role !== "admin"));
  };

  // ✅ Fetch Donors
  const fetchDonors = async () => {
    const querySnapshot = await getDocs(collection(db, "donors"));
    setDonors(querySnapshot.docs.map((doc) => doc.data()));
  };

  // ✅ Fetch Volunteers
  const fetchVolunteers = async () => {
    const querySnapshot = await getDocs(collection(db, "volunteers"));
    setVolunteers(querySnapshot.docs.map((doc) => doc.data()));
  };

  // ✅ Fetch Pingalwadas
  const fetchPingalwadas = async () => {
    const querySnapshot = await getDocs(collection(db, "pingalwada"));
    setPingalwadas(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchUsers();
    fetchDonors();
    fetchVolunteers();
    fetchPingalwadas();
  }, []);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Checkbox
  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    let updated = [...formData.services];
    if (checked) {
      updated.push(value);
    } else {
      updated = updated.filter((s) => s !== value);
    }
    setFormData({ ...formData, services: updated });
  };

  // ✅ Add New Pingalwada
  const handleAddPingalwada = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.location ||
      !formData.phone ||
      !formData.cloudinaryId ||
      !formData.managerEmail ||
      !formData.managerPassword ||
      !formData.razorpayKey
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      // Add Pingalwada to Firestore
      const pingalwadaRef = await addDoc(collection(db, "pingalwada"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      // Create Firebase Auth account for Manager
      const userCred = await createUserWithEmailAndPassword(
        auth,
        formData.managerEmail,
        formData.managerPassword
      );

      // Add Manager user in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,
        email: formData.managerEmail,
        role: "pingalwada-admin",
        pingalwadaId: pingalwadaRef.id,
        createdAt: serverTimestamp(),
      });

      toast.success("✅ Pingalwada & Manager added successfully!");
      setFormData({
        name: "",
        location: "",
        contactPerson: "",
        phone: "",
        managerEmail: "",
        managerPassword: "",
        capacity: "",
        services: [],
        description: "",
        cloudinaryId: "",
        razorpayKey: "",
      });
      setShowForm(false);
      fetchPingalwadas();
      fetchUsers();
    } catch (error) {
      toast.error("❌ Error adding Pingalwada");
      console.error(error);
    }
  };

  // ✅ Delete Pingalwada AND its Manager
  const handleDeletePingalwada = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Pingalwada and its Manager?")) return;
    try {
      // 1. Find linked manager
      const q = query(
        collection(db, "users"),
        where("pingalwadaId", "==", id),
        where("role", "==", "pingalwada-admin")
      );
      const managerSnap = await getDocs(q);

      // 2. Delete manager user(s)
      for (let m of managerSnap.docs) {
        await deleteDoc(doc(db, "users", m.id));
      }

      // 3. Delete the Pingalwada
      await deleteDoc(doc(db, "pingalwada", id));

      toast.success("✅ Pingalwada and its Manager deleted successfully");
      fetchPingalwadas();
      fetchUsers();
    } catch (error) {
      toast.error("❌ Error deleting Pingalwada or Manager");
      console.error(error);
    }
  };

  // ✅ Delete User
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this User?")) return;
    try {
      await deleteDoc(doc(db, "users", id));
      toast.success("✅ User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("❌ Error deleting User");
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
    <Container fluid className="d-flex p-0 m-0">
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          minHeight: "100vh",
          background: "linear-gradient(180deg, #1e3c72, #2a5298)",
          color: "white",
          padding: "20px",
        }}
      >
        <h4 className="text-center mb-4 fw-bold">Admin Panel</h4>
        <ul className="list-unstyled">
          <li>
            <Button
              variant={activeTab === "home" ? "light" : "outline-light"}
              className="w-100 mb-2"
              onClick={() => setActiveTab("home")}
            >
              Home
            </Button>
          </li>
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
      <div className="flex-grow-1 p-4 bg-light">
        {/* Home Tab */}
        {activeTab === "home" && (
          <Card className="p-3 shadow-sm border-0">
            <h3 className="mb-3 text-primary">All Users</h3>
            <Table striped bordered hover responsive>
              <thead className="table-primary">
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i}>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}

        {/* Donors */}
        {activeTab === "donors" && (
          <Card className="p-3 shadow-sm border-0">
            <h3 className="mb-3 text-primary">Donors</h3>
            <Table striped bordered hover responsive>
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Total Donations</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((d, i) => (
                  <tr key={i}>
                    <td>{d.donorName}</td>
                    <td>{d.donorEmail}</td>
                    <td>{d.donorLocation}</td>
                    <td>{d.totalDonations}</td>
                    <td>₹{d.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}

        {/* Volunteers */}
        {activeTab === "volunteers" && (
          <Card className="p-3 shadow-sm border-0">
            <h3 className="mb-3 text-primary">Volunteers</h3>
            <Table striped bordered hover responsive>
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Skills</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((v, i) => (
                  <tr key={i}>
                    <td>{v.name}</td>
                    <td>{v.email}</td>
                    <td>{v.phone}</td>
                    <td>{v.interests?.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}

        {/* Pingalwada */}
        {activeTab === "pingalwada" && (
          <Card className="p-3 shadow-sm border-0">
            <h3 className="mb-3 text-primary">Pingalwada Management</h3>
            <Table striped bordered hover responsive>
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Phone</th>
                  <th>Services</th>
                  <th>Capacity</th>
                  <th>Razorpay Key</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pingalwadas.map((p, i) => (
                  <tr key={i}>
                    <td>{p.name}</td>
                    <td>{p.location}</td>
                    <td>{p.phone}</td>
                    <td>{p.services?.join(", ")}</td>
                    <td>{p.capacity}</td>
                    <td>{p.razorpayKey}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeletePingalwada(p.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </div>
    </Container>
  );
}
