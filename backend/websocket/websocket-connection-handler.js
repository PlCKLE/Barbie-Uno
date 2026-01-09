import { initializeGameEventHandlers } from "./websocket-game-events.js"

export const games = [];


export function initializeWebSocketHandlers(websocketServer) {
    websocketServer.on("connection", (socket) => {
        socket.emit("callbackRequest","", async(callback) => {
            initializeGameEventHandlers(socket);
            if(callback.create) {
                const game = {
                    gameCode: games.size + 1,
                    gameOwner: callback.identification,
                    gameStarted: false,
                    gamePlayers: [{id: callback.identification, socket: socket, hand: null}],
                    gamePassword: callback.gamePassword,
                    spectators: [],
                };
                games.push(game);
            }
            else {
                    attemptGameJoin(socket,callback);
            }
        })
    })
}


function attemptGameJoin(socket, callback) {
    if (callback.gamecode > games.size) {
        socket.emit("gameNotExist","The game does not exist!")
        socket.disconnect(true);
    }
    else if(games[callback.gamecode].isFinished) {
        socket.emit("gameEnded","The game has already ended!")
        socket.disconnect(true);
    }
    else if(games[callback.gamecode].isStarted) {
        games[callback.gamecode].spectators.push({id: callback.identification, socket: socket});
    }
    else {
        games[callback.gamecode].gamePlayers.push({id: callback.identification, socket: socket, hand: null});
    }
}