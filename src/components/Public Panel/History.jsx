import { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Button, Modal } from "react-bootstrap";
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
  const [showCert, setShowCert] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(true);

        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          setUserName(userSnap.exists() ? userSnap.data().name : currentUser.displayName || "Donor");

          const q1 = query(collection(db, "transactions"), where("userId", "==", currentUser.uid));
          const snap1 = await getDocs(q1);

          const q2 = query(collection(db, "payments"), where("userId", "==", currentUser.uid));
          const snap2 = await getDocs(q2);

          const allData = [...snap1.docs, ...snap2.docs].map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          allData.sort((a, b) => {
            const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.completedAt || 0);
            const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.completedAt || 0);
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

  // ✅ PDF Generator
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
              const txnDate = txn.date?.toDate
                ? txn.date.toDate().toLocaleDateString()
                : txn.completedAt
                ? new Date(txn.completedAt).toLocaleDateString()
                : "N/A";

              return (
                <tr key={txn.id}>
                  <td>{txnDate}</td>
                  <td>{txn.amount}</td>
                  <td>{txn.message || "—"}</td>
                  <td>{txn.usedFor || txn.pingalwadaName || "General Support"}</td>
                  <td className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => { setSelectedTxn(txn); setShowCert(true); }}
                    >
                      Certificate
                    </Button>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => { setSelectedTxn(txn); setShowInvoice(true); }}
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

      {/* 🎖 Certificate Modal */}
      <Modal show={showCert} onHide={() => setShowCert(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>Donation Certificate</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedTxn && (
            <div id="certificate-content" className="p-4 text-center border">
              <h3>🎖 Certificate of Appreciation</h3>
              <p>This certificate is proudly presented to</p>
              <h2>{userName}</h2>
              <p>
                for the generous donation of <strong>₹{selectedTxn.amount}</strong> <br />
                towards <strong>{selectedTxn.pingalwadaName || "our cause"}</strong>.
              </p>
              <p>Date: {new Date(selectedTxn.completedAt || Date.now()).toLocaleDateString()}</p>
              <p>💚 Thank you for your kindness!</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => downloadPDF("certificate-content", "Certificate.pdf")}>
            📥 Download
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 🧾 Invoice Modal */}
      <Modal show={showInvoice} onHide={() => setShowInvoice(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>Donation Invoice</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedTxn && (
            <div id="invoice-content" className="p-4 border">
              <h3>🧾 Donation Invoice</h3>
              <p><strong>Donor Name:</strong> {userName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Amount:</strong> ₹{selectedTxn.amount}</p>
              <p><strong>Donated For:</strong> {selectedTxn.pingalwadaName || "General Support"}</p>
              <p><strong>Payment ID:</strong> {selectedTxn.paymentId || "N/A"}</p>
              <p><strong>Date:</strong> {new Date(selectedTxn.completedAt || Date.now()).toLocaleString()}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => downloadPDF("invoice-content", "Invoice.pdf")}>
            📥 Download
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}