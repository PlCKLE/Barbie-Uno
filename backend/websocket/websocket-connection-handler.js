import { initializeGameEventHandlers } from "./websocket-game-events.js"

export const games = [];


export function initializeWebSocketHandlers(websocketServer) {
    websocketServer.on("connection", (socket) => {
        console.log("Someone connected!")
        socket.emit("credentialsRequest","", async(response) => {
            initializeGameEventHandlers(socket);
            if(response.create) {
                const game = {
                    gameCode: games.length,
                    gameOwner: response.identification,
                    gameStarted: false,
                    players: [{id: response.identification, socket: socket}],
                    gamePassword: response.gamePassword,
                    spectators: [],
                    isFinished: false,
                    isStarted: false,
                    discardPile: []
                };
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
    if (response.gamecode > games.size || response.gameCode === "" || response.gameCode == null) {
        socket.emit("gameNotExist","The game does not exist!")
        socket.disconnect(true);
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