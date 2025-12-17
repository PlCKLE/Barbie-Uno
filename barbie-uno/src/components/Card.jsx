import { useEffect, useRef, useState } from "react"
export function Card({ value, color}) {
  const cardRef = useRef(null);
  useEffect(() => {
    console.log(cardRef.current)
    injectDrag(cardRef.current);


  },[])
   return (
     <div ref={cardRef} className="Card">
        <h1>I am a mock card! Woo!</h1>
     </div>
   )
}

function doNothing() {
  return false;
}

function injectDrag(card) {
  card.ondragstart = doNothing;
  let dragFunction = function(event)  {
      dragElementWithMemory(event, card);
  }
  card.addEventListener("mousedown",dragFunction);
}
  function dragElementWithMemory(event, element) {
    const mouseDifferenceX = parseInt(element.style.right) - parseInt(event.clientX);
    const mouseDifferenceY = parseInt(element.style.top) - parseInt(event.clientY);

      const moveThisElement = moveElement(element, mouseDifferenceX, mouseDifferenceY);
      element.addEventListener("mousemove", moveThisElement);
      let EventRemover = function() {
          element.removeEventListener("mousemove", moveThisElement);
          element.removeEventListener("mouseup", EventRemover);
          setTimeout(function() {
            // approachPositionRecursively(element, parseInt(element.style.left),parseInt(element.style.top));
          })

      };
      element.addEventListener("mouseup", EventRemover);
  };
  function moveElement(element, previousMouseDifferenceX, previousMouseDifferenceY) {
    return function (event) {
    console.log("Attempting move!")
    const currentMouseDifferenceX = parseInt(element.style.right) - parseInt(event.clientX);
    const currentMouseDifferenceY = parseInt(element.style.top) - parseInt(event.clientY);
    const mouseDisplacementX = previousMouseDifferenceX - currentMouseDifferenceX;
    const mouseDisplacementY = previousMouseDifferenceY - currentMouseDifferenceY;
    console.log("Mouse displacement on X: " + mouseDisplacementX)
    element.style.left = mouseDisplacementX + element.offsetLeft + "px";
    element.style.top = mouseDisplacementY + element.offsetTop + "px";
    };
}

    function approachPositionRecursively(element, positionLeft, positionTop) {
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
        setTimeout(approachPositionRecursively(element,positionLeft,positionTop), 25);
        return;

    }
