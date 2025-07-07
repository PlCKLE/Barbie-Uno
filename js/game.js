const numberOfPlayers = parseInt(localStorage.getItem('numPlayers'));     // Gets variable stored in local storage from menu.js
var gameState = 1;  // 1 for UNO screen, 2 for POINTS screen, 0 for GAME FINISHED screen


// Get user input
// let questionText;

// function ask(question) {
    
//     return new Promise((resolve) => {
//         questionText.textContent = question + ' ';
//         questionInput.value = '';
//         questionInput.focus();

//         questionInput.addEventListener('keydown', (event) =>{
//             if (event.key == 'Enter') {resolve(questionInput.value);}
//         }
        
//         )}
//     )};

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
    const cardButtons = new Array(hand.length);
    
    const bodyChildren = Array.from(document.body.children);
    for (const child of bodyChildren) {
        if (child.tagName == 'button') {
        child.remove();     // remove all previous buttons on screen
        }
    }

    for (let i = 0; i < hand.length; i++) {
        cardButtons[i] = document.createElement('button');
        cardButtons[i].textContent = hand[i].value;
        cardButtons[i].id = hand[i].color + '_button';
        document.body.appendChild(cardButtons[i]);
    }
}

function randomInsert(deck, card) {
    // Inserts card randomly into deck
    deck.push(card);
    tempRandomIndex = Math.floor(Math.random() * (deck.length - 1));
    [deck[deck.length-1], deck[tempRandomIndex]] = [deck[tempRandomIndex], deck[deck.length-1]];
}


function isValidPlay(cardOnPile, cardPlayed, tempColor) {
    // Checks if it is valid to play cardPlayed on cardOnPile. tempColor is used for special cards
    if (cardOnPile.color != "wild") {
        return (cardPlayed.color == cardOnPile.color || cardPlayed.color == "wild" || cardPlayed.value == cardOnPile.value)
    }
    else {
        return (cardPlayed.color == tempColor || cardPlayed.color == "wild")
    }
}

