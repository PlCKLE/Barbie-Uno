// Function to display a card based on its color and value
const playerHandDiv = document.getElementById('playerHand');

function clearScreen() {
    const bodyChildren = Array.from(document.body.children);
    for (const child of bodyChildren) {
        if (child.classList.contains('image-button')) {
        child.remove();
        }
    }
}


function displayCard(color, value) {
    // This function creates a button with a background image representing the card.
    // The button's background position is set based on the card's color and value.
    
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

displayCard("blue", "changecolor");
displayCard("blue", "2");
displayCard("blue", "4");
