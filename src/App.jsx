import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import About from "./components/Public Panel/about"
import Layout from "./components/layouts/Layout"
import UrgentNeeds from "./components/Public Panel/UrgentNeeds"
function App() {

  return (
     <>
     <BrowserRouter>
      <Routes>
        <Route path="" element={<Layout/>}>
        <Route path="/about" element={<About/>}/>
        <Route path="/urgent" element={<UrgentNeeds/>}/>
        </Route>
      </Routes>
     </BrowserRouter>
     </>
  )
}

export default App
