import { Card } from "../../components/Card"
import { GameUI } from "../../components/GameUI";
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client';
import { useNavigate } from "react-router-dom"

const URL = "http://localhost:5000"
export const socket = io(URL, {
  autoConnect: false
});
const imageLink = "https://images.ctfassets.net/l7h59hfnlxjx/582Lx8AhvXHgRLXagk73lV/ef827f6b381202b112b61e218d8e3154/President_Obama_Headshot__Economic_Inclusion___Photo_by_Pari_Dukovic_courtesy_of_Penguin_Random_House_.jpg?q=75&w=1014&fm=webp"
export function Game() {
    const [identification,setIdentifitcaiton] = useState("");
    const [gameCode, setGameCode] = useState("");
    const [gameJoined,setGameJoined] = useState(false);
    const [create, setCreate] = useState(false);
    const [gamePassword,setGamePassword] = useState();
    
    useEffect(() => {
        socket.on("credentialsRequest",callbackCredentials)
        socket.on("gameCodeDelivery",gameCodeDelivery);
        console.log("Added sockets!")
        return () => {
            socket.off("credentialsRequest",callbackCredentials)
            socket.off("gameCodeDelivery",gameCodeDelivery)
            console.log("Removed sockets!")
        }
    },[identification,gameCode])

    return (
        <div>
            {!gameJoined && (
                <div>
                    {
                    /*
                    <div>
                    <Card rank = {1} color = "blue" key = {1} cardIndex = {1} left = "20px" imageLink={imageLink} />
                    <Card rank = {1} color = "blue" key = {2} cardIndex = {2} left = "40px" imageLink={imageLink} />
                    <Card rank = {1} color = "blue" key = {3} cardIndex = {3} left = "60px" imageLink={imageLink} />
                    <Card rank = {1} color = "blue" key = {4} cardIndex = {4} left = "80px" imageLink={imageLink} />
                    <Card rank = {1} color = "blue" key = {5} cardIndex = {5} left = "100px" imageLink={imageLink} />
                    <Card rank = {1} color = "blue" key = {6} cardIndex = {6} left = "120px" imageLink={imageLink}/>
                    <Card rank = {1} color = "blue" key = {7} cardIndex = {7} left = "140px" imageLink={imageLink}/>
                    </div>
                    */
                    }
                    <p>Create a new game?</p>
                    <input type="checkbox" placeholder="create?" value={create} onChange={changeCreate} />
                    <input placeholder="gameCode" value={gameCode} onChange={changeGameCode}/>
                    <input placeholder="Identification" value={identification} onChange={changeIdentification}/>
                    <button onClick={connect}>Connect</button>
                </div>
            )
            }   
            {gameJoined && (
                <div>
                    <GameUI identification={identification} gameCode={gameCode} socket={socket}/>
                </div>
            )}
        </div>
    )


    function callbackCredentials(empty,callback) {
            callback({
                create: create,
                identification: identification,
                gamePassword: gamePassword,
                gameCode: gameCode
            })
    }
    function gameCodeDelivery(gameCode) {
        setGameCode(gameCode);
        console.log("Gamecode recieved!");
        setGameJoined(true);
    }
    function changeGameCode(element) {
        setGameCode(element.target.value);
    }
    function changeIdentification(element) {
        setIdentifitcaiton(element.target.value);
    }
    function changeCreate() {
        setCreate(!create);
    }
    function connect() {
            socket.connect()
        }
}