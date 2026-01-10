import { games } from "./websocket-connection-handler.js"
import { generateDeck } from "./game-logic.js"
import { shuffle } from "./game-logic.js" //TODO: to be used when no more cards exist in deck.
import { deal } from "./game-logic.js"

export function initializeGameEventHandlers(socket) {


    socket.on("startGame", (identification, gameCode) => {
        if(games[gameCode].gameOwner != identification) {
            socket.emit("startFailure", "You are not the owner of this game!");
        }
        else {
            games[gameCode].players.map((player => {
                player.socket.emit("gameStart");
            }))
            gameStartSetup(games[gameCode])
        }
    });


    socket.on("playCards",(identification, gameCode, cards, uno, callback) => {
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }

        const playerHand = game.players.find((player) => player.id == identification).hand;
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
        //If all checks pass, remove cards from hand and add it to discard pile.
        if(validPlay && validStacking && cardExistsInHand && game.canPlay) {
           game.players[game.playingIndex].hand = playerHand.filter(card => !cards.includes(card)) 
           cardsMinusFirstCard = cards.filter(card => card !== firstCard);
           game.discardPile = [firstCard, ...cardsMinusFirstCard, ...game.discardPile]

           if(uno && player.hand.length <= 1) {
                callback({uno: true})
            }
            else if (uno) {
                callback({uno: false})
            }
        }
        else {
            callback({success: false})
            return;
        }

        //Move onto the next player
        nextPlayer(game);

        //If the discarded cards were plus two or four, deliver that to the next player.
        updatePlayers(game);
        if(firstCard.rank === "+2") {
            game.drawCounter = 2 * cards.length
            deliverDrawCounter("+2");
        }
        else if(firstCard.rank === "+4"){
            game.drawCounter = 4 * cards.length
            deliverDrawCounter("+4");
        }
        
    });


    socket.on("draw", (identification, gameCode, forced, callback) => {
        //WARNING: No validation if the hand is actually forced or not. Leaves an avenue for cheating.
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }
        const player = game.players.find((player) => player.id == identification)

        const card = deal(game.deck,1);
        player.hand.push(card)

        if(game.drawBehavior === "once" || !forced) {
            nextPlayer(game);
            updatePlayers(game);
            return;
        }
        else if(forced) {
            //code that draws till card is found.
        }
        nextPlayer(game);
        updatePlayers(game);

    })
    socket.on("accuseUno", (identification, gameCode, accused, callback) => {
        //actions that do not require a turn do not currently check for identification. This does mean anyone can accuse of uno, even if they aren't in the game. TOFIX later.
        const game = games[gameCode]

        const accusedPlayer = game.players.find((player) => player.id === accused);
        if(accusedPlayer.uno === false && accusedPlayer.hand.length === 1) {
            deal(game.deck,2)((card) => accusedPlayer.hand.push(card));
            accusedPlayer.socket.emit("forceUpdate");
        }
        else {
            callback({sucess: false})
        }



    })
    socket.on("accept+4", (identification, gameCode, callback) => {
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }
        const player = game.players.find(player => player.id === identification)
        const cards = deal(game.deck,game.drawCounter);
        cards.map((card) => player.hand.push(card));
        game.drawCounter = 0;
        nextPlayer();
        updatePlayers();



    })
    socket.on("counter+4", (identification, gameCode, cards, callback) => {
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }

        

    })
    socket.on("accept+2", (identification,gameCode, callback) => {
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }
        const player = game.players.find(player => player.id === identification)
        const cards = deal(game.deck,game.drawCounter);
        cards.map((card) => player.hand.push(card));
        game.drawCounter = 0;
        nextPlayer();
        updatePlayers();
        callback({status: "success", message: "drew cards!"})



    });
    socket.on("counter+2", (identification, gameCode, cards, callback) => {
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }



    });
    socket.on("win",(identification, gameCode, callback) => {
        const game = games[gameCode]
        if (!isPlayersTurn(game,identification)) {
            callback({status: "failed", message:"It is not your turn!"})
        }


        //if draw two or four, give chance for players to attack around lol
        //perhaps dont include this as a different event and instead just put it in the play hand event.
    })
    socket.on("endGame", (identification,gameCode) => {

    })

    socket.on("update", (identification, gameCode, callback) => {
        const game = games[gameCode];
        const self = game.players.find(player => player.id === identification);
        const others = game.players.filter(player => player.id !== identification);
        const clonedSelf = {...self}
        const clonedOthers = [];
        others.map((other) => {
            clonedOthers.push({...other})
        })

        clonedOthers.map((other) => {
            other.hand = other.hand.length;
            other.identification = null;
            other.socket = null;
        });
        clonedSelf.socket = null;
        clonedSelf.identification = null;
        callback({self: clonedSelf, others: clonedOthers, discardTopCard: game.discardPile[game.discardPile.length -1], isFinished: game.isFinished});
    })
    socket.on("action",(identification, gameCode, action) => {
        const game = games[gameCode];
        if(action.colorChoice) {
            game.discardPile[game.discardPile.length -1].color = action.colorChoice
            nextPlayer(game);
            updatePlayers(game);
        }
            
    });
}




function gameStartSetup(game) {
    game.deck = generateDeck();
    game.playingIndex = 0;
    game.players.map((player => {
                player.hand = deal(game.deck,5);
            }));
    game.direction = "clockwise";
    game.drawBehavior = "once"

    var discardStartingCard = deal(game.deck,1);
    game.discardPile.push(discardStartingCard);
    updatePlayers(game);
    if(discardStartingCard.special) {
        game.players[0].socket.emit("doAction","chooseColor");
        if(discardStartingCard.rank === "+4")
            deliverDrawCounter("+2");
        else if (discardStartingCard.rank === "+2") 
            deliverDrawCounter("+4");
    }
}


function isPlayersTurn(game, identification) {
    if (game.players.find((player) => player.id == identification) != game.players[game.playingIndex]) {
        return false;
    }
    return true;
}

function nextPlayer(game) {
    if(game.direction === "clockwise")
        if(game.playingIndex + 1 > game.players.length - 1)
            game.playingIndex = 0;
        else
            game.playingIndex ++;
    else
        if(game.playingIndex - 1 < 0)
            game.playingIndex = game.players.length - 1;
        else
            game.playingIndex --;
}

function deliverDrawCounter(rank,gameCode) {
    const game = games[gameCode];
    if(rank === "+2")
        game.player[game.playingIndex].socket.emit("drawTwo",game.drawCounter)
    else
        game.player[game.playingIndex].socket.emit("drawFour",game.drawCounter)

}

function updatePlayers(game) {
    game.players.map((player) => {
        player.socket.emit("forceUpdate");
    })
}