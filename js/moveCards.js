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
            dragElementWithMemory(event, card);
            
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
    function dragElementWithMemory(event, element) {
        let originalLeft = element.style.left;
        let originalTop = element.style.top;
        const moveThisElement = moveElement(element);
        element.addEventListener("mousemove", moveThisElement);
        let EventRemover = function() {
            element.removeEventListener("mousemove", moveThisElement);
            element.removeEventListener("mouseup", EventRemover);
            setInterval( function() {
                console.log("The function has triggered!");
                approachPositionRecursively(element, event, originalLeft,originalTop,element.style.left,element.style.top);
            })
        };
        element.addEventListener("mouseup", EventRemover);
    };

    function approachPositionRecursively(element, event, originalLeft, originalTop, currentLeft, currentTop) {
        console.log("Doing my job")
        //In the future, it can look better if they change based on the ratio between the current left and top positions (hypotenuse)
        let originalLeftDifference = originalLeft - currentLeft;
        let originalTopDifference = originalTop - currentTop;

        //can a case statement be used instead?

        //refer to docs to detect when left click is pressed along with other buttons
        if((originalLeftDifference == 0 && originalTopDifferent == 0) || event.buttons == 1)
            return;
        if(originalLeftDifference < 0)
            element.style.left = element.style.left + 1 + "px";
        else if (originalLeftDifference > 0)
            element.style.left = element.style.left - 1 + "px";
        if(originalTopDifference < 0)
            element.style.top = element.style.top + 1 + "px";
        else if (originalTopDifference > 0)
            element.style.top = element.style.top - 1 + "px";
        setInterval( function() {
                approachPositionRecursively(element, originalLeft,originalTop,element.style.left,element.style.top);
            })

    }
