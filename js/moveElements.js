let barbieImageId = document.getElementById("barbieImage")
console.log("We are working!")
let mouseX = 0;
let mouseY = 0;
const barbieImageFunctionForMoving = dragElement(barbieImageId);
barbieImageId.ondragstart = function() {
    return false;
};

barbieImageId.addEventListener("mousedown",barbieImageFunctionForMoving);

function dragElement(elementId) {
    return function (event) {
        console.log("Mouse is down!");
        mouseX = event.clientX;
        mouseY = event.clientY;
        console.log("Position in y is " + mouseY);
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
        console.log("Mouse is moving!");
        let mouseDisplacementX = event.clientX - mouseX;
        let mouseDisplacementY = event.clientY - mouseY;
        console.log("Mouse displacement in y is" + mouseY)
        mouseX = event.clientX;
        mouseY = event.clientY;
        elementId.style.left = mouseDisplacementX + elementId.offsetLeft + "px";
        elementId.style.top = mouseDisplacementY + elementId.offsetTop + "px";
    };
}
