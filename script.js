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

        const resetBoard = () => {
            board.forEach(row => {
                row.forEach(cell => {
                    cell.setNull();
                })
            })
        };

        const printBoard = () => {
            const boardWithCellValues = board.map((row) =>
                row.map((cell) => cell.getValue())
            );
            console.log(boardWithCellValues);
        };

        return { getBoard, markCell, resetBoard, printBoard };
    }

    return Gameboard();

})();

function Cell() {
    let value = null;

    const setMark = (player) => {
        value = player;
    }

    const setNull = () => {
        value = null;
    }

    const getValue = () => value;

    return { setMark, setNull, getValue };
}

function Player(name, mark) {
    return { name, mark };
}

function GameController(playerOne, playerTwo) {
    let activePlayer = playerOne;
    let gameOver = false;
    let hasTie = false;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    const getActivePlayer = () => activePlayer;

    const getGameOver = () => gameOver;

    const getHasTie = () => hasTie;

    const printCurrentRound = () => {
        gameboard.printBoard();
        console.log(`${activePlayer.name}'s turn.`);
    }

    const checkWinner = (board, player) => {
        // Convert Cell objects into a board of marks`
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

    function checkEmptyCells() {
        const boardMarks = gameboard.getBoard().map((row) =>
            row.map((cell) => cell.getValue())
        );

        return boardMarks.some(row =>
            row.some(cell => cell === null)
        );
    }

    const playRound = (row, column) => {
        if (!gameOver) {
            const allowedMove = gameboard.markCell(row, column, getActivePlayer().mark);

            if (allowedMove) {
                console.log(`${activePlayer.name}'s mark into row ${row} and column ${column}`);
                const hasWinner = checkWinner(gameboard.getBoard(), getActivePlayer());
                if (hasWinner) {
                    gameOver = true;
                    return true;
                } else {
                    const emptyCells = checkEmptyCells();
                    if (emptyCells) {
                        switchPlayerTurn();
                    } else {
                        hasTie = true;
                    }
                }
            }
        }
        printCurrentRound();
    }

    function resetGame() {
        gameboard.resetBoard();
        activePlayer = playerOne;
        gameOver = false;
        hasTie = false;
    }

    return {
        switchPlayerTurn,
        getActivePlayer,
        getGameOver,
        getHasTie,
        printCurrentRound,
        checkWinner,
        playRound,
        resetGame
    };
}

function ScreenController() {
    const player1 = Player('Dani', 'X');
    const player2 = Player('Eleazar', 'O');
    const game = GameController(player1, player2);

    const resetButton = document.querySelector('.reset');
    const gameStatusDiv = document.querySelector('.game-status');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        const gameOver = game.getGameOver();

        // Get the current board state and active player
        const board = gameboard.getBoard();
        const activePlayer = game.getActivePlayer();

        // Clear the board
        boardDiv.textContent = '';

        if (!gameOver) {
            const hasTie = game.getHasTie();
            if (hasTie) {
                gameStatusDiv.textContent = 'It\'s a tie!';
            } else {
                gameStatusDiv.textContent = `${activePlayer.name}'s turn`;
            }
        } else {
            gameStatusDiv.textContent = `${activePlayer.name} wins!`;
        }

        // Render board squares
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.append(cellButton);
            })
        })
    };

    // Add event listener for the board
    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow && !selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);

        updateScreen();
    }
    boardDiv.addEventListener('click', clickHandlerBoard);

    resetButton.addEventListener('click', () => {
        game.resetGame();
        updateScreen();
    })

    // Initial render
    updateScreen();
}

ScreenController();