import { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Button, Modal, Card, Image } from "react-bootstrap";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(true);

        try {
          // ✅ Fetch username
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          setUserName(userSnap.exists() ? userSnap.data().name : currentUser.displayName || "Donor");

          // ✅ Fetch transactions
          const q1 = query(collection(db, "transactions"), where("userId", "==", currentUser.uid));
          const snap1 = await getDocs(q1);

          // ✅ Fetch payments
          const q2 = query(collection(db, "payments"), where("userId", "==", currentUser.uid));
          const snap2 = await getDocs(q2);

          const allData = [...snap1.docs, ...snap2.docs].map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // ✅ Sort by date
          allData.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.completedAt || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.completedAt || 0);
            return dateB - dateA;
          });

          setTransactions(allData);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setTransactions([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ PDF Download
  const downloadPDF = async (elementId, fileName, orientation = "portrait") => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF(orientation, "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(fileName);
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">My Donation History</h2>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : !user ? (
        <Alert variant="warning" className="text-center">Please login to view your transactions.</Alert>
      ) : transactions.length === 0 ? (
        <Alert variant="info" className="text-center">You haven’t made any donations yet.</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Amount (₹)</th>
              <th>Message</th>
              <th>Donated For</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => {
              const txnDate = txn.createdAt?.toDate
                ? txn.createdAt.toDate().toLocaleDateString()
                : txn.completedAt
                ? new Date(txn.completedAt).toLocaleDateString()
                : "N/A";

              return (
                <tr key={txn.id}>
                  <td>{txnDate}</td>
                  <td>{txn.amount}</td>
                  <td>{txn.donorMessage || "—"}</td>
                  <td>{txn.pingalwadaName || "General Support"}</td>
                  <td className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setSelectedTxn(txn);
                        setShowModal(true);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => downloadPDF("cert-template", "certificate.pdf")}
                    >
                      Certificate
                    </Button>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => downloadPDF("invoice-template", "invoice.pdf")}
                    >
                      Invoice
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {/* 🔹 Modal for Viewing Donation Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Donation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTxn && (
            <Card className="shadow-sm text-center">
              {/* 🔹 Show donor uploaded image OR fallback */}
              <Image
                src={
                  selectedTxn.donorProfilePic && selectedTxn.donorProfilePic !== ""
                    ? selectedTxn.donorProfilePic
                    : "./assets/img/13..jpg" // put this fallback in public/assets/img
                }
                alt="Donation Proof"
                fluid
                rounded
                className="mb-3"
                style={{ maxHeight: "250px", objectFit: "contain" }}
              />

              <Card.Body>
                <h5 className="text-success">{selectedTxn.donorName}</h5>
                <p><strong>Email:</strong> {selectedTxn.donorEmail}</p>
                <p><strong>Amount:</strong> ₹{selectedTxn.amount}</p>
                <p><strong>Message:</strong> {selectedTxn.donorMessage || "—"}</p>
                <p><strong>Payment ID:</strong> {selectedTxn.paymentId}</p>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}