import { useEffect, useRef, useState } from "react"
  let isDragging = true;

const spriteWidth = 168
const spriteHeight = 258
export function Card({ card, cardIndex, left, top, disableDrag}) {
  const cardRef = useRef(null);
  const [originalOffsetLeft, setOriginalOffsetLeft] = useState(null);
  const [originalOffsetTop,setOriginalOffsetTop] = useState(null);
  const [spriteX,setSpriteX] = useState("");
  const [spriteY,setSpriteY] = useState("");
 
  useEffect(() => {
    setSpriteX(-calculateSpriteLocationX());
    setSpriteY(-calculateSpriteLocationY());
  },[card])
  useEffect(() => {
    setOriginalOffsetLeft(cardRef.current.offsetLeft);
    setOriginalOffsetTop(cardRef.current.offsetTop);
    if(disableDrag)
      cardRef.current.position = "static";
  },[])
  useEffect(() => {
    if(!disableDrag)
      injectDrag(cardRef.current);
  }, [originalOffsetTop])


   return (
     <img src={null} width={spriteWidth} height={spriteHeight} ref={cardRef} className="Card" style={{left: left, top: top, zIndex: cardIndex, backgroundPositionX:spriteX, backgroundPositionY:spriteY}} />
    )










   //Card Functions
  function calculateSpriteLocationX() {
    if(Number.isNaN(parseInt(card.rank))) {
      switch (card.rank) {
        case "skip":
          return spriteWidth * 10
        case "reverse":
          return spriteWidth * 11
        case "+2":
          return spriteWidth * 12
        case "changecolor":
          return spriteWidth * 13
        case "+4":
          return spriteWidth * 14
        case "barbie":
          return spriteWidth * 15
        default:
          return spriteWidth * 0
      }
    }
    else
      return spriteWidth * card.rank
  }
  function calculateSpriteLocationY() {
    switch (card.color) {
        case "red":
          return spriteHeight * 2
        case "green":
          return spriteHeight * 4
        case "blue":
          return spriteHeight * 3
        case "yellow":
          return spriteHeight * 1
        case "wild":
          return spriteHeight * 0
        default:
          return spriteHeight * 0
    }
  }

   //Card Drag functions
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
          // setTimeout(function() {
          //   approachPositionRecursively(element);
          // })

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