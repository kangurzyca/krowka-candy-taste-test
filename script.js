document.getElementById('add-tab-button').addEventListener('click', addTab);

const candies = loadCandiesFromStorage();

function addTab() {
    const tabContainer = document.createElement('div');
    tabContainer.className = 'tab';

    tabContainer.innerHTML = `
        <div class="tab-inputs">
            <div>
                <label for="candy-name">Candy Name:</label>
                <input type="text" class="candy-name">
            </div>
            <div>
                <label for="appearance">Appearance:</label>
                <input type="number" class="appearance" min="0" max="10">
            </div>
            <div>
                <label for="taste">Taste:</label>
                <input type="number" class="taste" min="0" max="10">
            </div>
            <div>
                <label for="texture">Texture:</label>
                <input type="number" class="texture" min="0" max="10">
            </div>
            <div>
                <label for="sweetness">Sweetness:</label>
                <input type="number" class="sweetness" min="0" max="10">
            </div>
            <div>
                <label for="edit-candy">Edit Candy:</label>
                <select class="edit-candy">
                    <option value="">Select a candy to edit</option>
                </select>
            </div>
        </div>
        <div>
            <button class="save-button">Save</button>
            <button class="edit-button">Edit</button>
        </div>
        <div class="overall-score">Overall Score: <span class="score">0</span></div>
    `;

    document.getElementById('tabs-container').appendChild(tabContainer);

    const saveButton = tabContainer.querySelector('.save-button');
    saveButton.addEventListener('click', () => saveScores(tabContainer));

    const editButton = tabContainer.querySelector('.edit-button');
    editButton.addEventListener('click', () => editScores(tabContainer));

    const editSelect = tabContainer.querySelector('.edit-candy');
    editSelect.addEventListener('change', () => updateFields(tabContainer, editSelect.value));

    updateEditOptions();
}

function saveScores(tab) {
    const name = tab.querySelector('.candy-name').value;
    const appearance = parseInt(tab.querySelector('.appearance').value) || 0;
    const taste = parseInt(tab.querySelector('.taste').value) || 0;
    const texture = parseInt(tab.querySelector('.texture').value) || 0;
    const sweetness = parseInt(tab.querySelector('.sweetness').value) || 0;

    const overallScore = appearance + taste + texture + sweetness;

    tab.querySelector('.overall-score .score').textContent = overallScore;

    candies[name] = { appearance, taste, texture, sweetness, overallScore };

    saveCandiesToStorage();
    renderTable();
    updateEditOptions();
}

function updateFields(tab, name) {
    if (candies[name]) {
        tab.querySelector('.candy-name').value = name;
        tab.querySelector('.appearance').value = candies[name].appearance;
        tab.querySelector('.taste').value = candies[name].taste;
        tab.querySelector('.texture').value = candies[name].texture;
        tab.querySelector('.sweetness').value = candies[name].sweetness;
    }
}

function updateEditOptions() {
    const select = document.querySelectorAll('.edit-candy');
    select.forEach(sel => {
        sel.innerHTML = '<option value="">Select a candy to edit</option>';
        Object.keys(candies).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            sel.appendChild(option);
        });
    });
}

function editScores(tab) {
    tab.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
        input.disabled = false;
    });
}

function removeRow(name) {
    delete candies[name];
    saveCandiesToStorage();
    renderTable();
    updateEditOptions();
}

function sortScoresTable() {
    const tbody = document.querySelector('#scores-table tbody');
    Array.from(tbody.querySelectorAll('tr'))
        .sort((a, b) => b.cells[5].textContent - a.cells[5].textContent)
        .forEach(tr => tbody.appendChild(tr));
}

function saveCandiesToStorage() {
    localStorage.setItem('candies', JSON.stringify(candies));
}

function loadCandiesFromStorage() {
    const storedCandies = localStorage.getItem('candies');
    return storedCandies ? JSON.parse(storedCandies) : {};
}

function renderTable() {
    const tbody = document.querySelector('#scores-table tbody');
    tbody.innerHTML = ''; // Clear the table body

    Object.keys(candies).forEach(name => {
        const { appearance, taste, texture, sweetness, overallScore } = candies[name];

        const row = document.createElement('tr');
        row.setAttribute('data-name', name);

        row.innerHTML = `
            <td>${name}</td>
            <td class="color-coded color-${appearance}">${appearance}</td>
            <td class="color-coded color-${taste}">${taste}</td>
            <td class="color-coded color-${texture}">${texture}</td>
            <td class="color-coded color-${sweetness}">${sweetness}</td>
            <td>${overallScore}</td>
            <td><button class="remove-button">Remove</button></td>
        `;

        row.querySelector('.remove-button').addEventListener('click', () => removeRow(name));

        tbody.appendChild(row);
    });

    sortScoresTable();
}

// Initial render of the table from localStorage
renderTable();
updateEditOptions();
