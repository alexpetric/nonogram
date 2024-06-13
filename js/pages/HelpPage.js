import Page from "./Page.js";

export default class HelpPage extends Page {
    constructor(settings) {
        super(settings);
    }

    render() {
        return `
            <section id="help">
                <h1>Help</h1>
                <p>
                    <b>Nonograms</b>, also known as Hanjie, Picross or Griddlers, are picture logic puzzles in which 
                    cells in a grid must be colored or left blank according to numbers at the side of the grid to reveal a hidden picture.
                </p>
                <p>
                    To play, select a cell to fill or empty it.
                </p>
                <p> 
                    <b>Left click</b> marks a cell as filled, <b>Right click</b> marks a cell as empty.
                </p>
                <p>
                    The numbers on the top and left side of the grid indicate the number of filled cells in each row and column. 
                    Use these numbers to deduce which cells to fill and which to empty.
                </p>
                <p>
                    If you're ready to play, click the "Start Game" button below.
                </p>
                <button id="start-game">Start game</button>
            </section>
        `;
    }

    showPage() {
        super.showPage();
        const startGameButton = document.getElementById('start-game');
        startGameButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.pushState(null, null, '?page=game');
            window.dispatchEvent(new Event('popstate'));
        });
    }
}