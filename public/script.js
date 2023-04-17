// references to all html variables

const tasks_container = document.getElementById("tasks");
const task_template = document.getElementById("taskTemplate");
const add_button = document.getElementById("add");
const delete_button = document.getElementById("delete");


let tasks = getTasks();

// get from local storage (temporary)
function getTasks() {
    const value = localStorage.getItem("todo") || "[]";

    return JSON.parse(value);
}

function setTasks(tasks) {
    const tasksJson = JSON.stringify(tasks);

    localStorage.setItem("todo", tasksJson);
}

function addTask() {
    tasks.unshift({
        description: "",
        completed: false
    });

    setTasks(tasks);
    refreshList();
}

function updateTask(task, key, value) {
    task[key] = value;
    setTasks(tasks);
    refreshList();
}

function refreshList() {
    tasks_container.innerHTML = "";

    for (const task of tasks) {
        const taskElement = task_template.content.cloneNode(true);
        const descriptionInput = taskElement.querySelector(".task-text");
        const completedInput = taskElement.querySelector(".task-complete");

        descriptionInput.value = task.description;
        completedInput.checked = task.completed;

        descriptionInput.addEventListener("change", () => {
            updateTask(task, "description", descriptionInput.value);
        });

        completedInput.addEventListener("change", () => {
            updateTask(task, "completed", descriptionInput.checked);
        });

        tasks_container.appendChild(taskElement)
    }
}


add_button.addEventListener("click", () => {
    addTask();
});



refreshList();