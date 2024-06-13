import Page from "./Page.js";
import {getNonogram} from "../levels/levels.js";

export default class GamePage extends Page {
    constructor(settings) {
        super(settings);
        this.gridSize = 10;
        this.tileSize = 35;
        this.clueOffset = 15;
        this.clueFontSize = 11;
        this.level = Number(localStorage.getItem('level')) ?? 1;        this.solution = getNonogram(this.level);
        this.nonogram = this.#generateNonogramArray();
        this.fanfareSound = new Audio('../../media/fanfare.mp3');
    }

    render() {
        return `
            <section id="game-container">
                <canvas id="game" height="600" width="600"></canvas>
            </section>
        `;
    }

    showPage() {
        super.showPage();
        this.canvas = document.getElementById('game');
        // Only to show the canvas after it was hidden by the end dialog
        if (this.canvas) {
            this.canvas.style.display = 'block';
        }
        this.ctx = this.canvas.getContext('2d');
        this.gridStart = Math.round(this.canvas.width / 2 - 10 * this.tileSize / 2);
        this.#startGame();
    }

    #generateNonogramArray() {
        const nonogram = [];
        for (let i = 0; i < this.solution.length; i++) {
            const row = [];
            for (let j = 0; j < this.solution[i].length; j++) {
                row.push(0);
            }
            nonogram.push(row);
        }
        return nonogram;
    }

    #nonogramSolved() {
        for (let i = 0; i < this.solution.length; i++) {
            for (let j = 0; j < this.solution[i].length; j++) {
                if (this.solution[i][j] === 1) {
                    if (this.nonogram[i][j] !== 1) return false;
                } else {
                    if (this.nonogram[i][j] === 1) return false;
                }
            }
        }
        return true;
    }

    #startGame() {
        this.#drawGrid();

        let isDrawing = false;
        this.lastClickedRow = null;
        this.lastClickedColumn = null;

        this.canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            this.#handleClick(e);
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (isDrawing) {
                this.#handleClick(e);
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            isDrawing = false;
            this.lastClickedRow = null;
            this.lastClickedColumn = null;
        });

        this.canvas.addEventListener('contextmenu', e => e.preventDefault());
    }

    #drawGrid() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Set the fill style to white and fill the entire canvas
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // using drawTile to draw the grid that will be exactly in the middle of the canvas
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                this.#drawTile(this.ctx, this.gridStart + x * this.tileSize, this.gridStart + y * this.tileSize, this.#getTileColor(this.nonogram[y][x]));
            }
        }
        this.ctx.fillStyle = 'black';
        this.ctx.fillText('ℹ️ Left click to fill a tile, right click to mark tile that cannot be filled.', this.gridStart+20, this.gridStart+this.gridSize*this.tileSize+20);
        this.#drawRowPrompts();
        this.#drawColumnPrompts();
    }

    #drawTile (ctx, x, y, color) {
        // Draw the black border
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, this.tileSize, this.tileSize);

        // If the fill color is red, draw an 'X' mark
        if (color === 'red') {
            // Fill the rectangle white
            ctx.fillStyle = 'white';
            ctx.fillRect(x+3, y+3, this.tileSize-6, this.tileSize-6);

            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;

            // Draw the 'X' mark
            ctx.beginPath();
            ctx.moveTo(x + 4, y + 4);
            ctx.lineTo(x - 4 + this.tileSize, y + this.tileSize - 5);
            ctx.moveTo(x - 4 + this.tileSize, y + 4);
            ctx.lineTo(x + 4, y + this.tileSize - 5);
            ctx.stroke();
        } else {
            // Fill the rectangle with the specified color
            ctx.fillStyle = color;
            ctx.fillRect(x+3, y+3, this.tileSize-6, this.tileSize-6);
        }
    }

    #drawRowPrompts() {
        // Generate row clues
        const rowClues = this.solution.map(row => {
            const clues = [];
            let count = 0;
            // Iterate through row
            row.forEach(cell => {
                if (cell === 1) {
                    count++;
                } else if (count > 0) {
                    clues.push(count);
                    count = 0;
                }
            });
            // Push last number if there is one
            if (count > 0) {
                clues.push(count);
            }
            return clues.length ? clues : [0];
        });
        // Draw row clues
        rowClues.forEach((clue, row) => {
            clue.reverse().forEach((num, index) => {
                this.ctx.fillStyle = 'black';
                this.ctx.font = `${this.clueFontSize}px Verdana`;
                let y = this.gridStart + (row * this.tileSize) + this.clueFontSize + (this.tileSize-this.clueFontSize)/2; // Center the clues vertically
                let x = this.gridStart - this.clueOffset * (index + 1); // Offset the clues to the left
                this.ctx.fillText(num.toString(), x, y);
            });
        });
    }

    #drawColumnPrompts() {
        // Generate column clues
        const columnClues = this.solution[0].map((col, i) => {
            const clues = [];
            let count = 0;
            // Iterate through column
            this.solution.forEach(row => {
                if (row[i] === 1) {
                    count++;
                } else if (count > 0) {
                    clues.push(count);
                    count = 0;
                }
            });
            // Push last number if there is one
            if (count > 0) {
                clues.push(count);
            }
            return clues.length ? clues : [0];
        });
        // Draw column clues
        columnClues.forEach((clue, col) => {
            clue.reverse().forEach((num, index) => {
                this.ctx.fillStyle = 'black';
                this.ctx.font = `${this.clueFontSize}px Verdana`;
                let x = this.gridStart + (col * this.tileSize) + (this.tileSize-this.clueFontSize)/2; // Center the clues horizontally
                let y = this.gridStart - this.clueOffset * (index * 1.1 + 1); // Offset the clues to the top
                this.ctx.fillText(num.toString(), x, y);
            });
        });

    }

    #handleClick(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        const {row, col} = this.#getNonogramGridCoordinates(x, y);
        if (row >= 0 && row < 10 && col >= 0 && col < 10) {
            // If the clicked tile is different from the last clicked tile
            if (this.lastClickedRow !== row && this.lastClickedColumn !== col) {
                // Left click
                if (e.button === 0) {
                    this.nonogram[row][col] = this.nonogram[row][col] === 1 ? 0 : 1;
                }
                // Right click
                else if (e.button === 2) {
                    this.nonogram[row][col] = this.nonogram[row][col] === 2 ? 0 : 2;
                }
                // Redraw the clicked tile
                this.#drawTile(this.ctx, this.gridStart + col * this.tileSize, this.gridStart + row * this.tileSize, this.#getTileColor(this.nonogram[row][col]));
                if (this.#nonogramSolved()) {
                    this.#rainbowTransition();
                }
                // Update the last clicked tile
                this.lastClickedRow = row;
                this.lastClickedColumn = col;
            }
        }
    }

    #getTileColor(value) {
        // Get color based on the nonogram array value 0 = white, 1 = black, 2 = red
        switch (value) {
            case 0:
                return 'white';
            case 1:
                return 'black';
            case 2:
                return 'red';
            default:
                return 'white';
        }
    }

    #getNonogramGridCoordinates(x, y) {
        const row = Math.floor((y - this.gridStart) / this.tileSize);
        const col = Math.floor((x - this.gridStart) / this.tileSize);
        return {row, col};
    }

    #rainbowTransition() {
        // Using Audio API - play the fanfare sound
        if (this.level === 5) {
            this.fanfareSound.currentTime = 0;
            this.fanfareSound.play();
        }
        let frame = 0;
        const animate = () => {
            for (let row = 0; row < this.gridSize; row++) {
                for (let col = 0; col < this.gridSize; col++) {
                    if (this.nonogram[row][col] === 1) {
                        // Calculate the hue based on the current frame
                        const hue = (frame + row + col) % 360;
                        // Convert the hue to a CSS HSL color
                        const color = `hsl(${hue}, 100%, 50%)`;
                        // Redraw the tile with the new color
                        this.#drawTile(this.ctx, this.gridStart + col * this.tileSize, this.gridStart + row * this.tileSize, color);
                    } else if (this.nonogram[row][col] === 2) {
                        // Redraw the tile with white color
                        this.#drawTile(this.ctx, this.gridStart + col * this.tileSize, this.gridStart + row * this.tileSize, 'white');
                    }
                }
            }
            // Increment the frame
            frame++;
            // If the hue has not reached the blue color (240 in HSL), schedule the next frame
            if (frame < 240) {
                window.requestAnimationFrame(animate);
            } else {
                // Show the end dialog
                setTimeout(() => this.#showEndDialog(), 1000);
            }
        };
        animate();
    }

    #showEndDialog() {
        // Hide the canvas
        this.canvas.style.display = 'none';

        // Create the dialog
        const dialog = document.createElement('div');
        dialog.classList.add('end-dialog');

        // Center the dialog on the screen
        dialog.style.position = 'absolute';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';

        // Create the message
        const message = document.createElement('h2');
        if (this.level < 5) {
            message.textContent = `Congratulations on finishing level ${this.level}`;
        } else {
            message.textContent = 'Congratulations on finishing the game';
        }
        dialog.appendChild(message);

        // Create the buttons
        const nextLevelButton = document.createElement('button');
        nextLevelButton.classList.add('button-next-level');
        nextLevelButton.textContent = this.level < 5 ? 'Next Level' : 'Play Level 1';
        // Increment the level or reset it to 1
        this.level = this.level < 5 ? this.level + 1 : 1;
        localStorage.setItem('level', this.level);
        nextLevelButton.addEventListener('click', () => {
            // Reload the page
            location.reload();
        });
        dialog.appendChild(nextLevelButton);

        const homePageButton = document.createElement('button');
        homePageButton.textContent = 'Go to Home Page';
        homePageButton.addEventListener('click', () => {
            // Go to the home page
            location.href = 'index.html';
        });
        dialog.appendChild(homePageButton);

        // Append the dialog to the body
        document.body.appendChild(dialog);
    }
}