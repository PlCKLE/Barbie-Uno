let mouseX = 0;
let mouseY = 0;

//This can probably be made into a class
//Actually, it very likely needs to be integrated within a card class. EventRemover for dragFunction should be callable for each individual card.

function updateCards() {
    let cards = document.getElementsByClassName("Card");

    for(const card of cards) {
        card.ondragstart = doNothing;
        let dragFunction = function(event)  {
            mouseX = event.clientX;
            mouseY = event.clientY;
            dragElement(card);
            
        }
        // let EventRemover = function() {
        //      console.log("REMOVED");
        //      card.removeEventListener("mousedown", dragFunction);
        //      card.removeEventListener("mouseup", EventRemover);
        // }
        card.addEventListener("mousedown",dragFunction);
    }
}
updateCards();




function doNothing() {
    return false;
}


function dragElement(element) {
        const moveThisElement = moveElement(element);
        element.addEventListener("mousemove", moveThisElement);
        let EventRemover = function() {
            element.removeEventListener("mousemove", moveThisElement);
            element.removeEventListener("mouseup", EventRemover);
        };
        element.addEventListener("mouseup", EventRemover);
        
        
    };
    
function moveElement(element) {
    return function (event) {
        let mouseDisplacementX = event.clientX - mouseX;
        let mouseDisplacementY = event.clientY - mouseY;
        
        mouseX = event.clientX;
        mouseY = event.clientY;
        element.style.left = mouseDisplacementX + element.offsetLeft + "px";
        element.style.top = mouseDisplacementY + element.offsetTop + "px";
    };
}
