// references to all html variables
const tasks_container = document.getElementById("tasks");
const task_template = document.getElementById("taskTemplate");
const add_button = document.getElementById("add");
const delete_button = document.getElementById("delete");
const logout_button = document.getElementById('logout');


let tasks = getTasks();
console.log(tasks);

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

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

function deleteCompleted() {
    tasks = getTasks();
    for (const task of tasks) {
        if (task.completed) {
            // this filter method of deltion means all equivalient tasks get deleted regardless of completed status, probably should be fixed
            tasks = tasks.filter(item => item.description != task.description);
            setTasks(tasks);
            refreshList();
        }
    }
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
            if (!task.completed)
                updateTask(task, "completed", true);
            else
                updateTask(task, "completed", false);
        });

        tasks_container.append(taskElement)
    }
}


add_button.addEventListener("click", () => {
    addTask();
    //testing out data base
    addDBTask();
});

delete_button.addEventListener("click", () => {
    deleteCompleted();
});

//logout button deletes the cookie
logout_button.addEventListener("click", () =>{
    console.log("registered click for logout");
    document.cookie = 'userID=; Max-Age=0; path=/;';
    //redirecting public/login.html
    window.location.href = "http://localhost:3000/public/login.html";
})



refreshList();
///////////////////////////////////////////////////////////////////
//new code from Christian
let list;

async function init(){
    //for get
    const response = await fetch(`http://localhost:3000/list`);
    //read and parse data from response
    const res = await response.json();
    console.log("res "+res);
    //check if array has content if not make another call to create list
    if(!res.length){
        //post to create list
        const newList = await fetch(`http://localhost:3000/list`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            //passing in default name of the list. Same as in browser
            body: JSON.stringify({
                name: "TO-DO List"
            }),
        });
        const resNewList = await newList.json();
        console.log(newList);
        list = resNewList;
        console.log(resNewList);
    }
    else{
        //if we use more than one list this needs to be changed
        //creating one list
        list = res[0];
    }
    
    console.log(res);
}
//post request to task endpoint
async function addDBTask(){

    const newTask = await fetch(`http://localhost:3000/task`,{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            list: list._id,
            description: "",
            completed: false
        }),
    });
    const res = await newTask.json();
    console.log("parsed "+res);
    console.log("new task: ", newTask);
}
init();