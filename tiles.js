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
const answer = ['q', 'u', 'a', 'r', 'k'];

const crosswordContainer = document.getElementById('crossword');
const wordleContainer = document.getElementById('wordle');
const accent = window.getComputedStyle(document.body).getPropertyValue('--accent');
document.getElementById('refresh').addEventListener('click', () => location.reload());
var next;

function highlight(container, color) {
    container.style.backgroundColor = color;
}
function cell_attrs(row, col, cell, r, c) {
    cell.classList.add('letter');
    cell.setAttribute("autocomplete", "off");
    cell.addEventListener(`focus`, () => highlight(col, accent));
    cell.addEventListener('focusout', () => highlight(col, 'white'));
    cell.addEventListener('keydown', (event) => {
        var key = event.keyCode;
        if (key >= 65 && key <= 90) {
            next = document.querySelectorAll('[id=' + CSS.escape([r,c]));
            // next[0].value = event.key;
            next[1].value = event.key;
        }
    });
    cell.setSelectionRange(1, 1);
    cell.type = 'text';
    cell.value = ' ';
    cell.maxLength = 1;
    cell.id = [r, c];
}

let idx_r = 0;
let idx_c = 0;

crosswordLayout.forEach(row => {
    const crossRow = document.createElement('tr');
    row.forEach(letter => {
        const crossCol = document.createElement('td');
        const num = document.createElement('label');
        num.innerHTML = '0';
        const cell = document.createElement('input');
        cell_attrs(crossRow, crossCol, cell);
        cell.id = [idx_r, idx_c];
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
        idx_c++;
    });
    crosswordContainer.appendChild(crossRow);
    console.log(crossRow);
    idx_r++;
    idx_c = 0;
});

for (let i = 0; i < 6; i++) {
    const wordleRow = document.createElement('tr');
    for (let j = 0; j < 5; j++) {
        const wordleCol = document.createElement('td');
        const cell = document.createElement('input');
        cell_attrs(wordleRow, wordleCol, cell, i, j);
        cell.addEventListener('keydown', (event) => {
            if (event.key.match(/[A-Z]/i) && (j < 4)) {
                next = document.querySelectorAll('[id=' + CSS.escape([i,j+1]));
                next[1].disabled = false;
                next[1].focus();
            }
        })
        cell.addEventListener('keydown', (event) => {
            if(event.key === 'Backspace') {
                if (j != 0) {
                    next = document.querySelectorAll('[id=' + CSS.escape([i,j-1]))
                    cell.value = "";
                    next[1].focus();
                }
                else {event.stopPropagation();}
            }
            if((event.key === 'Enter' || event.key === 'Return') && j == 4) {
                next = document.querySelectorAll('[id=' + CSS.escape([i+1,0]));
                var correct = 0
                for (let x = 0; x < 5; x++) {
                    var toCheck = document.querySelectorAll('[id=' + CSS.escape([i,x]))[1];
                    console.log(answer.includes(toCheck.value.toLowerCase()));
                    if (answer[x] == toCheck.value.toLowerCase()) {
                        toCheck.classList.add('correct')
                        correct++;
                    }
                    else if (answer.includes(toCheck.value.toLowerCase())) {
                        toCheck.classList.add('almost')
                    }
                    toCheck.disabled = true;
                }
                if (correct != 5) {
                    next[1].disabled = false;
                    next[1].focus();
                }
            }
        });
        if (i > 0 || j > 0) {
            cell.disabled = true;
        }
        wordleCol.appendChild(cell);
        wordleRow.appendChild(wordleCol);
    }
    wordleContainer.appendChild(wordleRow);
}