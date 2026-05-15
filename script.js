const gameboard = (function () {

    function Gameboard() {
        const rows = 3;
        const columns = 3;
        const board = [];

        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }

        const getBoard = () => board;

        const markCell = (row, column, player) => {
            if (board[row][column].getValue() !== null) return false;
            board[row][column].setMark(player);
            return true;
        };

        const printBoard = () => {
            const boardWithCellValues = board.map((row) =>
                row.map((cell) => cell.getValue())
            );
            console.log(boardWithCellValues);
        };
        
        return { getBoard, markCell, printBoard };
    }

    return Gameboard();

})();

function Cell() {
    let value = null;

    const setMark = (player) => {
        value = player;
    }

    const getValue = () => value;

    return { setMark, getValue };
}

function Player(name, mark) {
    return { name, mark };
}

function GameController(playerOne, playerTwo) {
    let activePlayer = playerOne;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    const getActivePlayer = () => activePlayer;

    const printCurrentRound = () => {
        gameboard.printBoard();
        console.log(`${activePlayer.name}'s turn.`);
    }

    const playRound = (row, column) => {
        console.log(`${activePlayer.name}'s mark into row ${row} and column ${column}`);
        let allowedMove = gameboard.markCell(row, column, getActivePlayer().mark);

        if (allowedMove) {
            switchPlayerTurn();
        } 
        printCurrentRound();
    }

    return { switchPlayerTurn, getActivePlayer, printCurrentRound, playRound };
}