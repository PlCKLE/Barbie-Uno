import { useState, useEffect } from 'react'
import { Card } from "./Card"

export function GameUI({identification, gameCode, socket}) {
    const [hand,setHand] = useState([])
    const [uno,setUno] = useState(false)
    const [discardTopCard,setDiscardTopCard] = useState({})
    const [otherPlayers, setOtherPlayers] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [logs,setLogs] = useState([]) //Temporary way to show other players' card amounts and any other log info.

    useEffect(() => {
        initializeSocketEvents(socket);

        return () => {
            uninitializeSocketEvents(socket);
        }
    },[uno,selectedCards])
    useEffect(() => {
        console.log("These cards are currently selected: ")
        console.log(selectedCards)
    
    },[selectedCards])

    return (
        <div>
            <h2>Gamecode : {gameCode}</h2>
            <button onClick={startGame}>Start Game</button>
            <button onClick={playHand}>Play Hand</button>
            <button onClick={draw}> Draw </button>
            <button onClick={callUno}> Uno </button>
            <Card className="discardCard" key="discard" card={discardTopCard} disableDrag={true} />
            <div className="playerHand" width="2000px" height="2000px">
                {hand.map((card, index) => (<Card key={index} onClick={(element) => {selectHandler(card, element)}} card={card} disableDrag={true}/>))}
            </div>
            {logs.map((log,index) => (<p key={index}>{log}</p>))}
        </div>
    )





    //Game Functions
    function select(card) {
        if(selectedCards.filter((selectedCard) => selectedCard == card)) {
            setSelectedCards(selectedCards.filter((selectedCard) => selectedCard != card))
            return false;//card was unselected
        }
        setSelectedCards([card ,...selectedCards])
        return true; //card was selected
    }
    function selectHandler(card, element) {
        if(select(card)) {
            //Do stuff to make the element shift upwards
        }
        else {
            //Do stuff to make element shift back down
        }
    }
    function insertLog(string) {
        setLogs([...logs, string]);
    }





    //Socket Emit Functions
    function startGame() {
        socket.emit("startGame",identification,gameCode)
    }
    function playHand() {
        socket.emit("playCards",identification,gameCode,selectedCards,uno,(response) => {
            console.log(response.message)
            if(response.uno)
                setUno(response.uno); //Can make a better uno implementation. Requires backend modification though.
        })
    }
    function draw() {
        socket.emit("draw",identification,gameCode,false,(response) => {
            console.log(response.message)
        })
    }
    function callUno() {
        setUno(!uno);
    }






    //Socket Event Handler functions
    function initializeSocketEvents(socket) {
        socket.on("gameNotExist",insertLog)
        socket.on("gameEnded",insertLog)
        socket.on("gameNotExist",insertLog)
        socket.on("forceUpdate",update)
        socket.on("gameStart", () => {insertLog("The game has begun!")})
        socket.on("startFailure",insertLog);
        socket.on("doAction",(action) => {
            if(action === "chooseColor")
                socket.emit("action",identification,gameCode,{colorChoice: "red"})
        });
        socket.on("drawTwo",(drawCounter) => {
            insertLog("You will be drawing " + drawCounter + "cards!")
            socket.emit("accept+2",identification,gameCode,(response) => {
                insertLog(response)
            })
        });
        socket.on("drawFour",() => {
            insertLog("You will be drawing " + drawCounter + "cards!")
            socket.emit("accept+4",identification,gameCode,(response) => {
                insertLog(response.message)
            })
        });
        socket.on("gameCodeDelivery", (code) => {setGameCode(code)})
    }
    function uninitializeSocketEvents(socket) {
        socket.off("gameNotExist",insertLog)
        socket.off("gameEnded",insertLog)
        socket.off("gameNotExist",insertLog)
        socket.off("forceUpdate",update)
        socket.off("gameStart")
        socket.off("startFailure",insertLog);
        socket.off("doAction");
        socket.off("drawTwo");
        socket.off("drawFour");
        socket.off("gameCodeDelivery")
    }
    function update() {
            socket.emit("update",identification,gameCode,(response) => {
                setHand(response.self.hand);
                setDiscardTopCard({...response.discardTopCard});
                insertLog("Card amounts of other players!");
                response.others.map((other) => {insertLog(other.identification + "has " + other.hand + "cards!")});
        })
    }
}