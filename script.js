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
  pubsub.subscription("boardChange", update).subscribe();

  function resetBoardState() {
    boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    render();
  }
  pubsub.subscription("restart", resetBoardState).subscribe();

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

  function resetStartingPlayer() {
    currentPlayer = playerOne;
  }
  pubsub.subscription("restart", resetStartingPlayer).subscribe();

  function switchPlayer() {
    if (currentPlayer === playerOne) currentPlayer = playerTwo;
    else currentPlayer = playerOne;
    console.log(`player is now ${getCurrentPlayer()}`);
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
    if (firstCondition && secondCondition) {
      pubsub.publish("boardChange", squareID, currentPlayer);
    }
  });
})();

const evaluator = (() => {
  function getInd(myArr, myVal) {
    return myArr.reduce((accumulator, currentValue, index) => {
      if (currentValue === myVal) accumulator.push(index);
      return accumulator;
    }, []);
  }

  const winConditionGenerator = (nArray, a) => {
    // Win Condition Formula: [n] [n+a] [n+2a] where n = [0,3,6] and a = 1
    // Columns: [0,1,2], a=3; Corner1: [0], a=4; Corner2: [2], a=2;
    const output = [];
    nArray.forEach((n) => {
      output.push([n, n + a, n + 2 * a]);
    });
    return output;
  };

  const rowConds = winConditionGenerator([0, 3, 6], 1);
  const colConds = winConditionGenerator([0, 1, 2], 3);
  const cor1Conds = winConditionGenerator([0], 4);
  const cor2Conds = winConditionGenerator([2], 2);
  const winConditions = [...rowConds, ...colConds, ...cor1Conds, ...cor2Conds];

  function condFilter(matchedArray, winConditions) {
    const counter = {};
    matchedArray.forEach((value) => {
      winConditions.forEach((condition, index) => {
        if (condition.includes(value)) {
          // console.log({condition, value})
          if (Object.prototype.hasOwnProperty.call(counter, index))
            counter[index]++;
          else counter[index] = 1;
        }
      });
    });
    return counter;
  }

  function checkWin() {
    const marker = gameMaster.getCurrentPlayer();
    const playerInd = getInd(gameBoard.getState(), marker);
    const playerProgress = condFilter(playerInd, winConditions);
    let isCurrentPlayerWinner = false;

    Object.keys(playerProgress).forEach((key) => {
      if (playerProgress[key] > 2) {
        isCurrentPlayerWinner = true;
        pubsub.publish("winnerFound");
      }
    });

    if (
      !isCurrentPlayerWinner &&
      getInd(gameBoard.getState(), 0).length === 0
    ) {
      pubsub.publish("draw");
    }

    pubsub.publish("endTurn");
  }
  pubsub.subscription("boardChange", checkWin).subscribe();
})();

const displayController = (() => {
  const myP = document.querySelector(".winner");
  const overlay = document.querySelector(".overlay");
  const showOverlay = () => overlay.classList.add("visible");
  const hideOverlay = () => overlay.classList.remove("visible");

  selectDoggyWarrior();

  function generateRadioButton(type, iconArray) {
    let outputString = '';
    iconArray.forEach(breed => {
      outputString += `<input type="radio" name="${type}_icon" id="${breed}" value="${breed}">\n<label for="${breed}" class="${breed} icon"></label>\n`
    })
    return outputString;
  }

  function selectDoggyWarrior() {
    disableRestart();
    
    overlay.innerHTML = `<h2>Team Doggo</h2>
    Select your doggy warrior:
    <div class="icons">
    ${generateRadioButton('dog',['golden-retriever','corgi','yorkie','poodle'])}
    </div>
    <button class="player1-ico">Submit</button>
    `;
    
    const p1_ico_button = document.querySelector(".player1-ico");
    p1_ico_button.addEventListener("click", () => {
      const selectedWarrior = document.querySelector('input[type="radio"]:checked')
      document.documentElement.style.setProperty(`--selectedDog`, `var(--${selectedWarrior.value})`) 
      // hideOverlay();
      pubsub.publish('selectCat')

    });
  }

  function selectKittyWarrior() {
      overlay.innerHTML = `<h2>Team Kitty</h2>
      Select your kitty warrior:
      <div class="icons">
      ${generateRadioButton('cat',['turkish-angora','siamese','scottish-fold','japanese-bobtail'])}
      </div>
      <button class="player2-ico">Submit</button>
      `;
      
      const p2_ico_button = document.querySelector(".player2-ico");
      p2_ico_button.addEventListener("click", () => {
        const selectedWarrior = document.querySelector('input[type="radio"]:checked')
        document.documentElement.style.setProperty(`--selectedCat`, `var(--${selectedWarrior.value})`) 
        hideOverlay();
        enableRestart();
      })
  };
  pubsub.subscription('selectCat',selectKittyWarrior).subscribe();

  function enableRestart(){
    const restartButton = document.querySelector('button.restart')
    restartButton.disabled = false;
  }
  function disableRestart(){
    const restartButton = document.querySelector('button.restart')
    restartButton.disabled = true;
  }

  // adding class to announcement div and flavor text can be made into a function
  // to avoid repeating?

  function announceWinner() {
    showOverlay();
    overlay.innerHTML = `Winner is ${gameMaster.getCurrentPlayer()}
    <p>
    <div class="${gameMaster.getCurrentPlayer()} winner"></div>`;
  }
  pubsub.subscription("winnerFound", announceWinner).subscribe();

  function announceDraw() {
    showOverlay();
    overlay.innerHTML = "It's a draw...";
  }
  pubsub.subscription("draw", announceDraw).subscribe();

  function resetAnnouncement() {
    hideOverlay();
    overlay.innerHTML = "";
  }
  pubsub.subscription("restart", resetAnnouncement).subscribe();

  const restartButton = document.querySelector(".restart");
  restartButton.addEventListener("click", () => {
    pubsub.publish("restart");
  });
})()
