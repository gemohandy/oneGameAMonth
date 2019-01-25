var gameInterval;
var gameCanvas;
var eventCatcherDiv;

var scaleFactor = 4

var maxLives = 3;

var imageList = [
    {name:"hummingBird",
    leadingZeros:4,
    frameCount:2,
    fileExtension: ".png"},
    {name:"bumblebee",
    leadingZeros:4,
    frameCount:6,
    fileExtension:".png"
    },
    {name:"heart",
    leadingZeros:4,
    frameCount:4,
    fileExtension:".png"}
]

var allImages = [];

birdX = -200;
birdY = -200;

class movingThing {
    constructor(startFrame, startY, movementVector, g){
        this.startFrame = startFrame;
        this.startY = startY;
        this.startX = g.width * scaleFactor;
        this.movementVector = movementVector;
    }
    findPosition(frame, g){
        if(frame < this.startFrame){
            return [this.startX + 200, this.startY]
        }
        var framesOnScreen = frame - this.startFrame
        var deltaX = framesOnScreen * this.movementVector[0];
        var deltaY = framesOnScreen * this.movementVector[1];
        return [this.startX + deltaX, this.startY + deltaY]
    }
    draw(frame, g){
        return;
    }
}

class bee extends movingThing{
    draw(frame, g, overG){
        //bumblebee images are second in the image list.
        var coordinates = this.findPosition(frame, overG);
        if(coordinates[0] < -70 || coordinates[1] < 50 || coordinates[1] > g.height * scaleFactor + 50){
            return false;
        }
        g.drawImage(allImages[1][frame%4], coordinates[0], coordinates[1])
        return true;
    }
    onCollide(){
        lives--
    }
}

function preloader()
{
    imageList.forEach(function(imageSet, index){
        allImages.push([])
        for(i = 0; i < imageSet.frameCount; i++){
            following = "" + i
            while(following.length < imageSet.leadingZeros){
                following = "0" + following
            }
            allImages[index].push(loadImage("images/" + imageSet.name + following + imageSet.fileExtension))
        }
    })
}

function loadImage(imageName){
    var imgVar = document.createElement("img");
    imgVar.setAttribute("src", imageName);
    return imgVar;
}

function mouseMove(E){
    E = E || window.event;
    birdX = E.pageX * scaleFactor
    birdY = E.pageY * scaleFactor
}

function startLoading()
{
    eventCatcherDiv = document.getElementById("EventCatcher");
    // eventCatcherDiv events go here
    eventCatcherDiv.addEventListener("mousemove", mouseMove)

    gameCanvasObj = document.getElementById("GraphicsBox")
    gameCanvas = gameCanvasObj.getContext("2d");
    gameCanvas.scale(1/scaleFactor, 1/scaleFactor)

    gameInterval = setInterval(hasLoaded, 250);
    preloader();
}

function isEverythingLoaded(){
    for(var i = 0; i < allImages.length; i++){
        for(var j = 0; j < allImages[i].length; j++){
            if(!allImages[i][j].complete) return false
        }
    }
    return true
}

function hasLoaded()
{
    if (isEverythingLoaded()) // Check to see if all info is loaded
    {
        clearInterval(gameInterval);
        readyObjects();
        startGame();
    }
}

objects = [];

function readyObjects(){
    for(var i = 0; i < 20; i++){
        objects.push(new bee(20 * i, 800, [-2,-8], gameCanvasObj))
        objects.push(new bee(20 * i, 800, [-5,-5], gameCanvasObj))
        objects.push(new bee(20 * i, 800, [-8,-2], gameCanvasObj))
        objects.push(new bee(20 * i, 800, [-10,0], gameCanvasObj))
        objects.push(new bee(20 * i, 800, [-8,2], gameCanvasObj))
        objects.push(new bee(20 * i, 800, [-5,5], gameCanvasObj))
        objects.push(new bee(20 * i, 800, [-2,8], gameCanvasObj))
    }
}

function startGame()
{
    document.getElementById("BackgroundBox").style.cursor = "none"
    gameStartTime = Date.now()
    lives = maxLives;
    gameInterval = setInterval(runGame, 25);
}

function runGame()
{
    gameCanvas.clearRect(0,0,gameCanvasObj.width * scaleFactor, gameCanvasObj.height * scaleFactor)
    currentFrame = Math.floor((Date.now() - gameStartTime)/25)
    drawBird(gameCanvas, birdX, birdY, currentFrame)
    objectsToDelete = [];
    for(i = 0; i < objects.length; i++){
        if(!objects[i].draw(currentFrame, gameCanvas, gameCanvasObj)){
            objectsToDelete.push(i);
        }
    }
    objectsToDelete.reverse().forEach(function(index){objects.splice(index, 1)})
    if(lives < 0){
        clearInterval(gameInterval);
    }
    else{
        for(var i = 0; i < lives; i++){
            drawHeart(gameCanvas, 200*i + 50, currentFrame)
        }
    }
}

function drawBird(g, x, y, f){
    //The bird is the first element in the imageList - all the information we need is in there.
    //Note - drawing the bird centered at x and y, rather than at the corner. That way, the same values can be used in collision detection.
    drawFrame = f % imageList[0].frameCount;
    g.drawImage(allImages[0][drawFrame], x - 150, y - 150)
}

function drawHeart(g, x, f){
    //The heart is the third element in the imageList, and all hearts will be placed at the same vertical position.
    drawFrame = f % imageList[2].frameCount;
    g.drawImage(allImages[2][drawFrame], x, 50)
}
