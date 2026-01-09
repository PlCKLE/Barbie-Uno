import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home.jsx"
import { Game } from "./pages/Game/Game.jsx"
import { Socket } from "./pages/Test/Socket.jsx"
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/socket" element={<Socket />}></Route>
      </Routes>
    </BrowserRouter>
  )

}

export default App
