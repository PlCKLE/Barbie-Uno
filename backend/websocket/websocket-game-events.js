import { games } from "./websocket-connection-handler.js"
//import cardlogic
//such as deal()
//generateDeck()
//

export function initializeGameEventHandlers(socket) {


    socket.on("startGame", (identification, gameCode) => {
        if(games[gameCode].gameOwner != identification) {
            socket.emit("startFailure", "You are not the owner of this game!");
        }
        else {
            games[gameCode].gamePlayers.map((player => {
                player.socket.emit("gameStart");
            }))
            gameStartSetup(games[gameCode])
        }
    });


    socket.on("playCards",(cards, identification, gameCode, callback) => {
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }

        const playerHand = game.gamePlayers.find((player) => player.id == identification).hand;
        var validPlay = false;
        var validStacking = true;
        var cardExistsInHand = true;
        var firstCard = null;
        cards.map((card) => {
            //check to see if card can be played on current discard pile
            if (game.discardPile[0].rank == card.rank || game.discardPile[0].color == card.color || card.color == "wild") {
                validPlay = true;
                firstCard = card;
            }
            //check to see if cards being discarded are identical (same color and rank stacking rule)
            if (cards[0].rank != card.rank || cards[0].color != card.color) {
                validStacking = false;
            }
            //check to see if cards being discarded actually exist in the players hand.
            if(playerHand.find((handCard) => handCard == card) === undefined) {
                cardExistsInHand = false;
            }
        })
        if(validPlay && validStacking && cardExistsInHand) {
           game.gamePlayers[game.playingIndex].hand = playerHand.filter(card => !cards.includes(card)) 
           cardsMinusFirstCard = cards.filter(card => card !== firstCard);
           game.discardPile = [firstCard, ...cardsMinusFirstCard, ...game.discardPile]
        }

        nextPlayer(game);
    });
    socket.on("uno",(identification, gameCode, callback) => {
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }


        if(valid) {
            games[gameCode].gamePlayers.find((player) => player.id == identification).uno = true;
        }
        else 
            callback
    })

    socket.on("draw", (identification, gameCode, callback) => {
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }



    })
    socket.on("accuseUno", (identification, accussee, gameCode, callback) => {
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }



    })
    socket.on("acceptDrawFour", (identification,gameCode, callback) => {
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }



    })
    socket.on("counterDrawFour", (cards,identification,gameCode, callback) => {
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }

        

    })
    socket.on("acceptDrawTwo", (identification,gameCode, callback) => {
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }



    });
    socket.on("counterDrawTwo", (cards,identification,gameCode, callback) => {
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }



    });
    socket.on("win",(identification,gameCode, callback) => {
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }


        //if draw two or four, give chance for players to attack around lol
        //perhaps dont include this as a different event and instead just put it in the play hand event.
    })
    socket.on("endGame", (identification,gameCode) => {
        
    })
}




function gameStartSetup(game) {
    game.deck = generateDeck();
    game.playingIndex = 0;
    var discardStartingCard = deck.pop;
    game.gamePlayers.map((player => {
                player.hand = dealCards(game.deck,5);
            }));
    game.direction = "clockwise";


    game.discardPile.push(discardStartingCard);
    if(discardStartingCard.special) {
        game.gamePlayers[0].socket.emit("doAction","chooseColor");
        if(discardStartingCard.rank == "+4")
            game.gamePlayers[0].socket.emit("drawFour")
    }
    else if (discardStartingCard.rank == "drawTwo") {
        game.gamePlayers[0].socket.emit("drawTwo");
    }
}


function isPlayersTurn(game, identification) {
    if (game.gamePlayers.find((player) => player.id == identification) != game.gamePlayers[game.playingIndex]) {
        return false;
    }
    return true;
}

function nextPlayer(game) {
    if(game.direction === "clockwise")
        if(game.playingIndex + 1 > game.gamePlayers.length - 1)
            game.playingIndex = 0;
        else
            game.playingIndex ++;
    else
        if(game.playingIndex - 1 < 0)
            game.playingIndex = game.gamePlayers.length - 1;
        else
            game.playingIndex --;
}