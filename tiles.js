// crosswordContainer.style.gridTemplateColumns = "repeat(7, 40px)";
const crosswordLayout = [
    ['W', 'E', 'A', 'R', 'Y', ' ', ' '],
    [' ', ' ', 'L', ' ', ' ', ' ', ' '],
    [' ', ' ', 'I', 'N', 'G', 'O', 'T'],
    [' ', ' ', 'E', ' ', 'U', ' ', ' '],
    ['B', 'A', 'N', 'A', 'L', ' ', ' '],
    [' ', ' ', ' ', ' ', 'L', ' ', ' '],
    [' ', ' ', ' ', ' ', 'S', ' ', ' ']
];
const wordsList = ["weary", "alien", "ingot", "banal", "gulls"];
const assignments = [
    ['A', ' ', 'D', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', 'A', ' ', 'D', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['A', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ']
];

const crosswordContainer = document.getElementById('crossword');
const wordleContainer = document.getElementById('wordle');
const accent = window.getComputedStyle(document.body).getPropertyValue('--accent');
document.getElementById('refresh').addEventListener('click', () => location.reload());

function highlight(container, color) {
    container.style.backgroundColor = color;
}
function cell_attrs(row, col, cell) {
    cell.classList.add('letter');
    cell.setAttribute("autocomplete", "off");
    cell.addEventListener(`focus`, () => highlight(col, accent));
    cell.addEventListener('focusout', () => highlight(col, 'white'));
    cell.addEventListener('keydown', function(event) {
        if (event.key.match(/[A-Z]/i)) {
            cell.value = event.key;
        }
    });
    cell.setSelectionRange(1, 1);
    cell.type = 'text';
    cell.maxLength = 1;
}

// let idx_r = 0;
// let idx_c = 0;

crosswordLayout.forEach(row => {
    const crossRow = document.createElement('tr');
    row.forEach(letter => {
        const crossCol = document.createElement('td');
        const num = document.createElement('label');
        num.innerHTML = '0';
        const cell = document.createElement('input');
        cell_attrs(crossRow, crossCol, cell);
        crossCol.appendChild(cell);
        num.classList.add('number');
        if (letter === ' ') {
            cell.style.backgroundColor = 'black';
            crossCol.style.backgroundColor = 'black';
            cell.disabled = true;
        }
        else {
            crossCol.appendChild(num);
        }
        crossRow.appendChild(crossCol);
        // idx_c++;
    });
    crosswordContainer.appendChild(crossRow);
    console.log(crossRow);
    // idx_r++;
    // idx_c = 0;
});

for (let i = 0; i < 6; i++) {
    const wordleRow = document.createElement('tr');
    let nextVal = "";
    for (let j = 0; j < 5; j++) {
        const wordleCol = document.createElement('td');
        const cell = document.createElement('input');
        cell_attrs(wordleRow, wordleCol, cell);
        cell.id = [i, j];
        cell.addEventListener('keydown', (event) => {
            if (event.key.match(/[A-Z]/i) && (j < 5)) {
                nextVal = document.getElementById([i, j+1]).value;
                document.getElementById([i, j+1]).disabled = false;
                document.getElementById([i, j+1]).focus();
            }
        })
        cell.addEventListener('keyup', (event) => {
            if (!event.key.match(/[A-Z]/i)) {
                event.stopPropagation();
            }
            if (j != 4) {cell.value = ""};
        })
        cell.addEventListener('keydown', (event) => {
            if(event.key === 'Backspace') {
                document.getElementById([i, j-1]).focus();
            }
            if((event.key === 'Enter' || event.key === 'Return')) {
                document.getElementById([i+1, 0]).disabled = false;
                document.getElementById([i+1, 0]).focus();
            }
        });
        if (i > 0 || j > 0) {
            cell.disabled = true;
        }
        wordleCol.appendChild(cell);
        wordleRow.appendChild(wordleCol);
    }
    wordleContainer.appendChild(wordleRow);
    console.log(wordleRow);
}








// function checkGuess() {
//     const guess = document.getElementById("guess").value.toUpperCase();
//     if (guess.length !== 5) {
//         message.textContent = "Word must be 5 letters!";
//         return;
//     }

//     for (let i = 0; i < 5; i++) {
//         let tile = document.getElementById(`tile-${attempts}-${i}`);
//         tile.textContent = guess[i];

//         if (guess[i] === word[i]) {
//             tile.classList.add("correct");
//         } else if (word.includes(guess[i])) {
//             tile.classList.add("present");
//         } else {
//             tile.classList.add("absent");
//         }
//     }

//     attempts++;
//     if (guess === word) {
//         message.textContent = "Congratulations! You guessed the word!";
//         return;
//     }
//     if (attempts === 6) {
//         message.textContent = `Game over! The word was ${word}.`;
//     }r        }