function drawCard(player, deck, discardPile, tempColor) {
    // Makes a player draw one card. If the card is valid play, it is automatically played. If it can't be played, it is kept by the player.
    tempCard = deck.pop();
    
    if (isValidPlay(discardPile[0], tempCard, tempColor)) {
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
    let tempCard = deck.pop();
    player.hand.push(tempCard);
    // console.log("Card drawn: " + tempCard);
}

async function changeColor() {
    console.log("0 Red\n1 Green\n2 Blue\n3 Yellow")
    const choice = await ask("Pick the index of the color you to switch to:");
    if (choice < 0 || choice > 3) {
        console.log("\nInvaild selection.");
        return changeColor();
    }
    else {
        switch (choice) {
            case 0:
                console.log("Color changed to red.");
                return "red";
            case 1:
                console.log("Color changed to green.");
                return "green";
            case 2:
                console.log("Color changed to blue.");
                return "blue";
            default:
                console.log("Color changed to yellow.");
                return "yellow";
        }
    }
}

async function game() {

    const top = document.getElementById('top');
    top.textContent = numberOfPlayers;


    let deck = createDeck();
    
    // Creating players
    const players = []

    for (let i = 0; i < numberOfPlayers; i++) {
        players.push(new Player(i, []));
    }

    //Deals 7 cards to all players
    for(let playerIndex = 0; playerIndex < players.length; playerIndex ++) {
        deal(deck,players[playerIndex],7)
    }

    let discardPile = [];
    discardPile.push(deck.pop());
    while (discardPile[0].color == "wild" || discardPile[0].value == "+2" || discardPile[0].value == "skip" || discardPile[0].value == "reverse") {
        randomInsert(deck, discardPile[0]);
        discardPile[0] = deck.pop();
    }

    var counter = 0;    // Counter that goes up each turn. Only used for testing purposes.
    var tracker = 0;    // Tracker keeps track of what player's turn it is.
    var direction = 1;   // Tracks the direction we're going in. 1 for incrementing and -1 for decrementing.
    var pendingCards = 0;   // How many cards are pending to be drawn by a player?
    var tempColor; // Cards that change color create a tempColor on top of the discard pile
    const playerTrackerText = document.getElementById('playersTurnText');

    while (gameState != 0) {
        
        if (tracker < 0) {
            tracker = Math.abs((tracker + numberOfPlayers) % numberOfPlayers);  // If it's negative, add numberOfPlayers to bring it back in bounds and make the modulo properly loop
        }
        else {tracker = Math.abs(tracker % numberOfPlayers);}

        console.log('\nCard on top of discard pile:')
        console.log(discardPile[0]);
        if (discardPile[0].color == "wild") {
            console.log("Current color of wild is " + tempColor + ".");
        }
        const playerTrackerText = document.getElementById('playersTurnText');
        playerTrackerText.textContent = 'Player ' + (tracker + 1) + ' choose your card:'
        console.log("-1 Draw cards")
        printHand(players[tracker].hand);
        
        var valid = 0

        if (pendingCards < 1) {
            while (valid == 0) {
                const choice = await ask("Choose the index of the card to play:");

                if (choice >= players[tracker].hand.length || choice < -1) {
                    console.log("Pick an option. Index is not valid.\n")
                }// Invalid selection

                else if (choice == -1){
                    
                    while (valid == 0) {    // Loop is done until a valid card is drawn and played
                        
                        valid = drawCard(players[tracker], deck, discardPile, tempColor);

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

                        case "changecolor":
                            tempColor = await changeColor();
                            break;
                            
                        default:

                        }
                    }

                }// End of drawing logic
                        
                else if (isValidPlay(discardPile[0], players[tracker].hand[choice], tempColor)){
                    
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

                        case "changecolor":
                            tempColor = await changeColor();
                            break;

                        case "+4":
                            tempColor = await changeColor();
                            pendingCards += 4;
                            break;

                        default:

                    }

                }
                else {
                    console.log("Card cannot be played.\n")
                }
            
                }
            } // If statement for if a +2 was played
        
        else if (discardPile[0].color == "wild"){ // Only runs when pending card > 0 and it's a wild card (+4)

            console.log("Play a +4 to counter or draw " + pendingCards + " cards.");
            
            while (valid == 0) {
                const choice = await ask("Choose the index of the card to play:");

                if (choice >= players[tracker].hand.length || choice < -1) {
                    console.log("Pick an option. Index is not valid.\n")
                }// Invalid selection

                else if (choice == -1){
                    
                    while (pendingCards > 0) {    // Loop is done until a valid card is drawn and played
                        pendingCards--;
                        stupidDrawCard(players[tracker], deck);
                        valid = 1
                    }

                } // End of drawing logic
                        
                else if (players[tracker].hand[choice].value == "+4"){
                    
                    valid = 1;

                    // Place card previously on top of discard pile into deck randomly
                    randomInsert(deck, discardPile[0])

                    // Place played card into discard pile
                    discardPile[0] = players[tracker].hand[choice];
                    players[tracker].play(choice);

                    pendingCards += 4; // Add four cards for the next player

                    tempColor = changeColor();

                }
                else {
                    console.log("Card cannot be played.\n")
                }
            
            } // While loop for countering a +4


        }
        
        else {
            console.log("Play a +2 to counter or draw " + pendingCards + " cards.");
            
            while (valid == 0) {
                const choice = await ask("Choose the index of the card to play:");

                if (choice >= players[tracker].hand.length || choice < -1) {
                    console.log("Pick an option. Index is not valid.\n")
                }// Invalid selection

                else if (choice == -1){
                    
                    while (pendingCards > 0) {    // Loop is done until a valid card is drawn and played
                        pendingCards--;
                        stupidDrawCard(players[tracker], deck);
                        valid = 1;
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

        if (players[tracker].hand.length == 1) {
            gameState = 0;
            console.log("Player " + players[tracker].id + " has an UNO.");
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

function clearScreen() {
    const bodyChildren = Array.from(document.body.children);
    for (const child of bodyChildren) {
        if (child.tagName !== 'SCRIPT') {
        child.remove();
        }
    }
}

async function main() {

    if (!Number.isInteger(numberOfPlayers) || numberOfPlayers < 2) {
        clearScreen();
        const warning = document.createElement('h1');
        warning.textContent = "You must go through the menu first.";
        document.body.appendChild(warning);
        await new Promise(resolve => setTimeout(resolve, 2000));
        window.location.replace("menu.html");
    } else {
        game();
    }

}

document.addEventListener("DOMContentLoaded", main);