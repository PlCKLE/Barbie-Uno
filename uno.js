class Card {
    
    constructor(color, value) {
        this.color = color;         // red, green, blue, yellow, wild
        this.value = value;         // number like "1", "2", or the action "skip", "+4", "+2", "reverse", "changecolor"
    }

// We can access card information by doing card.color and card.value

}

function createDeck() {
    // Creates array of 108 randomly shuffled cards.

    const colors = ["red", "green", "blue", "yellow", "wild"];
    const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "skip", "reverse", "+2"];
    const special = ["changecolor", "+4"];
    
    const deck = [];

    for (let i = 0; i < colors.length - 1; i++) {

        deck.push(new Card(colors[i], "0"));      // Each color only has one zero card

        for (let j = 1; j < values.length; j++) {
            deck.push(new Card(colors[i], values[j]));
            deck.push(new Card(colors[i], values[j]));
        }

    }

    for (let i = 0; i < special.length; i++) {
        
        for (let j = 0; j < 4; j++) {
            deck.push(new Card("wild", special[i]));
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