// Function to display a card based on its color and value
const playerHandDiv = document.getElementById('playerHand');
const topHandDiv = document.getElementById('topHand');
const leftHandDiv = document.getElementById('leftHand');
const rightHandDiv = document.getElementById('rightHand');
const discardDiv = document.getElementById('middleDivision');

// Audio elements
const selectsfx = document.getElementById('clickSound');
const hoversfx = document.getElementById('hoverSound');
const confirmsfx = document.getElementById('confirmSound');

// Game elements
var discardPiles = [[], []];    // Two discard piles for the game; top of the discard pile stored in discardPile[0][0] and discardPile[1][0]
var counter = 0;    // Counter that goes up each turn. Only used for testing purposes.
var tracker = 0;    // Tracker keeps track of what player's turn it is.
var direction = 1;   // Tracks the direction we're going in. 1 for incrementing and -1 for decrementing.
var pendingCards = 0;   // How many cards are pending to be drawn by a player?
var unoDetected = false; // Whether any player has called Uno
var gameState = 1;  // 1 for UNO screen, 2 for POINTS screen, 0 for GAME FINISHED screen
const numberOfPlayers = 4; // Change this to change number of players (2-8)
const pointSetup = Object.freeze({3: 20, 4: 25, 5: 30, 6: 35, 7: 40, 8: 45}); // Points players start with depending on number of players
const pointsWinCondition = Object.freeze({3: 50, 4: 80, 5: 120, 6: 160, 7: 210, 8: 250}); // Points needed to win based on number of players

const playerTrackerText = document.getElementById('playersTurnText');

