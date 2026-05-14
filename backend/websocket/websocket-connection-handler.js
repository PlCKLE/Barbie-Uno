import { initializeGameEventHandlers } from "./websocket-game-events.js"

export const games = [];


export function initializeWebSocketHandlers(websocketServer) {
    websocketServer.on("connection", (socket) => {
        console.log("Someone connected!")
        socket.emit("credentialsRequest","", async(response) => {
            //Injects all game-logic socket events to that particular socket.
            initializeGameEventHandlers(socket);
            if(response.create) {
                const game = {
                    gameCode: games.length,
                    gameOwner: response.identification,
                    players: [{id: response.identification, socket: socket}],
                    gamePassword: response.gamePassword,
                    spectators: [],
                    isFinished: false,
                    isStarted: false,
                    discardPile: []
                };
                //Creates game
                games.push(game);
                socket.emit("gameCodeDelivery",game.gameCode)
            }
            else {
                    attemptGameJoin(socket,response);
            }
        })
    })
}


function attemptGameJoin(socket, response) {
    if (response.gameCode > games.length - 1 || response.gameCode === "" || response.gameCode == null) {
        socket.emit("gameNotExist","The game does not exist!")
        socket.disconnect(true);
    }
    else if(games[response.gameCode] == null) {
        console.log("This should never happen??? Game" + response.gameCode + " was attempted to be accessed and exists in array, but was null.")
        socket.emit("gameNotExist","The game.. is null? Ask the creator to make a new game.")
    }
    else if(games[response.gamecode].isFinished) {
        socket.emit("gameEnded","The game has already ended!")
        socket.disconnect(true);
    }
    else if(games[response.gamecode].isStarted) {
        games[response.gamecode].spectators.push({id: response.identification, socket: socket});
    }
    else {
        games[response.gamecode].gamePlayers.push({id: response.identification, socket: socket, hand: null, uno: false});
    }
}