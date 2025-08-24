const numberOfPlayers = 8;

// Function to display a card based on its color and value
const playerHandDiv = document.getElementById('playerHand');
const topHandDiv = document.getElementById('topHand');
const leftHandDiv = document.getElementById('leftHand');
const rightHandDiv = document.getElementById('rightHand');

const playerTrackerText = document.getElementById('playersTurnText');

function clearScreen() {
    const bodyChildren = Array.from(document.body.children);
    for (const child of bodyChildren) {
        if (child.classList.contains('image-button')) {
        child.remove();
        }
    }
}

class Card {

    static COLORS = ["red", "green", "blue", "yellow", "wild"];
    static VALUES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "skip", "reverse", "+2"];
    static SPECIAL = ["changecolor", "+4", "barbie"];

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
    // Creates array of 110 randomly shuffled cards.
    const deck = [];
    for (let i = 0; i < Card.COLORS.length - 1; i++) {

        deck.push(new Card(Card.COLORS[i], "0"));      // Each color only has one zero card

        for (let j = 1; j < Card.VALUES.length; j++) {
            deck.push(new Card(Card.COLORS[i], Card.VALUES[j]));
            deck.push(new Card(Card.COLORS[i], Card.VALUES[j]));
        }

    }

    for (let i = 0; i < Card.SPECIAL.length; i++) {
        // Create 4 cards of each special type
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

// Color/Value Mappings
const colorMap = {
    "wild": 0,
    "yellow": 1,
    "red": 2,
    "blue": 3,
    "green": 4
};

const valueMap = {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "+2": 10,
    "skip": 11,
    "reverse": 12,
    "changecolor": 13,
    "+4": 14,
    "barbie": 15
};


function displayCard(color, value) {
    // This function creates a button with a background image representing the card.
    // The button's background position is set based on the card's color and value.

    let imageButton = document.createElement("div");
    imageButton.style.backgroundImage = "url('../assets/sprite_sheet.png')";
    imageButton.classList.add("image-button");
    imageButton.dataset.clicked = 0; // Initialize clicked state
    
    const width = 168; // Width of each card in the sprite sheet
    const height = 258; // Height of each card in the sprite sheet
    
    try {
    const x = valueMap[value] * width; // Calculate x position based on value
    const y = colorMap[color] * height; // Calculate y position based on color
    imageButton.style.backgroundPosition = `-${x}px -${y}px`;
    }
    catch (error) {
        console.error("Error displaying card:", error);
        imageButton.style.backgroundPosition = "0px 0px"; // Default position
    }
    
    imageButton.addEventListener("click", function() {
    if (imageButton.dataset.clicked == 0) {
        console.log("Button clicked");
        imageButton.dataset.clicked = 1;
        imageButton.style.filter = "brightness(70%)";
    }
    else {
        console.log("Button unclicked");
        imageButton.dataset.clicked = 0;
        imageButton.style.filter = "brightness(100%)";
    }
    
    });

    playerHandDiv.appendChild(imageButton);

}

function displayScreen(playerID) {
    // Display hand of the player that matches playerID
    // All other hands are hidden and displayed on the side
    clearScreen();

    playerTrackerText.textContent = `Player ${playerID + 1}'s Turn`; // **Place outside of drawScreen later**
    
    for (let i = 0; i < players[playerID].hand.length; i++) {
        displayCard(players[playerID].hand[i].color, players[playerID].hand[i].value);
    }

    for (let i = 0; i < numberOfPlayers; i++) {
        
        if (i !== playerID) {
            // Display back of card for other players
            
            for (let j = 0; j < players[i].hand.length; j++) {
                
                let image = document.createElement("div");
                image.style.backgroundImage = "url('../assets/sprite_sheet.png')";
                image.classList.add("image");
                image.style.backgroundPosition = "0px 0px"; // Back of card position
                let gap = 165; // Gap between hands
                
                if (i == (playerID+1) % numberOfPlayers) {
                    rightHandDiv.appendChild(image);
                } else if (i == playerID - 1 || i == numberOfPlayers + (playerID - 1) % numberOfPlayers) {
                    leftHandDiv.appendChild(image); 
                } else {
                    if (numberOfPlayers == 5) {
                        image.style.marginLeft = "-100px";
                    }
                    if (numberOfPlayers == 6) {
                        image.style.marginLeft = "-120px";
                        gap = 200;
                    }
                    if (numberOfPlayers == 7) {
                        image.style.marginLeft = "-140px";
                        gap = 250;
                    }
                    if (numberOfPlayers == 8) {
                        image.style.marginLeft = "-150px";
                        gap = 300;
                    }

                    
                    topHandDiv.appendChild(image);
                    if (j == players[i].hand.length - 1 && !(i == playerID - 1 || i == numberOfPlayers + (playerID - 1) % numberOfPlayers) ){
                        image.style.backgroundPosition = "-165px 0px"; // Display Nothing as a spacer
                        image.style.width = `${gap}px`;
                        topHandDiv.appendChild(image);
                    }
                }
            }
        }
    }

}

function deal(deck, player, cardsDealt) {
    for (let dealtIterator = 0; dealtIterator < cardsDealt; dealtIterator ++) {
        player.hand.push(deck.pop());
    }
}

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

displayScreen(2); // Start with player 0's turn