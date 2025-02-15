// crosswordContainer.style.gridTemplateColumns = "repeat(7, 40px)";
const crosswordLayout = [
    ['W', 'E', 'A', 'R', 'Y', ' ', ' '],
    [' ', ' ', 'L', ' ', ' ', ' ', ' '],
    [' ', ' ', 'I', 'N', 'G', 'O', 'T'],
    [' ', ' ', 'E', ' ', 'U', ' ', ' '],
    ['B', 'A', 'N', 'A', 'N', 'A', ' ']
];

const crosswordContainer = document.getElementById('crossword');
const accent = window.getComputedStyle(document.body).getPropertyValue('--accent');

function highlight(container, color) {
    container.style.backgroundColor = color;
}

crosswordLayout.forEach(row => {
    const crossRow = document.createElement('tr');
    row.forEach(letter => {
        const crossCol = document.createElement('td');
        const num = document.createElement('label');
        num.innerHTML = '0';
        const cell = document.createElement('input');
        cell.addEventListener(`focus`, () => highlight(crossCol, accent));
        cell.addEventListener('focusout', () => highlight(crossCol, 'white'));
        cell.addEventListener('focusout', () => console.log(cell.value));
        cell.setSelectionRange(1, 1);
        crossCol.appendChild(cell);
        cell.type = 'text';
        cell.maxLength = 1;
        cell.classList.add('letter');
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
    });
    crosswordContainer.appendChild(crossRow);
    console.log(crossRow);
});

