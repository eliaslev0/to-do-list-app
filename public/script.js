// Newest script from Eli

// references to all html variables
const tasks_container = document.getElementById("tasks");
const task_template = document.getElementById("taskTemplate");
const add_button = document.getElementById("add");
const delete_button = document.getElementById("delete");

const about_button = document.getElementById("about");
const home_button = document.getElementById("home");
const notif_button = document.getElementById("notif");

const datesList = [];

let tasks = getTasks();
console.log(tasks);

// unfinished, called once a day, checks through array of dates set (recurring) and if current day matches day set in list, sends notification.
var dayInMilliseconds = 1000 * 60 * 60 * 24;
setTimeout(function () {
  alert("test");
  let i = 0;
  const date = new Date();
  while (i < datesList.length) {
    if (date == datesList[i]) {
      const notification = new Notification("To-Do List", {
        body: "Tasks left to Complete",
      });
    }
  }
}, dayInMilliseconds);

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Used for local storage of the username
const nameInput = document.querySelector("#name");

window.addEventListener("load", () => {
  todos = JSON.parse(localStorage.getItem("todo")) || "[]";

  const username = localStorage.getItem("username") || "";
  nameInput.value = username;

  nameInput.addEventListener("change", (e) => {
    localStorage.setItem("username", e.target.value);
  });
});

// get from local storage (temporary)
function getTasks() {
  const value = localStorage.getItem("todo") || "[]";
  // use userID to fetch data from backend
  const userID = getCookie("userID");
  console.log(userID);
  return JSON.parse(value);
}

function setTasks(tasks) {
  const tasksJson = JSON.stringify(tasks);

  localStorage.setItem("todo", tasksJson);
}

function addTask() {
  tasks.unshift({
    description: "",
    completed: false,
    dateValue: "",
    repeat: "none",

    color: "",
  });

  setTasks(tasks);
  refreshList();
}

function updateTask(task, key, value) {
  task[key] = value;
  setTasks(tasks);
  refreshList();
}

function deleteCompleted() {
  tasks = getTasks();
  tasks = tasks.filter((item) => item.completed == false);
  setTasks(tasks);
  refreshList();
}

function refreshList() {
  tasks_container.innerHTML = "";

  for (const task of tasks) {
    const taskElement = task_template.content.cloneNode(true);
    const descriptionInput = taskElement.querySelector(".task-text");
    const completedInput = taskElement.querySelector(".task-complete");
    const dateInput = taskElement.querySelector(".task-date");
    const repeatTask = taskElement.querySelector(".task-recurring");

    const colorTask = taskElement.querySelector(".task-color");

    descriptionInput.value = task.description;
    completedInput.checked = task.completed;
    dateInput.value = task.date;
    repeatTask.value = task.repeat;

    colorTask.value = task.color;

    descriptionInput.addEventListener("change", () => {
      updateTask(task, "description", descriptionInput.value);
    });

    completedInput.addEventListener("change", () => {
      if (!task.completed) updateTask(task, "completed", true);
      else updateTask(task, "completed", false);
    });

    dateInput.addEventListener("change", () => {
      updateTask(task, "date", dateInput.value);
      console.log(dateInput.value);
    });

    repeatTask.addEventListener("change", () => {
      updateTask(task, "repeat", repeatTask.value);
      console.log(repeatTask.value);

      var dateEntered = new Date(dateInput.value);
      dateEntered.setDate(dateEntered.getDate() + 1);
      // console.log(dateEntered);

      // recurring task functionality, shows first 10 instances and adds them to an array. array is checked in separate function
      if (repeatTask.value == "daily") {
        for (let i = 0; i < 10; i++) {
          // console.log("DAILY " + dateEntered);
          datesList.push(dateEntered);
          dateEntered.setDate(dateEntered.getDate() + 1);
        }
      } else if (repeatTask.value == "weekly") {
        for (let i = 0; i < 10; i++) {
          // console.log("WEEKLY " + dateEntered);
          datesList.push(dateEntered);
          dateEntered.setDate(dateEntered.getDate() + 7);
        }
      } else if (repeatTask.value == "yearly") {
        for (let i = 0; i < 10; i++) {
          // console.log("YEARLY " + dateEntered);
          datesList.push(dateEntered);
          dateEntered.setDate(dateEntered.getDate() + 365);
        }
      }

      console.info(datesList);
    });

    colorTask.addEventListener("change", () => {
      updateTask(task, "color", colorTask.value);
    });

    tasks_container.append(taskElement);
  }
}

add_button.addEventListener("click", () => {
  addTask();
});

delete_button.addEventListener("click", () => {
  deleteCompleted();
});

about_button.addEventListener("click", () => {
  window.location.href = "http://localhost:3000/public/about.html";
});

home_button.addEventListener("click", () => {
  window.location.href = "http://localhost:3000/protected/index.html";
});

function showNotif() {
  const notification = new Notification("To-Do List", {
    body: "Tasks left to Complete",
  });
}

notif_button.addEventListener("click", () => {
  Notification.requestPermission().then((perm) => {
    if (perm === "granted") {
      showNotif();
    }
  });
});
refreshList();
