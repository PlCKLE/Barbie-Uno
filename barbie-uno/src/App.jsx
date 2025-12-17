import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home.jsx"
import { Game } from "./pages/Game/Game.jsx"
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App
