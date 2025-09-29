import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import About from "./components/Public Panel/about"
import Layout from "./components/layouts/Layout"
function App() {

  return (
     <>
     <BrowserRouter>
      <Routes>
        <Route path="" element={<Layout/>}>
        <Route path="/about" element={<About/>}/>
        </Route>
      </Routes>
     </BrowserRouter>
     </>
  )
}

export default App
