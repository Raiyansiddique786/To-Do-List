// To do List

let input = document.querySelector("#input");
let btn = document.querySelector("#btn");
const list = document.querySelector("#tasklist");
const taskCountEl = document.getElementById("taskCount");

// --- Load tasks from localStorage on page load ---
window.onload = function () {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        let li = createTaskElement(task.text, task.completed);
        list.append(li);
    });
    updateTaskCount();
};

// --- Create task element ---
function createTaskElement(taskText, completed = false) {
    let listItem = document.createElement('li');

    // checkbox
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;

    // text span
    let span = document.createElement('span');
    span.textContent = taskText;

    // delete button
    let dltbtn = document.createElement('button');
    dltbtn.innerText = 'X';

    // assemble
    listItem.append(checkbox, span, dltbtn);
    if (completed) listItem.classList.add('completed');

    // Add animation class
    listItem.classList.add('added');
    setTimeout(() => listItem.classList.remove('added'), 300);

    // Edit task on double-click
    span.addEventListener('dblclick', function () {
        let newText = prompt("Edit task:", span.textContent);
        if (newText && newText.trim() !== '') {
            span.textContent = newText.trim();
            updateLocalStorage();
        }
    });

    return listItem;
}

// --- Add task ---
btn.addEventListener('click', function () {

    // skip empty
    const text = input.value.trim();
    if (!text) return;

    let li = createTaskElement(input.value, false);
    list.append(li);
    // reset the (input):
    input.value = '';
    updateLocalStorage();
    updateTaskCount();
});

// --- Add task on Enter key ---
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") btn.click(); // call the same function apply on btn
});

//Handle Delete + toggle:

list.addEventListener('click', function (event) {
    const target = event.target;

    // Delete task
    if (target.tagName === "BUTTON") {

        const parent = target.parentElement;
        parent.classList.add("removed");
        setTimeout(() => {
            parent.remove();
            updateLocalStorage();
            updateTaskCount();
        }, 300);
    }

    // Toggle completed
    if (target.type === "checkbox") {
        // toggle completed
        let li = target.parentElement;
        li.classList.toggle('completed', target.checked);
        updateLocalStorage();
        updateTaskCount();
    }
});


// --- Update localStorage ---
function updateLocalStorage() {
    let tasks = [...list.children].map(li => {
        return {
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('completed')
        };
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// --- Update task count ---
function updateTaskCount() {
    let tasks = [...list.children];
    let remaining = tasks.filter(li => !li.classList.contains('completed')).length;
    document.getElementById('taskCount').innerText = `${remaining} tasks remaining`;
}

// --- Filter buttons ---
document.getElementById('all').addEventListener('click', () => {
    [...list.children].forEach(li => li.style.display = 'flex');
});

document.getElementById('active').addEventListener('click', () => {
    [...list.children].forEach(li => li.style.display = li.classList.contains('completed') ? 'none' : 'flex');
});

document.getElementById('completed').addEventListener('click', () => {
    [...list.children].forEach(li => li.style.display = li.classList.contains('completed') ? 'flex' : 'none');
});