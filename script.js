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
            if (board[row][column].getValue() !== null) {
                console.log('You can\'t play there');
                return false;
            }
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

    const checkWinner = (board, player) => {
        // Convert Cell objects into a board of marks        
        const boardMarks = board.map((row) =>
            row.map((cell) => cell.getValue())
        );

        const createColumn = (column) => {
            return [
                boardMarks[0][column],
                boardMarks[1][column],
                boardMarks[2][column]
            ];
        };

        const mainDiagonal = [
            boardMarks[0][0],
            boardMarks[1][1],
            boardMarks[2][2]
        ];
        
        const antiDiagonal = [
            boardMarks[0][2],
            boardMarks[1][1],
            boardMarks[2][0]
        ];

        for (let i = 0; i < boardMarks.length; i++) {
            if (boardMarks[i].every((cell) => cell === player.mark)) {
                console.log(`${player.name} WIN whit ROW!`);
                return true;
            } 
            
            if (createColumn(i).every((cell) => cell === player.mark)) {
                console.log(`${player.name} WIN with COLUMN!`);
                return true;
            }
        }

        if (mainDiagonal.every((cell) => cell === player.mark)) {
            console.log(`${player.name} WIN with MAIN DIAGONAL!`);
            return true;
        }

        if (antiDiagonal.every((cell) => cell === player.mark)) {
            console.log(`${player.name} WIN with ANTI DIAGONAL!`);
            return true;
        }

        return false;
    };

    const playRound = (row, column) => {
        const allowedMove = gameboard.markCell(row, column, getActivePlayer().mark);

        if (allowedMove) {
            console.log(`${activePlayer.name}'s mark into row ${row} and column ${column}`);
            const hasWinner = checkWinner(gameboard.getBoard(), getActivePlayer());
            if (!hasWinner) {
                switchPlayerTurn();
            }
        }

        printCurrentRound();
    }

    return { switchPlayerTurn, getActivePlayer, printCurrentRound, playRound };
}

const player1 = Player('Dani', 'X');
const player2 = Player('Paola', 'O');
const game = GameController(player1, player2);
// game.playRound(0, 0);
// game.playRound(1, 1);
// game.playRound(1, 0);
// game.playRound(0, 1);
// game.playRound(0, 2);
// game.playRound(1, 2);
// game.playRound(2, 0);
// game.playRound(2, 1);
// game.playRound(2, 2);

game.playRound(0, 0);
game.playRound(1, 0);
game.playRound(1, 1);
game.playRound(0, 1);
game.playRound(0, 1);
game.playRound(2, 2);
game.playRound(2, 0);

// game.playRound(0, 2);
// game.playRound(2, 1);
// game.playRound(1, 1);
// game.playRound(0, 1);
// game.playRound(2, 0);

