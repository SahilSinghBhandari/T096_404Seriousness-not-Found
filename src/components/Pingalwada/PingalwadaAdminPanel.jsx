import React, { useEffect, useState, useRef } from "react";
import { Container, Button, Table, Card, Modal, Form } from "react-bootstrap";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("home");
  const [volunteers, setVolunteers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobData, setJobData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    time: "",
    skills: "",
  });

  const nav = useNavigate();
  const statusesFixedRef = useRef(false);

  // ✅ Fetch Volunteers
  const fetchVolunteers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "volunteers"));
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setVolunteers(list);

      if (!statusesFixedRef.current) {
        const missing = list.filter((v) => !v.status);
        if (missing.length > 0) {
          const updates = missing.map((v) =>
            updateDoc(doc(db, "volunteers", v.id), { status: "pending" })
          );
          await Promise.all(updates);
          statusesFixedRef.current = true;
          fetchVolunteers();
        } else {
          statusesFixedRef.current = true;
        }
      }
    } catch (err) {
      console.error("Error fetching volunteers:", err);
      toast.error("Failed to fetch volunteers.");
    }
  };

  // ✅ Fetch Jobs
  const fetchJobs = async () => {
    try {
      const snapshot = await getDocs(collection(db, "volunteer_jobs"));
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setJobs(list);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast.error("Failed to fetch jobs.");
    }
  };

  useEffect(() => {
    fetchVolunteers();
    fetchJobs();
  }, []);

  // ✅ Approve Volunteer
  const handleVolunteerStatus = async (id) => {
    try {
      await updateDoc(doc(db, "volunteers", id), { status: "approved" });
      toast.success("Volunteer approved ✅");
      fetchVolunteers();
    } catch (err) {
      toast.error("Error approving volunteer");
      console.error(err);
    }
  };

  // ✅ Add Job
  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "volunteer_jobs"), {
        ...jobData,
        createdAt: serverTimestamp(),
      });
      toast.success("Job added ✅");
      setShowJobModal(false);
      setJobData({
        title: "",
        category: "",
        description: "",
        location: "",
        time: "",
        skills: "",
      });
      fetchJobs();
    } catch (err) {
      toast.error("Error adding job");
      console.error(err);
    }
  };

  // ✅ Delete Job
  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteDoc(doc(db, "volunteer_jobs", id));
      toast.success("Job deleted ✅");
      fetchJobs();
    } catch (err) {
      toast.error("Error deleting job");
      console.error(err);
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
              variant={activeTab === "volunteers" ? "light" : "outline-light"}
              className="w-100 mb-2"
              onClick={() => setActiveTab("volunteers")}
            >
              Volunteers
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === "jobs" ? "light" : "outline-light"}
              className="w-100 mb-2"
              onClick={() => setActiveTab("jobs")}
            >
              Jobs
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
        {/* Volunteers Section */}
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
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((v) => {
                  const status = v.status || "pending";
                  return (
                    <tr key={v.id}>
                      <td>{v.name}</td>
                      <td>{v.email}</td>
                      <td>{v.phone}</td>
                      <td>{v.interests?.join(", ")}</td>
                      <td>
                        <span
                          className={
                            status === "approved"
                              ? "text-success fw-bold"
                              : "text-warning fw-bold"
                          }
                        >
                          {status}
                        </span>
                      </td>
                      <td>
                        {status === "pending" ? (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleVolunteerStatus(v.id)}
                          >
                            Approve
                          </Button>
                        ) : (
                          <span className="text-success">Approved ✅</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        )}

        {/* Jobs Section */}
        {activeTab === "jobs" && (
          <Card className="p-3 shadow-sm border-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="mb-0 text-success">Volunteer Jobs 💼</h3>
              <Button onClick={() => setShowJobModal(true)}>+ Add Job</Button>
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
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteJob(job.id)}
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

      {/* Job Modal */}
      <Modal show={showJobModal} onHide={() => setShowJobModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Volunteer Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddJob}>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={jobData.title}
                onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                value={jobData.category}
                onChange={(e) => setJobData({ ...jobData, category: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Location</Form.Label>
              <Form.Control
                value={jobData.location}
                onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Time Commitment</Form.Label>
              <Form.Control
                value={jobData.time}
                onChange={(e) => setJobData({ ...jobData, time: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Skills Required</Form.Label>
              <Form.Control
                value={jobData.skills}
                onChange={(e) => setJobData({ ...jobData, skills: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={jobData.description}
                onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" variant="success" className="mt-2 w-100">
              Add Job
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
