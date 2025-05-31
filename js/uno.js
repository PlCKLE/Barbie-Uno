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

function dealHands(deck, numberOfPlayers = 4, cardsPerPlayer = 7) {
    
    const arrayOfHands = [];    // Array that contains an array of everyone's hand

    for (let i = 0; i < numberOfPlayers; i++) {
        arrayOfHands.push([]);
        for (let j = 0; j < cardsPerPlayer; j++) {
            arrayOfHands[i][j] = deck.pop();
        }
    }

    return arrayOfHands;
}

function printHand(hand) {
    for (let i = 0; i < hand.length; i++) {
        console.log(i + ' ' + hand[i])
    }
    console.log();
}


async function main() {
    deck = createDeck();
    hands = dealHands(deck, numberOfPlayers);

    // for (index in hands){
    //     printHand(hands[index])
    // }

    // console.log(deck.length)

    // Creating players
    const players = []
    for (let i = 0; i < numberOfPlayers; i++) {
        players.push(new Player(i, hands[i]));
    }

    discardPile = [];
    discardPile.push(deck.pop());

    var counter = 0;    // Counter that goes up each turn. Only used for testing purposes.
    var tracker = 0;    // Tracker keeps track of what player's turn it is.

    while (gameState != 0 && counter < 10) {

        tracker = tracker % numberOfPlayers;

        console.log('\nCard on top of discard pile:')
        console.log(discardPile[0]);
        console.log('\nPlayer ' + (tracker + 1) + ' choose your card:')
        printHand(players[tracker].hand);
        
        var valid = 0

        while (valid == 0) {
            const choice = parseInt(await ask("Choose the index of the card to play:"));

            if (choice >= players[tracker].hand.length || choice < 0) {
                console.log("Pick a valid card. Index is not valid.\n")
            }
            else if (players[tracker].hand[choice].color == discardPile[0].color || players[tracker].hand[choice].color == "wild" || players[tracker].hand[choice].value == discardPile[0].value){
                valid = 1;

                // Place card previously on top of discard pile into deck randomly
                deck.push(discardPile[0]);
                tempRandomIndex = Math.floor(Math.random() * (deck.length - 1));
                [deck[deck.length-1], deck[tempRandomIndex]] = [deck[tempRandomIndex], deck[deck.length-1]];

                // Place played card into discard pile
                discardPile[0] = players[tracker].hand[choice];
                players[tracker].play(choice);
            }
            else {
                console.log("Card cannot be played.\n")
            }
        
        }

        tracker++;
        counter++;
        valid = 0;

    }

}

main();