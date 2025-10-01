import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import Layout from "./components/layouts/Layout"
import Login from "./components/auth/login"
import Register from "./components/auth/Register"
import About from "./components/Public Panel/About"
import Donation from "./components/Public Panel/Doantion"
import UrgentNeeds from "./components/Public Panel/UrgentNeeds"
import ThankYou from "./components/Public Panel/Thankyou"
import Volunter from "./components/Public Panel/Volunter"
function App() {

  return (
     <>
     <BrowserRouter>
      <Routes>
        <Route path="" element={<Layout/>}>
        <Route path="/" element={<About/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/donate" element={<Donation/>}/>
        <Route path="/urgent" element={<UrgentNeeds/>}/>
        <Route path="/thankyou" element={<ThankYou/>}/>
        <Route path="/volunteer" element={<Volunter/>}/>
        </Route>
      </Routes>
     </BrowserRouter>
     </>
  )
}

export default App
