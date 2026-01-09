class Card {

    static COLORS = ["red", "green", "blue", "yellow", "wild"];
    static RANKS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "skip", "reverse", "+2"];
    static SPECIAL = ["changecolor", "+4", "barbie"];

    constructor(color, rank) {
        this.color = color;         // red, green, blue, yellow, wild
        this.rank = rank;         // number like "1", "2", or the action "skip", "+4", "+2", "reverse", "changecolor"
    }

    toString() {
        return this.color + " " + this.rank;
    }
}


export function generateDeck() {
    // Creates array of 110 randomly shuffled cards.
    const deck = [];
    for (let i = 0; i < Card.COLORS.length - 1; i++) {

        deck.push(new Card(Card.COLORS[i], "0"));      // Each color only has one zero card

        for (let j = 1; j < Card.RANKS.length; j++) {
            deck.push(new Card(Card.COLORS[i], Card.RANKS[j]));
            deck.push(new Card(Card.COLORS[i], Card.RANKS[j]));
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

export function shuffle(array) {
    // Stole this from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

}

export function deal(deck, cardsDealt) {
    const cards = [];
    for (let dealtIterator = 0; dealtIterator < cardsDealt; dealtIterator ++) {
        cards.hand.push(deck.pop());
    }
    return cards;
}