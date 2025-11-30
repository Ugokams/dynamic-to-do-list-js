// Run code when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // In-memory tasks array (will be synced with localStorage)
    let tasks = [];

    // Load tasks from localStorage and render them
    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks = storedTasks.slice(); // copy to in-memory array
        storedTasks.forEach(taskText => {
            // when loading from storage, pass save = false to avoid duplicate saves
            addTask(taskText, false);
        });
    }

    // Save the current tasks array to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to add a new task
    // If taskText is provided, it will be used; otherwise the function reads from the input field.
    // If save === true, the task will be added to localStorage (default).
    function addTask(taskText = null, save = true) {
        // Get and trim input value when taskText is not provided
        const text = (taskText !== null) ? String(taskText).trim() : taskInput.value.trim();

        // Check if empty
        if (text === "") {
            if (taskText === null) { // only alert when user tried to add via UI
                alert("Please enter a task.");
            }
            return;
        }

        // Create new list item
        const li = document.createElement('li');
        li.textContent = text;

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remove";

        // Use classList.add as required
        removeBtn.classList.add('remove-btn');

        // Remove task when button is clicked
        removeBtn.onclick = function() {
            // Remove from DOM
            taskList.removeChild(li);

            // Remove from in-memory tasks array (remove first occurrence)
            const index = tasks.indexOf(text);
            if (index > -1) {
                tasks.splice(index, 1);
                saveTasks();
            }
        };

        // Append button to li, and li to task list
        li.appendChild(removeBtn);
        taskList.appendChild(li);

        // If save is true, update localStorage (avoid saving when loading existing items)
        if (save) {
            tasks.push(text);
            saveTasks();
        }

        // Clear input field (only when user added the task)
        if (taskText === null) {
            taskInput.value = "";
        }
    }

    // Add task on button click
    addButton.addEventListener('click', function() {
        addTask(); // reads from input and saves
    });

    // Add task on Enter key
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Load saved tasks when the page loads
    loadTasks();
});
