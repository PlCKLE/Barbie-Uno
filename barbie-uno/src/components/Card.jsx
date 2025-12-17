import { useEffect, useRef, useState } from "react"
export function Card({ value, color, cardIndex}) {
  const cardRef = useRef(null);
  useEffect(() => {
    console.log(cardRef.current)
    injectDrag(cardRef.current);
    console.log(cardIndex);

  },[])
   return (
     <div ref={cardRef} className="Card">
        <img width = "200px" height = "200px" src = "https://images.ctfassets.net/l7h59hfnlxjx/582Lx8AhvXHgRLXagk73lV/ef827f6b381202b112b61e218d8e3154/President_Obama_Headshot__Economic_Inclusion___Photo_by_Pari_Dukovic_courtesy_of_Penguin_Random_House_.jpg?q=75&w=1014&fm=webp" />
     </div>
   )

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
    element.style.zIndex = 20;
    const mouseDifferenceX = parseInt(event.clientX) - parseInt(element.offsetLeft);
    const mouseDifferenceY = parseInt(element.offsetTop) - parseInt(event.clientY);

      const moveThisElement = moveElement(element, mouseDifferenceX, mouseDifferenceY);
      element.addEventListener("mousemove", moveThisElement);
      let EventRemover = function() {
          element.removeEventListener("mousemove", moveThisElement);
          element.removeEventListener("mouseup", EventRemover);
          element.style.zIndex = cardIndex;
          setTimeout(function() {
            // approachPositionRecursively(element, parseInt(element.style.left),parseInt(element.style.top));
          })

      };
      element.addEventListener("mouseup", EventRemover);
  };
  function moveElement(element, previousMouseDifferenceX, previousMouseDifferenceY) {
    return function (event) {
    console.log("Attempting move!")
    const currentMouseDifferenceX = parseInt(event.clientX) - parseInt(element.offsetLeft);
    const currentMouseDifferenceY = parseInt(element.offsetTop) - parseInt(event.clientY);
    const mouseDisplacementX = currentMouseDifferenceX - previousMouseDifferenceX;
    const mouseDisplacementY = previousMouseDifferenceY - currentMouseDifferenceY;
    console.log("Mouse displacement on X: " + mouseDisplacementX)
    element.style.left = mouseDisplacementX + element.offsetLeft + "px";
    element.style.top = mouseDisplacementY + element.offsetTop + "px";
    };
}

    function approachPositionRecursively(element, positionLeft, positionTop) {
        //In the future, it can look better if they change based on the ratio between the current left and top positions (hypotenuse)
        let currentLeft = parseInt(element.offsetLeft);
        let currentTop = parseInt(element.offsetTop);
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
}