function clearScreen() {
    cards = [playerHandDiv, leftHandDiv, rightHandDiv, topHandDiv];
    for (const cardDiv of cards) {
        for (const child of Array.from(cardDiv.children)) {
            if (child.classList.contains('image-button') || child.classList.contains('image')) {
                child.remove();
            }
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

    #action;

    constructor(id, hand){
        this.id = id;           // To identify if this is player 1, 2, or 3
        this.hand = hand;
        this.points = pointSetup[numberOfPlayers];
        this.#action = "";    // The action the player wants to take on their turn
        this.matching = false; // Whether the player needs to match a bet
    }

    play(index) {
        this.hand.splice(index, 1);
    }

    bet(points){
        this.points -= points;
    }

    getAction() {
        return this.#action;
    }

    setAction(action) {
        this.#action = action;
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

function randomInsert(deck, card) {
    // Inserts card randomly into deck
    deck.push(card);
    tempRandomIndex = Math.floor(Math.random() * (deck.length - 1));
    [deck[deck.length-1], deck[tempRandomIndex]] = [deck[tempRandomIndex], deck[deck.length-1]];
}

function isValid(card, discardPiles) {
    // Checks if it is valid to play a card on one of the two discardPiles
    for (let i = 0; i < discardPiles.length; i++) {
        if (card.color != "wild") {
            return (card.color == discardPiles[i][0].color || card.value == discardPiles[i][0].value);  // If it's not a wild, check for equal color or equal value
        }
        return true; // Wild cards can be played on anything
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
    imageButton.addEventListener("mouseenter", () => {
    hoversfx.currentTime = 0;
    hoversfx.play();
    })

    imageButton.addEventListener("click", function() {
    if (imageButton.dataset.clicked == 0) {
        console.log("Button clicked");
        imageButton.dataset.clicked = 1;
        imageButton.style.filter = "brightness(70%)";
        selectsfx.currentTime = 0;
        selectsfx.play();
    }
    else {
        console.log("Button unclicked");
        imageButton.dataset.clicked = 0;
        imageButton.style.filter = "brightness(100%)";
        selectsfx.currentTime = 0;
        selectsfx.play();
    }
    
    });

    playerHandDiv.appendChild(imageButton);

}

function displayScreen(playerID) {
    // Display hand of the player that matches playerID
    // All other hands are hidden and displayed on the side
    clearScreen();

    // Display discard piles
    for (let i = 0; i < discardPiles.length; i++) {
        if (discardPiles[i].length > 0) {
                let imageButton = document.createElement("div");
                imageButton.style.backgroundImage = "url('../assets/sprite_sheet.png')";
                imageButton.classList.add("image-button");
                imageButton.dataset.clicked = 0; // Initialize clicked state
                
                const width = 168; // Width of each card in the sprite sheet
                const height = 258; // Height of each card in the sprite sheet
                const x = valueMap[discardPiles[i][0].value] * width; // Calculate x position based on value
                const y = colorMap[discardPiles[i][0].color] * height; // Calculate y position based on color
                imageButton.style.backgroundPosition = `-${x}px -${y}px`;
                
                imageButton.addEventListener("mouseenter", () => {
                hoversfx.currentTime = 0;
                hoversfx.play();
                })

                imageButton.addEventListener("click", function() {
                if (imageButton.dataset.clicked == 0) {
                    console.log("Button clicked");
                    imageButton.dataset.clicked = 1;
                    imageButton.style.filter = "brightness(70%)";
                    selectsfx.currentTime = 0;
                    selectsfx.play();
                }
                else {
                    console.log("Button unclicked");
                    imageButton.dataset.clicked = 0;
                    imageButton.style.filter = "brightness(100%)";
                    selectsfx.currentTime = 0;
                    selectsfx.play();
                }
                    });
                discardDiv.appendChild(imageButton);
                } else {
                    let topCard = discardPiles[i][discardPiles[i].length - 1];
                    let image = document.createElement("div");
                    image.style.backgroundImage = "url('../assets/sprite_sheet.png')";
                    image.classList.add("image");
                    image.style.backgroundPosition = "0px 0px";
                    image.style.marginLeft = "0px";
                    discardDiv.appendChild(image);
                }}

    playerTrackerText.textContent = `Player ${playerID + 1}'s Turn`; // **Place outside of drawScreen later**
    
    for (let i = 0; i < players[playerID].hand.length; i++) {
        displayCard(players[playerID].hand[i].color, players[playerID].hand[i].value);
    }

    for (let i = 0; i < numberOfPlayers; i++) {
        
        if (i !== playerID && numberOfPlayers > 2) {
            // Display back of card for other players
            
            for (let j = 0; j < players[i].hand.length; j++) {
                
                let image = document.createElement("div");
                image.style.backgroundImage = "url('../assets/sprite_sheet.png')";
                image.classList.add("image");
                image.style.backgroundPosition = "0px 0px"; // Back of card position
                topHandDiv.style.marginLeft = "100px";
                let gap = 200; // Gap between hands
                
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
                        topHandDiv.style.marginLeft = "100px";
                    }
                    if (numberOfPlayers == 7) {
                        image.style.marginLeft = "-140px";
                        gap = 250;
                        topHandDiv.style.marginLeft = "150px";
                    }
                    if (numberOfPlayers == 8) {
                        image.style.marginLeft = "-150px";
                        gap = 300;
                        topHandDiv.style.marginLeft = "240px";
                    }

                    
                    topHandDiv.appendChild(image);
                    if (j == players[i].hand.length - 1 && !(i == playerID - 1 || i == numberOfPlayers + (playerID - 1) % numberOfPlayers) ){
                        image.style.backgroundPosition = "-165px 0px"; // Display Nothing as a spacer
                        image.style.width = `${gap}px`;
                        topHandDiv.appendChild(image);
                    }
                    topHandDiv.appendChild(image);
                }
            }
        }
        else if (i !== playerID && numberOfPlayers == 2) {
            for (let j = 0; j < players[i].hand.length; j++) {
                let image = document.createElement("div");
                image.style.backgroundImage = "url('../assets/sprite_sheet.png')";
                image.classList.add("image");
                image.style.backgroundPosition = "0px 0px"; // Back of card position
                topHandDiv.style.marginLeft = "100px";
                topHandDiv.appendChild(image);
            }
        }

    }

    // To-do: Implement calling out UNO when unoDetected is true
    // To-do: Implement declaring UNO when a move would leave a player with one card
}


function deal(deck, player, cardsDealt) {
    for (let dealtIterator = 0; dealtIterator < cardsDealt; dealtIterator ++) {
        player.hand.push(deck.pop());
    }
}

async function unoLoop() {
    // Main UNO game loop

    if (unoDetected == true) {
        // TO-DO: Play Barbie music and display UNO button
    }

    displayScreen(playing[tracker].id);
    // To obtain player, do players[tracker]

    if (tracker < 0) {
        tracker = Math.abs((tracker + playing.length) % playing.length);  // If it's negative, add numberOfPlayers to bring it back in bounds and make the modulo properly loop
    }
    else {tracker = Math.abs(tracker % playing.length);}

    if (playing[tracker].matching == true){
        // To-do: Matching the bet logic
        tracker += direction;
        playing[tracker].setAction("idle");
        return;
    }

    // To-Do: Player actions should be implemented through switch case instead of if-else statements

    if (playing[tracker].getAction() == "idle") {
        playing[tracker].setAction("draw");
        return;
    }
    else if (playing[tracker].getAction == "skip" || playing[tracker].getAction == "out") {
        // Skip player's turn
        playing[tracker].setAction("idle");
        tracker += direction;
        return;
    }
    else if (playing[tracker].getAction() == "done") {
        if (playing[tracker].hand.length == 1) {
            unoDetected = true;
            tracker += direction;
            playing[tracker].setAction("idle");
            return;
        }
        else if (playing[tracker].hand.length == 0) {
            playing[tracker].setAction("winner");
            gameState = 2; // Go to points screen
            return;
        }
        // For any other case, just end the turn normally
        tracker += direction;
        playing[tracker].setAction("idle");
        return;
    }
    else if (playing[tracker].getAction() == "draw") {
        // Draw a card continuously (player chooses to draw until they get a playable card)
        deal(deck, playing[tracker], 1);
        if (isValid(playing[tracker].hand[playing[tracker].hand.length - 1], discardPiles)) {
            // Set player to play if drawn card is playable
            playing[tracker].setAction("play");
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 500));  // Wait for half a second before drawing again
    }
    else if (playing[tracker].getAction() == "play") {
        // Play a card
        // TO-DO
    }
    else if (playing[tracker].getAction() == "change") {
        // Change color
        // TO-DO
    }
    else if (playing[tracker].getAction() == "set") {
        // Set a bet (for sevens)
        // All other players must match the bet (matching will be set to true for all players)
        // TO-DO
        playing[tracker].setAction("setdone");
        tracker += direction;
        return;
    }
    else if (playing[tracker].getAction() == "setdone") {
        if (pilesAvailable[0] == true || pilesAvailable[1] == true) {
            playing[tracker].setAction("play");
            return;    
        }
        playing[tracker].setAction("idle");
        tracker += direction;
        return;
    }
}

function pointsLoop() {
    // Main points screen loop
    
    for (let i = 0; i < players.length; i++) {  // Remove a player if they have less than 0 points
        if (players[i].points < 0) {
            players.splice(i, 1);
        }
    }

    // TO-DO: If a player wins a game with negative points, they're still in the game.


}

// Creating players
const players = []   // All players that have ever played
var playing = [];   // Players currently in the game

for (let i = 0; i < numberOfPlayers; i++) {
    players.push(new Player(i, []));
    playing.push(players[i]);
}

function main() {
    while (gameState == 1) {

        for (let i = 0; i < playing.length; i++) {
            players[i].setAction("idle");   // Reset all player actions to idle at the start of the game
        }

        var deck = createDeck(); // Initial deck of cards
        
        //Deals 7 cards to current players
        for(let playerIndex = 0; playerIndex < playing.length; playerIndex ++) {
            deal(deck,playing[playerIndex],7)
        }

        discardPiles[0].push(deck.pop()); // Start the first discard pile with one card from the deck
        discardPiles[1].push(deck.pop()); // Start the second discard pile with one card from the deck
        
        // If the first card is a wild or action card, put it back in the deck and draw a new one
        while (discardPiles[0][0].color == "wild" || valueMap[discardPiles[0][0].value] > 9) {
            randomInsert(deck, discardPiles[0][0]);
            discardPiles[0][0] = deck.pop();
        }
        while (discardPiles[1][0].color == "wild" || valueMap[discardPiles[1][0].value] > 9) {
            randomInsert(deck, discardPiles[0][0]);
            discardPiles[1][0] = deck.pop();
        }

        var pilesAvailable = [true, true]; // Whether each pile is available to be played on (false if a player has already played on it this turn)

        unoLoop();

        gameState = 0; // For testing purposes, end the game after one loop
    }
    while (gameState == 2) {
        // Points screen loop

        pointsLoop();
    }
}

main();