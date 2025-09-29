import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import PublicPanel from "./components/Public Panel/public"
import "./index.css"
function App() {

  return (
     <>
     <BrowserRouter>
      <Routes>
        <Route path="/public" element={<PublicPanel/>}>
        </Route>
      </Routes>
     </BrowserRouter>
     </>
  )
}

export default App
