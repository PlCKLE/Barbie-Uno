const numberOfPlayers = 4;
var gameState = 1;  // When gameState is 0, the game is over


// Code to get user inputs in terminal for Node.js
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => {
        readline.question(question, (answer) => resolve(answer));
    });
}

class Card {

    static COLORS = ["red", "green", "blue", "yellow", "wild"];
    static VALUES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "skip", "reverse", "+2"];
    static SPECIAL = ["changecolor", "+4"];

    constructor(color, value) {
        this.color = color;         // red, green, blue, yellow, wild
        this.value = value;         // number like "1", "2", or the action "skip", "+4", "+2", "reverse", "changecolor"
    }

    toString() {
        return this.color + " " + this.value;
    }

// We can access card information by doing card.color and card.value

}

class Player {

    constructor(id, hand){
        this.id = id;           // To identify if this is player 1, 2, or 3
        this.hand = hand;
    }

    play(index) {

        console.log("Player " + (this.id + 1).toString() + " places a " + this.hand[index].color + " " + this.hand[index].value);

        this.hand.splice(index, 1);

    }

}

function createDeck() {
    // Creates array of 108 randomly shuffled cards.
    const deck = [];
    for (let i = 0; i < Card.COLORS.length - 1; i++) {

        deck.push(new Card(Card.COLORS[i], "0"));      // Each color only has one zero card

        for (let j = 1; j < Card.VALUES.length; j++) {
            deck.push(new Card(Card.COLORS[i], Card.VALUES[j]));
            deck.push(new Card(Card.COLORS[i], Card.VALUES[j]));
        }

    }

    for (let i = 0; i < Card.SPECIAL.length; i++) {
        
        for (let j = 0; j < 4; j++) {
            deck.push(new Card("wild", Card.SPECIAL[i]));
        }
    
    }

    shuffle(deck);
    return deck;
}

function shuffle(array) {
    // Stole this from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

}

function deal(deck, player, cardsDealt) {
    for (let dealtIterator = 0; dealtIterator < cardsDealt; dealtIterator ++) {
        player.hand.push(deck.pop());
    }
}

function printHand(hand) {
    for (let i = 0; i < hand.length; i++) {
        console.log(i + ' ' + hand[i])
    }
    console.log();
}

function randomInsert(deck, card) {
    // Inserts card randomly into deck
    deck.push(card);
    tempRandomIndex = Math.floor(Math.random() * (deck.length - 1));
    [deck[deck.length-1], deck[tempRandomIndex]] = [deck[tempRandomIndex], deck[deck.length-1]];
}


function isValidPlay(cardOnPile, cardPlayed) {
    // Checks if it is valid to play cardPlayed on cardOnPile
    return (cardPlayed.color == cardOnPile.color || cardPlayed.color == "wild" || cardPlayed.value == cardOnPile.value)
}

function drawCard(player, deck, discardPile) {
    // Makes a player draw one card. If the card is valid play, it is automatically played. If it can't be played, it is kept by the player.
    tempCard = deck.pop();
    
    if (isValidPlay(discardPile[0], tempCard)) {
        randomInsert(deck, discardPile[0]);
        discardPile[0] = tempCard;
        console.log("Player " + (player.id + 1).toString() + " draws and places a " + tempCard.color + " " + tempCard.value);
        return 1;
    }
    else {
        player.hand.push(tempCard);
        console.log("Card drawn: " + tempCard);
        return 0;    
    }
}

function stupidDrawCard(player, deck) {
    // Makes a player draw one card. Doesn't check if the card is a valid play (used for stuff like +2s and +4s)
    tempCard = deck.pop();
    player.hand.push(tempCard);
    console.log("Card drawn: " + tempCard);
}

