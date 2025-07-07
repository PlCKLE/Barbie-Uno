const title = document.getElementById('title');
const startButton = document.getElementById('start');
const startMessage = document.getElementById('start_message');
const output = document.getElementById('output');
localStorage.clear();

let tempFunction = null;

function start() {
    return new Promise((resolve) => {

    // pendingResolve variable stores the resolve function
    // resolve() resolves the promise, resolve(variable) passes on a value while resolving the promise
    
    tempFunction = resolve;
    
});
}// end of start()

// When start button is pressed, it runs whatever function is stored into tempFunction
startButton.addEventListener('click', () => {
    if (tempFunction) { // true when tempFunction is set to a function and not null or undefined
    tempFunction();
    tempFunction = null;
    }
    output.textContent = 'Alright, let\'s start.';
});

function settingsScreen() {
    title.textContent = 'Settings';

    const playerLabel = document.createElement('label');
    playerLabel.htmlFor ='playerInput';
    playerLabel.textContent = 'How many players will be playing? '
    const playerInput = document.createElement('input');
    playerInput.id = 'playerInput';
    playerInput.type = 'text';
    document.body.appendChild(playerLabel);
    document.body.appendChild(playerInput);

    const secretText = document.createElement('p')
    secretText.textContent = '';
    secretText.style.display = 'none'
    document.body.appendChild(secretText);

    // Code for handling the input of the player count
    playerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && tempFunction) {
        const inputNumber = Number(playerInput.value);
        if (!Number.isInteger(inputNumber)) {
            secretText.textContent = 'You have NO intelligence.';
            secretText.style.display = 'block';
        }
        else if (inputNumber == 1){
            secretText.textContent = 'You have NO friends.';
            secretText.style.display = 'block';
        }
        else if (inputNumber == 0){
            secretText.textContent = 'You do NOT exist.';
            secretText.style.display = 'block';
        }
        else if (inputNumber < 0){
            secretText.textContent = 'Uhm.';
            secretText.style.display = 'block';
        }
        else if (playerInput.value > 30){
            secretText.textContent = 'No, that\'s just ridiculous.';
            secretText.style.display = 'block';
        }
        else if (playerInput.value > 15){
            secretText.textContent = 'Damn this is gonna REALLY suck.';
            secretText.style.display = 'block';
            const answer = playerInput.value;
            tempFunction(answer);
            tempFunction = null;
        }
        else if (inputNumber > 8){
            secretText.textContent = 'Damn this is gonna suck.';
            secretText.style.display = 'block';
            const answer = playerInput.value;
            tempFunction(answer);
            tempFunction = null;
        }
        else {
            secretText.textContent = 'Mentally prepare.';
            secretText.style.display = 'block';
            const answer = playerInput.value;
            tempFunction(answer);
            tempFunction = null;
        }

    } // end of if

}) // end of event
    
}

// Clears screen of HTML body, doesn't remove elements with script tag
function clearScreen() {
    const bodyChildren = Array.from(document.body.children);
    for (const child of bodyChildren) {
        if (child.tagName !== 'SCRIPT') {
        child.remove();
        }
    }
}

async function main() {
    await start();  // "await" pauses the code until user has pressed the start button
    
    await new Promise(resolve => setTimeout(resolve, 2000));  // setTimeout(function name, delay in ms)
    output.textContent += " Boo! Haunted house!";
    
    // Clear screen
    await new Promise(resolve => setTimeout(resolve, 1000));
    startMessage.remove();
    startButton.remove();
    output.remove();

    // Go to settings screen and get settings
    settingsScreen();
    const numberOfPlayers = await new Promise((resolve) => {    // Won't proceed until receiving the resolve from settingsScreen()
        tempFunction = resolve;
    })

    // Clear screen after small delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    clearScreen();

    const playerNumberConfirmation = document.createElement('h2');
    playerNumberConfirmation.textContent = numberOfPlayers + ' players will be playing.';
    document.body.appendChild(playerNumberConfirmation);

    localStorage.setItem('numPlayers', numberOfPlayers);
    await new Promise(resolve => setTimeout(resolve, 2000));

    window.location.href = "game.html";

}

main();
