const canvas = document.getElementById('puzzleCanvas');
const ctx = canvas.getContext('2d');
let puzzleImage = new Image();
puzzleImage.src = '/static/image.jpg';  // Asegúrate de que la imagen esté en la carpeta `static`

let puzzleRows = 3;
let puzzleCols = 3;
let cellWidth, cellHeight;
let puzzle = [];
let emptyCell = { x: puzzleCols - 1, y: puzzleRows - 1 };
let messageShown = false;  // Variable para controlar si el mensaje "Ganaste" ya se mostró

puzzleImage.onload = function() {
    // Ajusta el tamaño del canvas según la proporción de la imagen
    const aspectRatio = puzzleImage.width / puzzleImage.height;
    canvas.width = 600;  // Ajusta este valor según el tamaño deseado
    canvas.height = canvas.width / aspectRatio;

    cellWidth = canvas.width / puzzleCols;
    cellHeight = canvas.height / puzzleRows;

    initPuzzle();
    drawPuzzle();
};

function initPuzzle() {
    puzzle = [];
    for (let i = 0; i < puzzleCols; i++) {
        puzzle[i] = [];
        for (let j = 0; j < puzzleRows; j++) {
            puzzle[i][j] = { x: i, y: j };
        }
    }
    puzzle[emptyCell.x][emptyCell.y] = null;  // Marca la última celda como vacía
    scramblePuzzle();
}

function drawPuzzle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < puzzleCols; i++) {
        for (let j = 0; j < puzzleRows; j++) {
            if (puzzle[i][j] !== null) {
                let piece = puzzle[i][j];
                ctx.drawImage(puzzleImage, 
                              piece.x * (puzzleImage.width / puzzleCols), piece.y * (puzzleImage.height / puzzleRows), 
                              puzzleImage.width / puzzleCols, puzzleImage.height / puzzleRows,
                              i * cellWidth, j * cellHeight, cellWidth, cellHeight);
            }
        }
    }

    // Verifica si el puzzle está resuelto
    if (isSolved() && !messageShown) {
        // completa la imagen 
        ctx.drawImage(puzzleImage, 0, 0, puzzleImage.width, puzzleImage.height, 0, 0, canvas.width, canvas.height);
        showWinMessage();
    }
}

function scramblePuzzle() {
    // Intercambiar piezas de manera aleatoria para mezclar el puzzle
    for (let i = 0; i < 100; i++) {
        let direction = Math.floor(Math.random() * 4);
        switch (direction) {
            case 0: moveLeft(); break;
            case 1: moveRight(); break;
            case 2: moveUp(); break;
            case 3: moveDown(); break;
        }
    }
}

function moveLeft() {
    if (emptyCell.x < puzzleCols - 1) {
        puzzle[emptyCell.x][emptyCell.y] = puzzle[emptyCell.x + 1][emptyCell.y];
        puzzle[emptyCell.x + 1][emptyCell.y] = null;
        emptyCell.x++;
    }
}

function moveRight() {
    if (emptyCell.x > 0) {
        puzzle[emptyCell.x][emptyCell.y] = puzzle[emptyCell.x - 1][emptyCell.y];
        puzzle[emptyCell.x - 1][emptyCell.y] = null;
        emptyCell.x--;
    }
}

function moveUp() {
    if (emptyCell.y < puzzleRows - 1) {
        puzzle[emptyCell.x][emptyCell.y] = puzzle[emptyCell.x][emptyCell.y + 1];
        puzzle[emptyCell.x][emptyCell.y + 1] = null;
        emptyCell.y++;
    }
}

function moveDown() {
    if (emptyCell.y > 0) {
        puzzle[emptyCell.x][emptyCell.y] = puzzle[emptyCell.x][emptyCell.y - 1];
        puzzle[emptyCell.x][emptyCell.y - 1] = null;
        emptyCell.y--;
    }
}

function isSolved() {
    for (let i = 0; i < puzzleCols; i++) {
        for (let j = 0; j < puzzleRows; j++) {
            if (puzzle[i][j] !== null && (puzzle[i][j].x !== i || puzzle[i][j].y !== j)) {
                return false;
            }
        }
    }
    return true;
}

function showWinMessage() {
    // Muestra el mensaje "¡Ganaste!" sin borrar el puzzle
    ctx.font = "48px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    // Dibuja un rectángulo blanco con una opacidad del 50% detrás del mensaje para identificarlo mejor
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 40, 300, 50); 
    ctx.fillStyle = "black";

    ctx.fillText("¡Ganaste!", canvas.width / 2, canvas.height / 2);
    messageShown = true;
}

window.addEventListener('keydown', (event) => {
    if (!isSolved() && !messageShown) {
        switch (event.key) {
            case 'a': moveLeft(); break;
            case 'w': moveUp(); break;
            case 's': moveDown(); break;
            case 'd': moveRight(); break;
        }
        drawPuzzle();
    }
});

//crear la funcionalidad por si se preciona el boton de shufflePuzzle
const shufflePuzzle = document.getElementById('shuffleButton');
shufflePuzzle.addEventListener('click', () => {
    initPuzzle();
    drawPuzzle();
    messageShown = false;
});

//crear la funcionalidad por si se preciona el boton de solvePuzzle
const solvePuzzle = document.getElementById('solveButton');
solvePuzzle.addEventListener('click', () => {
    puzzle = [];
    for (let i = 0; i < puzzleCols; i++) {
        puzzle[i] = [];
        for (let j = 0; j < puzzleRows; j++) {
            puzzle[i][j] = { x: i, y: j };
        }
    }
    puzzle[emptyCell.x][emptyCell.y] = null;
    drawPuzzle();
    messageShown = false;
});
