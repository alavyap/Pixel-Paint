// This will help us to draw on the canvas 
const canvas = document.querySelector("canvas"),
    toolBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-picker"),
    clearBoard = document.querySelector(".clear-board"),
    saveImg = document.querySelector(".save-image"),

    // getContext() method returns a drawing context on the canvas
    ctx = canvas.getContext("2d");

// Global values with the default value
let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000";

// this code downloads the image with a white background
const setCanvasBackground = () => {
    //setting whole canvas background to white, so the download img background will be white 
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; //setting fillstyle back to the selectedColor, it'll be the brush color
};

window.addEventListener("load", () => {
    //setting canvas width/ height , offsetWidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    if (!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
        // strokeRect() method draw a rectangle (without fill)
    };
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);

};

const drawCir = (e) => {
    ctx.beginPath();  // creating new path to draw circle
    // Getting the radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);  //creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
}

const drawTri = (e) => {
    ctx.beginPath();  // creating new path to draw triangle
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
    ctx.closePath(); // creating path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw a triangle 

}

const startDraw = (e) => {
    isDrawing = true;  // it will start drawing only when we have mouse drawing

    prevMouseX = e.offsetX;  //passing current mouseX position as prevMouseX value 
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value

    ctx.beginPath(); // creating new path to draw every time the mouse is up 
    ctx.lineWidth = brushWidth;// lineWidth property sets the line width

    ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style 
    ctx.fillStyle = selectedColor;  // passing selectedColor as fill style 


    // copying canvas data & passing as snapshot value , this avoids dragging the line 
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); // getImageData() method returns an Image Data Object that copies the pixel data
    // this avoids the dragging the image
};


const drawing = (e) => {

    if (!isDrawing) return; // if the isDrawing is false return from here 

    ctx.putImageData(snapshot, 0, 0);  //putImageData() method puts the image data back onto the canvas

    if (selectedTool === "brush" || selectedTool === "eraser") {

        // if selected tool is eraser then set strokeStyle to white
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;

        ctx.lineTo(e.offsetX, e.offsetY);  // creating line according to the mouse pointer 
        ctx.stroke(); // drawing/filling line with color
        // lineTo() method creates a new line , ctx.lineTo(x-coordinate,y-coordinate)
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") {
        drawCir(e);
    } else if (selectedTool === "triangle") {
        drawTri(e);
    }

}


toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option 

        document.querySelector(".options .active").classList.remove("active");
        //removing active class from the previous option and adding on current clicked option
        btn.classList.add("active");

        selectedTool = btn.id;  //Passing selected tool id as selected value

        // console.log(selectedTool);
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slider value as brushSize


colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {  //adding click event to all color button

        //removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");

        //Passing selected btn background color as selected value

        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");

    });
});

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearBoard.addEventListener("click", () => {
    // clearRect() method clears the specified pixels within a given rectangle
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clearing whole canvas
    setCanvasBackground();

});


saveImg.addEventListener("click", () => {
    const link = document.createElement("a");  // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    // canvas.toDataURL() method returns a data URL of the image
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); //clicking link to download image
});


canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

