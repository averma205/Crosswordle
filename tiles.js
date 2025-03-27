// crosswordContainer.style.gridTemplateColumns = "repeat(7, 40px)";
const crosswordLayout = [
    ['q', 'u', 'a', 'r', 'k', ' ', ' '],
    [' ', ' ', 'l', ' ', ' ', ' ', ' '],
    [' ', ' ', 'i', 'n', 'g', 'o', 't'],
    [' ', ' ', 'e', ' ', 'u', ' ', ' '],
    ['b', 'a', 'n', 'a', 'l', ' ', ' '],
    [' ', ' ', ' ', ' ', 'l', ' ', ' '],
    [' ', ' ', ' ', ' ', 's', ' ', ' ']
];
var assignments = [
    [[0,0], 1, 4],
    [[0,2], 0, 4],
    [[2,2], 1, 6],
    [[4,0], 1, 4],
    [[2,4], 0, 6]
];
const wordsList = [];
let temp = "";
let coord;
assignments.forEach(word => {
    for (let i = 0; i <= word[2] - word[0][word[1]]; i++) {
        temp += crosswordLayout[word[0][0] + (i * (word[1]==0?1:0))][word[0][1] + (i * word[1])];
    }
    wordsList.push(temp);
    temp = "";
})

const crosswordContainer = document.getElementById('crossword');
const wordleContainer = document.getElementById('wordle');
const accent = window.getComputedStyle(document.body).getPropertyValue('--accent');
document.getElementById('refresh').addEventListener('click', () => location.reload());
var next;

function highlight(container, color) {
    container.style.backgroundColor = color;
}
function cell_attrs(col, cell, r, c, corr) {
    cell.id = [r, c];
    cell.classList.add('letter');
    cell.setAttribute("autocomplete", "off");
    cell.addEventListener(`focus`, () => {
        highlight(col, accent);
        highlight(document.querySelectorAll('[id=' + CSS.escape(corr[c]))[0], accent);
    });
    cell.addEventListener('focusout', () => {
        highlight(col, 'white');
        highlight(document.querySelectorAll('[id=' + CSS.escape(corr[c]))[0], 'white');
    });
    cell.addEventListener('keydown', (event) => {
        var key = event.keyCode;
        if (key >= 65 && key <= 90) {
            next = document.querySelectorAll('[id=' + CSS.escape(corr[c]));
            next[0].value = event.key;
            cell.value = event.key;
            if (c < 4) {
                next = document.querySelectorAll('[id=' + CSS.escape([r,c+1]));
                next[1].disabled = false;
                next[1].focus();
            }
        }
    });
    cell.setSelectionRange(1, 1);
    cell.type = 'text';
    cell.value = ' ';
    cell.maxLength = 1;
}

let idx_r = 0;
let idx_c = 0;
var current = 0;
crosswordLayout.forEach(row => {
    const crossRow = document.createElement('tr');
    row.forEach(letter => {
        const crossCol = document.createElement('td');
        const num = document.createElement('label');
        num.innerHTML = '0';
        const cell = document.createElement('input');
        cell.id = [idx_r, idx_c];
        cell.classList.add('letter');
        cell.setAttribute("autocomplete", "off");
        cell.addEventListener(`focus`, () => {
            highlight(crossCol, accent);
        });
        cell.addEventListener('focusout', () => {
            highlight(crossCol, 'white');
        });
        cell.setSelectionRange(1, 1);
        cell.type = 'text';
        cell.value = ' ';
        cell.maxLength = 1;
        crossCol.appendChild(cell);
        num.classList.add('number');
        cell.disabled = true;
        if (letter === ' ') {
            cell.style.backgroundColor = 'black';
            crossCol.style.backgroundColor = 'black';
        }
        else {
            crossCol.appendChild(num);
        }
        crossRow.appendChild(crossCol);
        current = assignments.map((val) => (val[0][0] == idx_r) && (val[0][1] == idx_c));
        if (current.includes(true)) {
            cell.disabled = false;
            cell.addEventListener('click', () => {
                current = assignments.map((val) => (val[0][0] == cell.id[0]) && (val[0][1] == cell.id[2]));
                createWordle(assignments.map((e, i) => [e, current[i]]).filter((pair) => pair[1] == true)[0][0],
                            wordsList.map((e, i) => [e, current[i]]).filter((pair) => pair[1] == true)[0][0]);
            })
        }
        idx_c++;
    });
    crosswordContainer.appendChild(crossRow);
    idx_r++;
    idx_c = 0;
});

function createWordle(word, answer) {
    wordleContainer.innerHTML = '';
    const corr = [];
    for (let i = word[0][word[1]]; i <= word[2]; i++) {
        corr.push([word[0][0] + (i * (word[1]==0?1:0)), word[0][1] + (i * word[1])]);
    }
    for (let i = 0; i < 6; i++) {
        const wordleRow = document.createElement('tr');
        for (let j = 0; j < 5; j++) {
            const wordleCol = document.createElement('td');
            const cell = document.createElement('input');
            cell_attrs(wordleCol, cell, i, j, corr);
            cell.addEventListener('keydown', (event) => {
                if(event.key === 'Backspace') {
                    if (j != 0) {
                        next = document.querySelectorAll('[id=' + CSS.escape([i,j-1]))
                        cell.value = ' ';
                        next[1].focus();
                    }
                    else {event.stopPropagation();}
                }
                if((event.key === 'Enter' || event.key === 'Return') && j == 4) {
                    next = document.querySelectorAll('[id=' + CSS.escape([i+1,0]));
                    var correct = 0
                    for (let x = 0; x < 5; x++) {
                        var toCheck = document.querySelectorAll('[id=' + CSS.escape([i,x]))[1];
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
}
createWordle([[0,0],1,4]);