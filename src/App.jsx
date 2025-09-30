import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import Layout from "./components/layouts/Layout"
import Login from "./components/auth/login"
import Register from "./components/auth/Register"
import About from "./components/Public Panel/About"
function App() {

  return (
     <>
     <BrowserRouter>
      <Routes>
        <Route path="" element={<Layout/>}>
        <Route path="/about" element={<About/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        {/* <Route path="/urgent" element={<UrgentNeeds/>}/> */}
        </Route>
      </Routes>
     </BrowserRouter>
     </>
  )
}

export default App
