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
const right = window.getComputedStyle(document.body).getPropertyValue('--right');
const wrong = window.getComputedStyle(document.body).getPropertyValue('--wrong');
const almost = window.getComputedStyle(document.body).getPropertyValue('--almost');
document.getElementById('refresh').addEventListener('click', () => location.reload());
var next;
var prev;

function highlight(container, color) {
    container.style.backgroundColor = color;
}
function cell_attrs(col, cell, r, c, corr) {
    cell.id = [r, c];
    cell.classList.add('letter');
    cell.setAttribute("autocomplete", "off");
    var cross = document.querySelectorAll('[id=' + CSS.escape([corr[c][0]+10, corr[c][1]+10]))[0];
    cell.addEventListener(`focus`, () => {
        highlight(col, accent);
        if (cross.style.backgroundColor == '') {
            highlight(cross, accent);
        }
    });
    cell.addEventListener('focusout', () => {
        highlight(col, 'white');
        highlight(cross, cross.style.backgroundColor==accent?'white':accent);
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
        crossCol.id = [idx_r + 10, idx_c + 10];
        const num = document.createElement('label');
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
        num.innerHTML = current.lastIndexOf(true) >= 0 ? (current.lastIndexOf(true)+1).toString():String.fromCharCode(160);
        if (current.includes(true)) {
            cell.disabled = false;
            cell.addEventListener('click', () => {
                current = assignments.map((val) => (val[0][0] == cell.id[0]) && (val[0][1] == cell.id[2]));
                var word = assignments.map((e, i) => [e, current[i]]).filter((pair) => pair[1] == true)[0][0];
                var answer = wordsList.map((e, i) => [e, current[i]]).filter((pair) => pair[1] == true)[0][0];
                createWordle(word, answer);
                document.querySelectorAll('[id=' + CSS.escape([0,0]))[1].focus();

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
    for (let i = 0; i <= word[2] - word[0][word[1]]; i++) {
        corr.push([word[0][0] + (i * (word[1]==0?1:0)), word[0][1] + (i * word[1])]);
    }
    for (let i = 0; i < 6; i++) {
        const wordleRow = document.createElement('tr');
        for (let j = 0; j < 5; j++) {
            const wordleCol = document.createElement('td');
            const cell = document.createElement('input');
            cell_attrs(wordleCol, cell, i, j, corr);
            cell.addEventListener('keydown', (event) => {
                prev = document.querySelectorAll('[id=' + CSS.escape([i,j-1]));
                next = document.querySelectorAll('[id=' + CSS.escape([i,j+1]));
                if(event.key === 'ArrowLeft') {
                    prev[1].focus();
                }
                if(event.key === 'ArrowRight') {
                    next[1].focus();
                }
                if(event.key === 'Backspace') {
                    if (j != 0) {
                        cell.value = ' ';
                        prev[1].focus();
                    }
                    else {event.stopPropagation();}
                }
                if((event.key === 'Enter' || event.key === 'Return') && j == 4) {
                    next = document.querySelectorAll('[id=' + CSS.escape([i+1,0]));
                    var correct = 0
                    for (let x = 0; x < 5; x++) {
                        var toCheck = document.querySelectorAll('[id=' + CSS.escape([i,x]))[1];
                        var wCheck = document.querySelectorAll('[id=' + CSS.escape(corr[x]))[0];
                        var wCell = document.querySelectorAll('[id=' + CSS.escape([corr[x][0]+10, corr[x][1]+10]))[0];
                        wCheck.classList = ['letter'];
                        wCell.classList = []
                        if (answer[x] == toCheck.value.toLowerCase()) {
                            toCheck.classList.add('correct');
                            wCheck.classList.add('correct');
                            highlight(wCell, right)
                            correct++;
                        }
                        else if (answer.includes(toCheck.value.toLowerCase())) {
                            toCheck.classList.add('almost');
                            wCheck.classList.add('almost');
                            highlight(wCell, almost)
                        }
                        else {
                            toCheck.classList.add('wrong');
                            wCheck.classList.add('wrong');
                            highlight(wCell, wrong)
                        }
                        toCheck.disabled = true;
                    }
                    if (correct != 5 && document.querySelectorAll('[id=' + CSS.escape([i,4]))[1].value != ' ') {
                        next[1].disabled = false;
                        next[1].focus();
                    }
                    else {document.querySelectorAll('[id=' + CSS.escape(corr[0]))[0].disabled = true;}
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
createWordle([[0,0],1,4], wordsList[0]);
document.querySelectorAll('[id=' + CSS.escape([0,0]))[1].focus();