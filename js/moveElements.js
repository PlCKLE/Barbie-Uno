let barbieImageId = document.getElementById("barbieImage")
let mouseX = 0;
let mouseY = 0;
const barbieImageFunctionForMoving = dragElement(barbieImageId);
barbieImageId.ondragstart = function() {
    return false;
};

barbieImageId.addEventListener("mousedown",barbieImageFunctionForMoving);

function dragElement(elementId) {
    return function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        const moveThisElement = moveElement(elementId, mouseX, mouseY);
        elementId.addEventListener("mousemove", moveThisElement);
        let EventRemover = function() {
            elementId.removeEventListener("mousemove", moveThisElement)
            elementId.removeEventListener("mouseup", EventRemover);
        };
        elementId.addEventListener("mouseup", EventRemover);
    };
}
function moveElement(elementId, mouseX, mouseY) {
    return function (event) {
        let mouseDisplacementX = event.clientX - mouseX;
        let mouseDisplacementY = event.clientY - mouseY;
        mouseX = event.clientX;
        mouseY = event.clientY;
        elementId.style.left = mouseDisplacementX + elementId.offsetLeft + "px";
        elementId.style.top = mouseDisplacementY + elementId.offsetTop + "px";
    };
}
