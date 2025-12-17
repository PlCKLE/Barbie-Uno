import { useEffect, useRef, useState } from "react"
  let isDragging = true;
export function Card({ value, color, cardIndex, left, top, imageLink}) {
  const cardRef = useRef(null);
  const [originalOffsetLeft, setOriginalOffsetLeft] = useState(null);
  const [originalOffsetTop,setOriginalOffsetTop] = useState(null);
 
  useEffect(() => {
    setOriginalOffsetLeft(cardRef.current.offsetLeft);
    setOriginalOffsetTop(cardRef.current.offsetTop);
  },[])
  useEffect(() => {
    injectDrag(cardRef.current);
  }, [originalOffsetTop])


   return (
     <div ref={cardRef} className="Card" style={{left: left, top: top, zIndex: cardIndex}}>
        <img width = "150px" height = "250px" src = {imageLink} />
     </div>
   )





   //Card Functions
function doNothing() {
  return false;
}

  function injectDrag(card) {
    card.ondragstart = doNothing;
    let dragFunction = function(event)  {
      isDragging = true;
      dragElementWithMemory(event, card);
    }
    card.addEventListener("mousedown",dragFunction);
  }
  function dragElementWithMemory(event, element) {
    element.style.zIndex = 20;
    const mouseDifferenceX = parseInt(event.clientX) - parseInt(element.offsetLeft);
    const mouseDifferenceY = parseInt(element.offsetTop) - parseInt(event.clientY);

      const moveThisElement = moveElement(element, mouseDifferenceX, mouseDifferenceY);
      document.onmousemove = moveThisElement
      let EventRemover = function() {
          document.onmousemove = null;
          document.onmouseup = null;
          element.style.zIndex = cardIndex;
          isDragging = false;
          setTimeout(function() {
            approachPositionRecursively(element);
          })

      };
      document.onmouseup = EventRemover;
  };
  function moveElement(element, previousMouseDifferenceX, previousMouseDifferenceY) {
    return function (event) {
    const currentMouseDifferenceX = parseInt(event.clientX) - parseInt(element.offsetLeft);
    const currentMouseDifferenceY = parseInt(element.offsetTop) - parseInt(event.clientY);
    const mouseDisplacementX = currentMouseDifferenceX - previousMouseDifferenceX;
    const mouseDisplacementY = previousMouseDifferenceY - currentMouseDifferenceY;
    element.style.left = mouseDisplacementX + element.offsetLeft + "px";
    element.style.top = mouseDisplacementY + element.offsetTop + "px";
    };
  }

    //It would be really cool if someone made a formula to smooth out the moving.
    async function approachPositionRecursively(element) {
        //In the future, it can look better if they change based on the ratio between the current left and top positions (hypotenuse)
        if(isDragging)
          return;
        let currentLeft = parseInt(element.offsetLeft);
        let currentTop = parseInt(element.offsetTop);
        let originalLeftDifference = originalOffsetLeft - currentLeft;
        let originalTopDifference = originalOffsetTop - currentTop;

        //can a case statement be used instead?

        //refer to docs to detect when left click is pressed along with other buttons
        if((originalLeftDifference == 0 && originalTopDifference == 0)) {
            return;
        }
        const speedMagnitude3 = 30
        const speedMagnitude2 = 8
        const speedMagnitude1 = 1
        const rangeMangitude3 = 20
        const rangeMangitude2 = 10
        //Move left or right
        if(originalLeftDifference < 0) {
          if(originalLeftDifference < -rangeMangitude3)
            element.style.left = currentLeft - speedMagnitude3 + "px"
          else if(originalLeftDifference < -rangeMangitude2)
            element.style.left = currentLeft - speedMagnitude2 + "px"
          else
            element.style.left = currentLeft - speedMagnitude1 + "px";
          
        }
        else if (originalLeftDifference > 0){
          if(originalLeftDifference > rangeMangitude3)
            element.style.left = currentLeft + speedMagnitude3 + "px"
          else if(originalLeftDifference > rangeMangitude2)
            element.style.left = currentLeft + speedMagnitude2 + "px"
          else
            element.style.left = currentLeft + speedMagnitude1 + "px";

        }

        //Move up or down
        if(originalTopDifference < 0){
          if(originalTopDifference < -rangeMangitude3)
            element.style.top = currentTop - speedMagnitude3 + "px";
          else if (originalTopDifference < -rangeMangitude2)
            element.style.top = currentTop - speedMagnitude2 + "px";
          else 
            element.style.top = currentTop - speedMagnitude1 + "px";
        }
        else if (originalTopDifference > 0){
          if(originalTopDifference > rangeMangitude3)
            element.style.top = currentTop + speedMagnitude3 + "px";
          else if(originalTopDifference > rangeMangitude2)
            element.style.top = currentTop + speedMagnitude2 + "px";
          else 
            element.style.top = currentTop + speedMagnitude1 + "px";  
        }
        await new Promise(r => setTimeout(r, 8));
        approachPositionRecursively(element,originalOffsetTop,originalOffsetLeft);

    }
}