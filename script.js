import Pubsub from "./pubsub.js";

const pubsub = new Pubsub();

const gameBoard = (() => {
  const boardFields = document.querySelectorAll(".game-square");
  let boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  const render = function renderBoardStateToPage() {
    boardFields.forEach((square, ind) => {
      square.classList.remove("x", "o");
      if (boardState[ind] !== 0) square.classList.add(boardState[ind]);
    });
  };

  function update(ind, symbol) {
    boardState[ind] = symbol;
    render();
  }
  pubsub.subscription("endTurn", update).subscribe();

  function resetBoardState() {
    boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    render();
  }

  function getState() {
    return [...boardState];
  }

  return { getState };
})();

const gameMaster = (() => {
  const startButton = document.querySelector("button");

  const playerMaker = (symbol) => {
    const playerSymbol = symbol;
    return { playerSymbol };
  };

  const playerOne = playerMaker("x");
  const playerTwo = playerMaker("o");
  let currentPlayer = playerOne;

  function switchPlayer() {
    if (currentPlayer === playerOne) currentPlayer = playerTwo;
    else currentPlayer = playerOne;
  }
  pubsub.subscription("endTurn", switchPlayer).subscribe();

  function getCurrentPlayer() {
    return currentPlayer.playerSymbol;
  }

  return { getCurrentPlayer };
})();

const clickHandler = (() => {
  const myGameContainer = document.querySelector(".container");
  myGameContainer.addEventListener("click", (e) => {
    const getID = (e) => e.target.dataset.id;
    const squareID = getID(e);
    const currentPlayer = gameMaster.getCurrentPlayer();

    const firstCondition = e.target.classList.contains("game-square");
    const secondCondition = !(
      e.target.classList.contains("x") || e.target.classList.contains("o")
    );
    if (firstCondition && secondCondition)
      pubsub.publish("endTurn", squareID, currentPlayer);
      console.log(gameBoard.getState())
  });
})();


