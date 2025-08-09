let mouseX = 0;
let mouseY = 0;
let boundaryX = 0;
let boundaryY = 0;

//This can probably be made into a class
function updateCards() {
    let cards = document.getElementsByClassName("Card");

    for(const card of cards) {
        console.log(card);
        card.ondragstart = doNothing();
        let dragFunction = function()  {
            dragElement(card);
            card.addEventListener("mouseup", EventRemover);
        }
        let EventRemover = function() {
            card.removeEventListener("mousedown", dragFunction);
            card.removeEventListener("mouseup", EventRemover);
        }
        card.addEventListener("mousedown",dragFunction);
    }
}
updateCards();




function doNothing() {
    return false;
}
function dragElement(element) {
    return function (event) {
        const moveThisElement = moveElement(element);
        element.addEventListener("mousemove", moveThisElement);
        let EventRemover = function() {
            element.removeEventListener("mousemove", moveThisElement)
            element.removeEventListener("mouseup", EventRemover);
        };

        
    };
}
function moveElement(element) {
    return function (event) {
        element.style.left = event.clientX + element.offsetLeft + "px";
        element.style.top = event.clientY + element.offsetTop + "px";
    };
}
