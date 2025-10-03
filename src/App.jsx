// import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
// import Layout from "./components/layouts/Layout"
// import Login from "./components/auth/login"
// import Register from "./components/auth/Register"
// import About from "./components/Public Panel/About"
// import Donation from "./components/Public Panel/Doantion"
// import UrgentNeeds from "./components/Public Panel/UrgentNeeds"
// import ThankYou from "./components/Public Panel/Thankyou"
// import Volunter from "./components/Public Panel/Volunter"
// import Medical from "./components/Public Panel/Medical"
// import Dashboard from "./components/admin/Dashboard"
// import PingalwadaAdminPanel from "./components/Pingalwada/PingalwadaAdminPanel";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // ✅ import styles




// function App() {

//   return (
//      <>
//      <BrowserRouter>
//       <Routes>
//         <Route path="" element={<Layout/>}>
//         <Route path="/" element={<About/>}/>
//         <Route path="/login" element={<Login/>}/>
//         <Route path="/register" element={<Register/>}/>
//         <Route path="/donate" element={<Donation/>}/>
//         {/* <Route path="/urgent" element={<UrgentNeeds/>}/> */}
//         <Route path="/thankyou" element={<ThankYou/>}/>
//         <Route path="/volunteer" element={<Volunter/>}/>
//         <Route path="/medical" element={<Medical/>}/>
//         <Route path="/pingalwada-admin" element={<PingalwadaAdminPanel />} />
// {/*  
//   <Route path="/donation/:pingalwadaId" element={<Donation />} />
//   <Route path="/volunteer/:pingalwadaId" element={<Volunteer />} />
//   <Route path="/pingalwada/:pingalwadaId" element={<PingalwadaUpdates />} /> */}


//         </Route>

//         {/* amin routes*/}
//         <Route path="/admin" element={<Dashboard/>}>

//         </Route>
//       </Routes>
//      </BrowserRouter>
//       {/* ✅ Toast container for global toasts */}
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//      </>
//   )
// }

// export default App


import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import About from "./components/Public Panel/About";
import Donation from "./components/Public Panel/Doantion";
import UrgentNeeds from "./components/Public Panel/UrgentNeeds";
import ThankYou from "./components/Public Panel/Thankyou";
import Volunter from "./components/Public Panel/Volunter";
import Medical from "./components/Public Panel/Medical";
import Dashboard from "./components/admin/Dashboard";
import PingalwadaAdminPanel from "./components/Pingalwada/PingalwadaAdminPanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ import styles

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* ✅ Public routes with Navbar (inside Layout) */}
          <Route path="" element={<Layout />}>
            <Route path="/" element={<About />} />
            <Route path="/donate" element={<Donation />} />
            {/* <Route path="/urgent" element={<UrgentNeeds/>}/> */}
            <Route path="/thankyou" element={<ThankYou />} />
            <Route path="/volunteer" element={<Volunter />} />
            <Route path="/medical" element={<Medical />} />
            <Route path="/pingalwada-admin" element={<PingalwadaAdminPanel />} />
          </Route>

          {/* ✅ Auth routes WITHOUT Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Admin routes */}
          <Route path="/admin" element={<Dashboard />} />
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

