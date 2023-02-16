import Pubsub from "./pubsub.js";

const gameBoard = (() => {
  const boardFields = document.querySelectorAll('.game-square')
  let boardState = ['x', 'o', 'x', 'o', 'x', 0, 'o', 0, 'x'];

  function render() {
    for (let index = 0; index < boardState.length; index++) {
        boardFields[index].classList.remove('x','o')
        if (boardState[index] !== 0) {
            boardFields[index].classList.add(boardState[index])
        }
    }
  }

  function placeMarker() {
    const squareContainer = document.querySelector('.container')
    squareContainer.addEventListener('click', getTargetID)
    const myField = document.querySelector('.game-square')

    function getTargetID(e) {
        if (e.target.classList.contains('game-square')) {
            console.log(e.target.dataset.id)
            return e.target.dataset.id
        }
    }
  }

  placeMarker();

  

  function resetBoardState() {
    boardState = [0,0,0,0,0,0,0,0,0];
    render();
  }

  return {render,resetBoardState}
})();


const gameMaster = (() => {
  // control who gets to play
  // clicking start button 'starts' the game
  const startButton = document.querySelector('button')
  // when playerOne makes their move, playerTwo will be marking.
  // it will switch back and forth until a winner is announced.
})();

const playerMaker = (symbol) => {
    const playerSymbol = symbol;
    
    function sayHello() {
        console.log(`Hi, my sign is '${playerSymbol}'`)
    }


    return {playerSymbol, sayHello}
}


// pubsub testing. delete later
const pubsub = new Pubsub();
pubsub.subscription('boardChange',gameBoard.render).subscribe()
// pubsub.publish('boardChange')

function hello(args) {
    console.log(args)
}
pubsub.subscription('boardChange',hello).subscribe();



// switching between players testing WORKS
// maybe place in game master module??
const playerSwitcher = (() => {
    const playerOne = playerMaker('x');
    const playerTwo = playerMaker('o');
    let currentPlayer = playerOne;
    console.log(`The current player is: ${currentPlayer.playerSymbol}`)

    function getCurrentPlayer() {
        return currentPlayer.marker
    }

    function switchPlayer() {
        if (currentPlayer === playerOne) {
            currentPlayer = playerTwo;
        } else currentPlayer = playerOne;
        console.log(`The current player is now: ${currentPlayer.playerSymbol}`)
    }

    pubsub.subscription('makeMove', switchPlayer).subscribe()
    
    return {getCurrentPlayer}

})();




const myGameContainer = document.querySelector('.container');

myGameContainer.addEventListener('click', (e) => {
    const firstCondition = e.target.classList.contains('game-square');
    const secondCondition = !(e.target.classList.contains('x') || e.target.classList.contains('o'))
    if (firstCondition && secondCondition) {
        pubsub.publish('makeMove')
    }
})


// NEXT --> Need to add logic to modify the board when the 'makeMove' event occurs
pubsub.publish('boardChange')