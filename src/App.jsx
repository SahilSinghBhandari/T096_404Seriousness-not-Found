import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Register from "./components/auth/Register";
import About from "./components/Public Panel/About";
import Donation from "./components/Public Panel/Doantion";
import ThankYou from "./components/Public Panel/Thankyou";
import Volunter from "./components/Public Panel/Volunter";
import Medical from "./components/Public Panel/Medical";
import Dashboard from "./components/admin/Dashboard";
import PingalwadaAdminPanel from "./components/Pingalwada/PingalwadaAdminPanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Jobs from "./components/Public Panel/jobs";
import Login from "./components/auth/login";
import History from "./components/Public Panel/History";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* ✅ Public routes with Navbar (inside Layout) */}
          <Route path="" element={<Layout />}>
            <Route path="/" element={<About />} />
            <Route path="/donate" element={<Donation />} />
            <Route path="/thankyou" element={<ThankYou/>} />
            <Route path="/volunteer" element={<Volunter />} />
            <Route path="/medical" element={<Medical />} />
            <Route path="/job" element={<Jobs/>} />
            <Route path="/history" element={<History/>} />
            <Route path="/pingalwada-admin" element={<PingalwadaAdminPanel />} />
          </Route>

      
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Admin routes */}
          <Route path="/admin" element={<Dashboard/>} />
        </Routes>
      </BrowserRouter>

      {/* ✅ Toast container for global toasts */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;

