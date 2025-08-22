let mouseX = 0;
let mouseY = 0;

//This can probably be made into a class
//Actually, it very likely needs to be integrated within a card class. EventRemover for dragFunction should be callable for each individual card.


//Double events can be avoided when cards are objectified and have a "isDragging" boolean with the event adder in an if statement.
function updateCards() {
    let cards = document.getElementsByClassName("Card");

    for(const card of cards) {
        card.ondragstart = doNothing;
        let dragFunction = function(event)  {
            mouseX = event.clientX;
            mouseY = event.clientY;
            let originalLeftPx = card.style.left;
            let originalTopPx = card.style.top;
            dragElementWithMemory(event, card, originalLeftPx, originalTopPx);
            
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
    }

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
    function dragElementWithMemory(event, element,originalLeftPx,originalTopPx) {
        const moveThisElement = moveElement(element);
        element.addEventListener("mousemove", moveThisElement);

        let EventRemover = function() {
            element.removeEventListener("mousemove", moveThisElement);
            element.removeEventListener("mouseup", EventRemover);

            setTimeout( function() {
                approachPositionRecursively(element, event, parseInt(originalLeftPx),parseInt(originalTopPx));
            })

        };
        element.addEventListener("mouseup", EventRemover);
    };

    function approachPositionRecursively(element, event, positionLeft, positionTop) {
        //In the future, it can look better if they change based on the ratio between the current left and top positions (hypotenuse)
        let currentLeft = parseInt(element.style.left);
        let currentTop = parseInt(element.style.top);
        let originalLeftDifference = positionLeft - currentLeft;
        let originalTopDifference = positionTop - currentTop;
        

        //can a case statement be used instead?

        //refer to docs to detect when left click is pressed along with other buttons
        if((originalLeftDifference == 0 && originalTopDifference == 0)) {
            console.log("Returning!");
            return;
        }
        if(originalLeftDifference < 0) {
            element.style.left = currentLeft - 1 + "px";
            console.log("Moving Right")
        }
        else if (originalLeftDifference > 0){
            element.style.left = currentLeft + 1 + "px";
            console.log("Moving left")
        }
        if(originalTopDifference < 0){
            element.style.top = currentTop - 1 + "px";
            console.log("Moving up")
        }
        else if (originalTopDifference > 0){
            element.style.top = currentTop + 1 + "px";
            console.log("Moving Down")
        }
        setTimeout( function() {

                approachPositionRecursively(element, event, positionLeft,positionTop);
            })

    }
