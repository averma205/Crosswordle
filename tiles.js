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
    coord = word[0];
    for (let i = word[0][word[1]]; i <= word[2]; i++) {
        temp += crosswordLayout[coord[0]][coord[1]];
        coord[word[1]]++;
    }
    wordsList.push(temp);
    temp = "";
})
assignments = [
    [[0,0], 1, 4],
    [[0,2], 0, 4],
    [[2,2], 1, 6],
    [[4,0], 1, 4],
    [[2,4], 0, 6]
];
const answer = wordsList[0];


const crosswordContainer = document.getElementById('crossword');
const wordleContainer = document.getElementById('wordle');
const accent = window.getComputedStyle(document.body).getPropertyValue('--accent');
document.getElementById('refresh').addEventListener('click', () => location.reload());
var next;

function highlight(container, color) {
    container.style.backgroundColor = color;
}
function cell_attrs(row, col, cell, r, c) {
    cell.id = [r, c];
    cell.classList.add('letter');
    cell.setAttribute("autocomplete", "off");
    cell.addEventListener(`focus`, () => {
        highlight(col, accent);
        highlight(document.querySelectorAll('[id=' + CSS.escape([r,c]))[0], accent);
        // document.querySelectorAll('[id=' + CSS.escape([r,c])).forEach(square => {
        //     highlight(square, accent)
        // })
    });
    cell.addEventListener('focusout', () => {
        highlight(col, 'white');
        highlight(document.querySelectorAll('[id=' + CSS.escape([r,c]))[0], 'white');
        // document.querySelectorAll('[id=' + CSS.escape([r,c])).forEach(square => {
        //     highlight(square, 'white')
        // })
    });
    cell.addEventListener('keydown', (event) => {
        var key = event.keyCode;
        if (key >= 65 && key <= 90) {
            next = document.querySelectorAll('[id=' + CSS.escape([r,c]));
            next[0].value = event.key;
            next[1].value = event.key;
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
        cell_attrs(crossRow, crossCol, cell);
        cell.id = [idx_r, idx_c];
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
        current = assignments.map((coord) => coord[0]).map((val) =>
            (val[0] == idx_r) && (val[1] == idx_c));
        if (current.includes(true)) {
            cell.disabled = false;
            console.log(current);
            cell.addEventListener('click', () => {
                console.log(current);
                // console.log(assignments.map((e, i) => [e, current[i]]).filter((pair) => pair[1] == true)[0][0]);
                // createWordle(assignments.map((e, i) => [e, current[i]]).filter((pair) => pair[1] == true)[0][0]);
            })
            current++;
        }
        idx_c++;
    });
    crosswordContainer.appendChild(crossRow);
    idx_r++;
    idx_c = 0;
});

function createWordle(word) {
    console.log(word);
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
createWordle();