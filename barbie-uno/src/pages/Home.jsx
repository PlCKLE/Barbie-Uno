import { useNavigate } from "react-router-dom"
export function Home() {

    const navigate = useNavigate();
    return (
        <div>
            <h1>Welcome to Barbie Uno!</h1>
            <button onClick={() => {navigate("/game")}}>Click me to create/join a game!</button>
            <button onClick={() => {navigate("/socket")}}>WEBSOCKET DEBUG AREA.</button>
        </div>
    )
}