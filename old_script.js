const player = (marker) => {
    const _marker = marker
    const _playerMoves = {
        row: {},
        col: {},
        cornerA: {},
        cornerB: {}
    }

    const getMarker = () => marker

    function getPlayerMoves() {
        return JSON.parse(JSON.stringify(_playerMoves))
    }

    function adderLogic(square) {
        const datasetList = Object.keys(square.dataset)
        datasetList.forEach((key) => {
            const selectedField = square.dataset[key];
            if (_playerMoves[key].hasOwnProperty(selectedField)) {
                _playerMoves[key][selectedField]++
            } else {
                _playerMoves[key][selectedField] = 1;
            }

            if (_playerMoves[key][selectedField] == 3) {
                console.log("I win!")
                
            }
        })
    }

    return {getMarker, getPlayerMoves, adderLogic}
} // i think the above is not working because I need to instantiate an object and associate that module with it.

const playerOne = player('x');
const playerTwo = player('o');


(() => {
    function setDataVal (myNodes, propertyName, value) {
        myNodes.forEach((item) => item.dataset[propertyName] = value)
    }

    const container = document.querySelector('.container');
    const colA = container.querySelectorAll('.field:nth-child(3n+1)')
    const colB = container.querySelectorAll('.field:nth-child(3n+2)')
    const colC = container.querySelectorAll('.field:nth-child(3n+3)')
    const rowA = container.querySelectorAll('.field:nth-child(-n+3)')
    const rowB = container.querySelectorAll('.field:nth-child(n+4):nth-child(-n+6)')
    const rowC = container.querySelectorAll('.field:nth-child(n+7):nth-child(-n+9)')
    const cornerA = container.querySelectorAll('.field:nth-child(4n+1)')
    const cornerB = container.querySelectorAll('.field:nth-child(2n+3):nth-child(-n+7)')

    setDataVal(colA,'col','a');
    setDataVal(colB,'col','b');
    setDataVal(colC,'col','c');
    setDataVal(rowA,'row','a')
    setDataVal(rowB,'row','b')
    setDataVal(rowC,'row','c')
    setDataVal(cornerA,'cornerA','a')
    setDataVal(cornerB,'cornerB','b')


    // for testing. remove later.
    container.addEventListener('click',(e)=>{
    if (e.target.classList.contains ('container')) {
        
    } else if (!e.target.classList.contains('x' || 'o')) {
        console.log(e.target)
        playerOne.adderLogic(e.target)
        e.target.classList.add(playerOne.getMarker())
    }
    })
    // end of testing
})();




// logic for adding to counter:

// how to get list of all atributes for object
// Object.keys(myFields[0].dataset)
// (3) ['col', 'row', 'corner']0: "col"1: "row"2: "corner"length: 3[[Prototype]]: Array(0)
// Object.values(myFields[0].dataset)
// (3) ['a', 'a', 'a']