async function main() {
    deck = createDeck();

    // for (index in hands){
    //     printHand(hands[index])
    // }

    // console.log(deck.length)

    // Creating players
    const players = []

    for (let i = 0; i < numberOfPlayers; i++) {
        players.push(new Player(i, []));
    }

    //Deals 7 cards to all players
    for(let playerIndex = 0; playerIndex < players.length; playerIndex ++) {
        deal(deck,players[playerIndex],7)
    }

    discardPile = [];
    discardPile.push(deck.pop());

    var counter = 0;    // Counter that goes up each turn. Only used for testing purposes.
    var tracker = 0;    // Tracker keeps track of what player's turn it is.
    var direction = 1;   // Tracks the direction we're going in. 1 for incrementing and -1 for decrementing.
    var pendingCards = 0;   // How many cards are pending to be drawn by a player?

    while (gameState != 0) {
        
        if (tracker < 0) {
            tracker = Math.abs((tracker + numberOfPlayers) % numberOfPlayers);  // If it's negative, add numberOfPlayers to bring it back in bounds and make the modulo properly loop
        }
        else {tracker = Math.abs(tracker % numberOfPlayers);}

        console.log('\nCard on top of discard pile:')
        console.log(discardPile[0]);
        console.log('\nPlayer ' + (tracker + 1) + ' choose your card:')
        console.log("-1 Draw cards")
        printHand(players[tracker].hand);
        
        var valid = 0

        if (pendingCards < 1) {
            while (valid == 0) {
                const choice = parseInt(await ask("Choose the index of the card to play:"));

                if (choice >= players[tracker].hand.length || choice < -1) {
                    console.log("Pick an option. Index is not valid.\n")
                }// Invalid selection

                else if (choice == -1){
                    
                    while (valid == 0) {    // Loop is done until a valid card is drawn and played
                        
                        valid = drawCard(players[tracker], deck, discardPile);

                        // Behavior of special cards (in case player draws a reverse, skip, +2, etc)
                        switch(discardPile[0].value) {

                        case "reverse":
                            direction = -1*direction;
                            if (tracker < 0) {
                                tracker = Math.abs((tracker + numberOfPlayers) % numberOfPlayers);  // If it's negative, add numberOfPlayers to bring it back in bounds and make the modulo properly loop
                            }
                            else {tracker = Math.abs(tracker % numberOfPlayers);}

                            break;

                        case "skip":
                            tracker = tracker + direction;
                            if (tracker < 0) {
                                tracker = Math.abs((tracker + numberOfPlayers) % numberOfPlayers);  // If it's negative, add numberOfPlayers to bring it back in bounds and make the modulo properly loop
                            }
                            else {tracker = Math.abs(tracker % numberOfPlayers);}

                            break;

                        case "+2":
                            pendingCards += 2;
                            break;
                        default:

                        }
                    }

                }// End of drawing logic
                        
                else if (isValidPlay(discardPile[0], players[tracker].hand[choice])){
                    
                    valid = 1;

                    // Place card previously on top of discard pile into deck randomly
                    randomInsert(deck, discardPile[0])

                    // Place played card into discard pile
                    discardPile[0] = players[tracker].hand[choice];
                    players[tracker].play(choice);

                    // Behavior of special cards
                    switch(discardPile[0].value) {
                        case "reverse":
                            direction = -1*direction;
                            if (tracker < 0) {
                                tracker = Math.abs((tracker + numberOfPlayers) % numberOfPlayers);  // If it's negative, add numberOfPlayers to bring it back in bounds and make the modulo properly loop
                            }
                            else {tracker = Math.abs(tracker % numberOfPlayers);}
                            break;
                        
                        case "skip":
                            tracker = tracker + direction;
                            if (tracker < 0) {
                                tracker = Math.abs((tracker + numberOfPlayers) % numberOfPlayers);  // If it's negative, add numberOfPlayers to bring it back in bounds and make the modulo properly loop
                            }
                            else {tracker = Math.abs(tracker % numberOfPlayers);}
                            break;

                        case "+2":
                            pendingCards += 2;
                            break;
                        default:

                    }

                }
                else {
                    console.log("Card cannot be played.\n")
                }
            
            }
        } // While loop for standard turn (no +2s or +4s)
        
        else {
            console.log("Play a +2 to counter or draw " + pendingCards + " cards.");
            
            while (valid == 0) {
                const choice = parseInt(await ask("Choose the index of the card to play:"));

                if (choice >= players[tracker].hand.length || choice < -1) {
                    console.log("Pick an option. Index is not valid.\n")
                }// Invalid selection

                else if (choice == -1){
                    
                    while (pendingCards > 0) {    // Loop is done until a valid card is drawn and played
                        pendingCards--;
                        stupidDrawCard(players[tracker], deck);
                    }

                } // End of drawing logic
                        
                else if (players[tracker].hand[choice].value == "+2"){
                    
                    valid = 1;

                    // Place card previously on top of discard pile into deck randomly
                    randomInsert(deck, discardPile[0])

                    // Place played card into discard pile
                    discardPile[0] = players[tracker].hand[choice];
                    players[tracker].play(choice);

                    pendingCards += 2; // Add two cards for the next player

                }
                else {
                    console.log("Card cannot be played.\n")
                }
            
            } // While loop for countering a +2
        }

        if (players[tracker].hand.length == 0) {
            gameState = 0;
            console.log("Player " + players[tracker].id + " wins.");
        }


        if (direction == 1) {
            tracker++;
        }
        else {
            tracker--;
        }

        counter++;
        valid = 0;

    }

}

main();