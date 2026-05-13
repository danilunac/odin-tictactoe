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
            if (board[row][column].getValue() !== null) return;
            board[row][column].setMark(player);
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
