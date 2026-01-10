import { useState, useEffect } from 'react'
import { io } from 'socket.io-client';

const URL = "http://localhost:5000"
export const socket = io(URL, {
  autoConnect: false
});
export function Socket() {

    const [gameCode, setGameCode] = useState()
    const [create, setCreate] = useState(false)
    const [endpoint, setEndpoint] = useState("")
    const [arg, setArg] = useState("")
    const [arg2, setArg2] = useState("")
    const [identification, setIdentifitcaiton] = useState("")
    const [logs, setLogs] = useState("Logs:")
    const [gamePassword, setGamePassword] = useState("")
    useEffect(() => {
        initializeSocketEvents(socket);
        return () => {
            uninitializeSocketEvents(socket);
        }
    },[gameCode,create,endpoint,arg,arg2,identification,gamePassword])
    

    return (
        <div>
            <input type="checkbox" placeholder="create?" value={create} onChange={changeCreate}></input>
            <input placeholder="gameCode" value={gameCode} onChange={changeGameCode}/>
            <input placeholder="URL" value={endpoint} onChange={changeEndpoint}/>
            <input placeholder="arg" value={arg} onChange={changeArg}/>
            <input placeholder="arg2" value={arg2} onChange={changeArg2}/>
            <input placeholder="Identification" value={identification} onChange={changeIdentification}/>
            <button onClick={connect}>Connect</button>
            <button onClick={emit}>Emit</button>
            <button onClick={() => {console.log(create)}}>Check</button>
            <p>{logs}</p>
        </div>
    )
    function connect() {
        socket.connect()
    }
    function initializeSocketEvents(socket) {
        socket.on("gameNotExist",changeLog)
        socket.on("gameEnded",changeLog)
        socket.on("credentialsRequest",callbackCredentials)
        socket.on("gameNotExist",changeLog)
        socket.on("forceUpdate",update)
        socket.on("gameStart", () => {changeLog("The game has begun!")})
        socket.on("startFailure",changeLog);
        socket.on("doAction",(action) => {
            if(action === "chooseColor")
                socket.emit("action",identification,gameCode,{colorChoice: "red"})
        });
        socket.on("drawTwo",(drawCounter) => {
            changeLog("You will be drawing " + drawCounter + "cards!")
            socket.emit("accept+2",identification,gameCode,(response) => {
                changeLog(response)
            })
        });
        socket.on("drawFour",() => {
            changeLog("You will be drawing " + drawCounter + "cards!")
            socket.emit("accept+4",identification,gameCode,(response) => {
                changeLog(response.message)
            })
        });
        socket.on("gameCodeDelivery", (code) => {setGameCode(code)})
    }
    function uninitializeSocketEvents(socket) {
        socket.off("gameNotExist",changeLog)
        socket.off("gameEnded",changeLog)
        socket.off("credentialsRequest",callbackCredentials)
        socket.off("gameNotExist",changeLog)
        socket.off("forceUpdate",update)
        socket.off("gameStart")
        socket.off("startFailure",changeLog);
        socket.off("doAction");
        socket.off("drawTwo");
        socket.off("drawFour");
        socket.off("gameCodeDelivery")
    }
    function changeLog(message) {
        setLogs(logs + "\n" + message);
    }
    function update() {
        socket.emit("update",identification,gameCode,(response) => {
            setLogs(logs + "\n" + "Update Recieved!\n Your Data: " + response.self
                 + "\nOther's Data: " + response.others
                  + "\nThe card of the discard pile is currently " + response.discardPile
                   + "\nIs the game finished: " + response.isFinished)
        });
    }
    function emit() {
        if(arg !== "" && arg2 !== "")
            socket.emit(endpoint,identification,gameCode,arg,arg2)
        else if(arg !== "")
            socket.emit(endpoint,identification,gameCode,arg)
        else 
            socket.emit(endpoint,identification,gameCode)
    }


    function changeGameCode(element) {
        setGameCode(element.target.value);
    }
    function changeEndpoint(element) {
        setEndpoint(element.target.value);
    }
    function changeArg(element) {
        setArg(element.target.value);
    }
    function changeArg2(element) {
        setArg2(element.target.value);
    }
    function changeIdentification(element) {
        setIdentifitcaiton(element.target.value);
    }
    function changeCreate() {
        setCreate(!create);
        console.log(create);
    }
    function callbackCredentials(empty,callback) {
            console.log("Create status: " + create);
            callback({
                create: create,
                identification: identification,
                gamePassword: gamePassword,
                gameCode: gameCode
            })
    }
}
