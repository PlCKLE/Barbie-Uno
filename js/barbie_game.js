imageButton = document.createElement("img");
imageButton.src = "../assets/red_7.png";
imageButton.classList.add("image-button");
imageButton.dataset.clicked = 0; // Initialize clicked state


imageButton.addEventListener("click", function() {
    if (imageButton.dataset.clicked == 0) {
        console.log("Button clicked");
        imageButton.dataset.clicked = 1;
        imageButton.style.filter = "brightness(70%)";
    }
    else {
        console.log("Button unclicked");
        imageButton.dataset.clicked = 0;
        imageButton.style.filter = "brightness(100%)";
    }
    
});

document.body.appendChild(imageButton);

