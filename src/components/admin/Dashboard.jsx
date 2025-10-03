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
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("home");
  const [users, setUsers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [pingalwadas, setPingalwadas] = useState([]);
  const [jobs, setJobs] = useState([]);

  // Modals
  const [showForm, setShowForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);

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

  // Job form data
  const [jobData, setJobData] = useState({
    title: "",
    category: "",
    location: "",
    time: "",
    skills: "",
    description: "",
  });

  const nav = useNavigate();

  // 🔹 Fetch functions
  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const allUsers = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setUsers(allUsers.filter((u) => u.role !== "admin"));
  };

  const fetchDonors = async () => {
    const querySnapshot = await getDocs(collection(db, "payments"));
    setDonors(querySnapshot.docs.map((doc) => doc.data()));
  };

  const fetchVolunteers = async () => {
    const querySnapshot = await getDocs(collection(db, "volunteers"));
    setVolunteers(querySnapshot.docs.map((doc) => doc.data()));
  };

  const fetchPingalwadas = async () => {
    const querySnapshot = await getDocs(collection(db, "pingalwada"));
    setPingalwadas(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const fetchJobs = async () => {
    const querySnapshot = await getDocs(collection(db, "jobs"));
    setJobs(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchUsers();
    fetchDonors();
    fetchVolunteers();
    fetchPingalwadas();
    fetchJobs();
  }, []);

  // 🔹 Add Job
  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "jobs"), {
        ...jobData,
        createdAt: serverTimestamp(),
      });
      toast.success("✅ Job added successfully!");
      setShowJobForm(false);
      setJobData({ title: "", category: "", location: "", time: "", skills: "", description: "" });
      fetchJobs();
    } catch (error) {
      toast.error("❌ Failed to add job");
      console.error(error);
    }
  };

  // 🔹 Delete Job
  const handleDeleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await deleteDoc(doc(db, "jobs", id));
      toast.success("✅ Job deleted!");
      fetchJobs();
    } catch (error) {
      toast.error("❌ Failed to delete job");
    }
  };

  // 🔹 Delete User
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this User?")) return;
    try {
      await deleteDoc(doc(db, "users", id));
      toast.success("✅ User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("❌ Error deleting User");
    }
  };

  // 🔹 Delete Pingalwada
  const handleDeletePingalwada = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Pingalwada?")) return;
    try {
      await deleteDoc(doc(db, "pingalwada", id));
      toast.success("✅ Pingalwada deleted successfully");
      fetchPingalwadas();
    } catch (error) {
      toast.error("❌ Error deleting Pingalwada");
    }
  };

  // 🔹 Logout
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
          boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <h4 className="text-center mb-4 fw-bold">Admin Panel</h4>
        <ul className="list-unstyled">
          <li><Button variant={activeTab === "home" ? "light" : "outline-light"} className="w-100 mb-2 fw-semibold" onClick={() => setActiveTab("home")}>Home</Button></li>
          <li><Button variant={activeTab === "donors" ? "light" : "outline-light"} className="w-100 mb-2 fw-semibold" onClick={() => setActiveTab("donors")}>Donors</Button></li>
          <li><Button variant={activeTab === "volunteers" ? "light" : "outline-light"} className="w-100 mb-2 fw-semibold" onClick={() => setActiveTab("volunteers")}>Volunteers</Button></li>
          <li><Button variant={activeTab === "pingalwada" ? "light" : "outline-light"} className="w-100 mb-2 fw-semibold" onClick={() => setActiveTab("pingalwada")}>Pingalwada</Button></li>
          <li><Button variant={activeTab === "jobs" ? "light" : "outline-light"} className="w-100 mb-2 fw-semibold" onClick={() => setActiveTab("jobs")}>Jobs</Button></li>
          <li><Button variant="danger" className="w-100 mt-5 fw-semibold" onClick={handleLogout}>Logout</Button></li>
        </ul>
      </div>

      {/* Content */}
      <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: "100vh" }}>
        
        {/* Users (Home Tab) */}
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
                      <Button variant="danger" size="sm" onClick={() => handleDeleteUser(u.id)}>
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
            <h3 className="mb-3 text-primary">Donors List</h3>
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
            <h3 className="mb-3 text-primary">Volunteers List</h3>
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
            <div className="d-flex justify-content-between mb-3">
              <h3 className="text-primary">Pingalwada Management</h3>
              <Button variant="success" onClick={() => setShowForm(true)}>+ Add Pingalwada</Button>
            </div>
            <Table striped bordered hover responsive>
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Phone</th>
                  <th>Services</th>
                  <th>Capacity</th>
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
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleDeletePingalwada(p.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}

        {/* Jobs */}
        {activeTab === "jobs" && (
          <Card className="p-3 shadow-sm border-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="text-success">Manage Jobs 💼</h3>
              <Button onClick={() => setShowJobForm(true)}>+ Add Job</Button>
            </div>
            <Table striped bordered hover responsive>
              <thead className="table-success">
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Time</th>
                  <th>Skills</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.category}</td>
                    <td>{job.location}</td>
                    <td>{job.time}</td>
                    <td>{job.skills}</td>
                    <td>{job.description}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteJob(job.id)}>
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

      {/* Modal for Adding Job */}
      <Modal show={showJobForm} onHide={() => setShowJobForm(false)} centered>
        <Modal.Header closeButton><Modal.Title>Add Job</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddJob}>
            <Form.Group className="mb-2"><Form.Label>Job Title</Form.Label>
              <Form.Control value={jobData.title} onChange={(e) => setJobData({ ...jobData, title: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Category</Form.Label>
              <Form.Control value={jobData.category} onChange={(e) => setJobData({ ...jobData, category: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Location</Form.Label>
              <Form.Control value={jobData.location} onChange={(e) => setJobData({ ...jobData, location: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Time</Form.Label>
              <Form.Control value={jobData.time} onChange={(e) => setJobData({ ...jobData, time: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Skills Required</Form.Label>
              <Form.Control value={jobData.skills} onChange={(e) => setJobData({ ...jobData, skills: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} value={jobData.description} onChange={(e) => setJobData({ ...jobData, description: e.target.value })} required /></Form.Group>
            <Button type="submit" variant="success" className="mt-2 w-100">Add Job</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}