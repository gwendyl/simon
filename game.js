// initialize colors array
var colors = [
    new CreateColor("green",0),
    new CreateColor("red",1),
    new CreateColor("yellow",2),
    new CreateColor("blue",3)
];

const Turn = {
    Player: 0,
    Computer: 1
}


var generatedNumbers = [];
var playerNumbers = [];

var   isGameOver = true;
var   currentTurn = Turn.Computer;
var   roundCount = 0;
const fadeTime = 200;
const turnTime = 500;

// associate numbers and buttons
function CreateColor(color,nbr) {
    this.color = color;
    this.number = nbr;
    //assign the correct button to the correct
    //array element by matching the color to the
    // div (Button) class
    this.button = $(`.${color}`);
    this.flash = function (){
        this.button.fadeOut(fadeTime).fadeIn(fadeTime);
    }
    this.makeNoise = function () {
        let audio = new Audio(`sounds/${color}.mp3`);
        audio.play();
    }
}


// Wait for a prompt to start the game.
document.addEventListener("keydown",function(){

    if (isGameOver) {   
        isGameOver = false;
        currentTurn = Turn.Computer;
        // reset player array
        playerNumbers = [];

        // launch initial computer turn
        setTimeout(() => {computerTurn()},turnTime);

    }
    //manageHeader();
});

// listen for clicks on buttons
$(".btn").click(function(e){
    triggerByColor(e.target.id);
});


function triggerByColor(color) {
    if (isGameOver) {
        return;
    }
    if (currentTurn != Turn.Player) {
        return;
    }

    let nbr = findNbr(color);
    trigger(nbr);
    playerNumbers.push(nbr);

    // check that all are correct
    if (!arraysMatch()) {
        resetGame();
        return 
    }

    // if we have reached the same number of colors as generated so far, generate another number
    if (playerNumbers.length >= generatedNumbers.length) {
        currentTurn = Turn.Computer;
        // reset playerNumbers array because they must do whole sequence every time
        roundCount++;
        playerNumbers = [];
        currentTurn = Turn.Computer;
        setTimeout(() => {computerTurn()},turnTime);
    }
    manageHeader();  

    return;
};

function computerTurn(){
    if (isGameOver) {
        return;
    }

    if (currentTurn != Turn.Computer) return;

    generatedNumbers.push(nextSequence());
    console.log(generatedNumbers);

    // play generated numbers
    for (let i=0; i<generatedNumbers.length; i++) {
        console.log(`when i = ${i}, number is ${generatedNumbers[i]}`);
        let waitTime = fadeTime*2*i;
        setTimeout(() => {trigger(generatedNumbers[i])},waitTime);
    } 

  

    currentTurn = Turn.Player;

    return;
}



/// Utility Functions

function arraysMatch() {

    for (i=0; i< playerNumbers.length; i++) {
        if (playerNumbers[i] != generatedNumbers[i]) return false;
    }
    return true;
}

function resetGame() {
    isGameOver = true;
    currentTurn = Turn.Computer;
    generatedNumbers = [];
    playerNumbers = [];
    roundCount = 0;
    manageHeader();
}
function trigger(nbr) {
    colors[nbr].flash();
    colors[nbr].makeNoise();    
}

function findNbr(color){
    for(i=0; i<colors.length; i++){
        if (colors[i].color==color) {
            return colors[i].number;
        }
    }
}
function nextSequence(){
    return Math.floor(Math.random()*4);
}
function manageHeader(){
    if(isGameOver){
        $("h1").html("Game Over - Press any key to play again");
    } else {
        $("h1").html(`Round ${roundCount} success!`);        
    }
}
