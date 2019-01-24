var gameInterval;
var gameCanvas;
var eventCatcherDiv;

var scaleFactor = 3

var imageList = [
    {name:"hummingBird",
    leadingZeros:4,
    frameCount:2,
    fileExtension: ".png"}
]

var allImages = [];

function preloader()
{
    imageList.forEach(function(imageSet, index){
        allImages.push([])
        for(i = 0; i < imageSet.frameCount; i++){
            following = "" + i
            while(following.length < imageSet.leadingZeros){
                following = "0" + following
            }
            allImages[index].push(loadImage(imageSet.name + following + imageSet.fileExtension))
        }
    })
}

function loadImage(imageName){
    var imgVar = document.createElement("img");
    imgVar.setAttribute("src", imageName);
    return imgVar;
}

function startLoading()
{
    eventCatcherDiv = document.getElementById("EventCatcher");
    // eventCatcherDiv events go here

    gameCanvasObj = document.getElementById("GraphicsBox")
    gameCanvas = gameCanvasObj.getContext("2d");
    gameCanvas.scale(1/scaleFactor, 1/scaleFactor)

    gameInterval = setInterval(hasLoaded, 250);
    preloader();
}

function isEverythingLoaded(){
    console.log("Testing")
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
        console.log(allImages)
        startGame();
    }
}

function startGame()
{
    gameStartTime = Date.now()
    gameInterval = setInterval(runGame, 25);
}

function runGame()
{
    gameCanvas.clearRect(0,0,gameCanvasObj.width * scaleFactor, gameCanvasObj.height * scaleFactor)
    currentFrame = Math.floor((Date.now() - gameStartTime)/25)
    console.log(currentFrame)
    drawBird(gameCanvas, 200, 200, currentFrame)
}

function drawBird(g, x, y, f){
    //The bird is the first element in the imageList - all the information we need is in there.
    drawFrame = f % imageList[0].frameCount;
    g.drawImage(allImages[0][drawFrame], x, y)
}
