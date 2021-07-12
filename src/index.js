/*TODOS:
 (1) sort list DONE
 (2) List deletion side effect DONE
 (3) persist to local storage SEEMS TO BE DONE
 (4) Tasks with more than one word, deletion does not work fix
 (5) night theme
 (6) improve li spacing, current solution very much a hack
 (7) Update days remaining
*/ 


const hamburgerBtn = document.getElementById("hamburger");
const navList = document.getElementById("theme-list");
let hamburgerClicks = -1;

//const theme = document.getElementById("hamburger-content-sel");
const theme = document.getElementById("hamburger");

theme.addEventListener('click', () => {
    const body = document.querySelector("body");
    const logo = document.querySelector(".logo");
    hamburgerClicks ++;    
    if (hamburgerClicks % 2 == 0) {
        body.classList.toggle('day');
        logo.classList.toggle('day');        
    } else {
        body.classList.toggle('night');
        logo.classList.toggle('night');        
    }

    console.log(hamburgerClicks);
})

const taskSubmit = document.getElementById('task-submit'); 
const today = new Date();
const ulEl = document.getElementById("ul-el");
const sortBtn = document.getElementById("sort-btn");
let tasksContainer = [];
let tasksFromLocal = JSON.parse(localStorage.getItem("myTasks"));

if(tasksFromLocal) {
    tasksContainer = tasksFromLocal;
    renderTasks(tasksContainer);
}

console.log(tasksContainer[0]);

function createTask(task, date) {
    return {task: task,
            date: date};
}
//update remaining days, generalise remainder to function


taskSubmit.addEventListener('click', () => {
    console.log("task submit clicked");
    let task = document.getElementById("task-input").value;
    let task_date = new Date(document.getElementById("task-date").value);
    let taskObj = createTask(task, task_date)

    taskObj.remaining_days = Math.floor((taskObj.date - today)/(1000*60*60*24));

    if(isNaN(taskObj.remaining_days)) {
        taskObj.remaining_days = '';
    }

    tasksContainer.push(taskObj);
    localStorage.setItem("myTasks", JSON.stringify(tasksContainer));
    console.log(localStorage.getItem("myTasks"));

    for(let i = 0; i < tasksContainer.length; i++) {
        console.log(tasksContainer[i]);
    }
    renderTasks(tasksContainer);
})

sortBtn.addEventListener('click', () => {
    console.log("sort button clicked");
    tasksContainer = tasksContainer.sort((a,b) => a.remaining_days - b.remaining_days);
    renderTasks(tasksContainer);
})

ulEl.addEventListener('click', (element) => {
    console.log("clicked list element!");
    if(element.target.tagName == 'LI') {
        element.target.classList.toggle('checked');
    }
    
})

ulEl.addEventListener("dblclick", (element) => {
    console.log("double check");
    //get indexof days, get everything before then trim
    if(element.target.tagName == "LI") {
        let taskElement = element.target.innerText.split(' ');
        let task = '';
        let days = 0;

        for(let i = 0; i < taskElement.length; i++) {
            if((taskElement[i] != "Days") || (taskElement[i] != "remaining:") || (!taskElement[i].isInteger())) {
                task += taskElement[i]+' ';
            } else if (taskElement[i].isInteger()) {
                days = taskElement[i];
            }
        }
        //console.log(taskElement);
        console.log(task);
        console.log(days);
        for(let i = 0; i < tasksContainer.length; i++){
            if((tasksContainer[i].task == taskElement[0]) && tasksContainer[i].remaining_days == taskElement[taskElement.length-1]) {
                tasksContainer.splice(i, 1);
                console.log(tasksContainer[i]);
                //localStorage.removeItem(tasksFromLocal[i]);
                localStorage.setItem("myTasks", JSON.stringify(tasksContainer));
            } else if ((tasksContainer[i].task == '') || (tasksContainer[i].remaining_days == '')) {
                tasksContainer.splice(i, 1);
                //console.log(tasksContainer[i]);
                //localStorage.removeItem(taskContainer[i]);
                localStorage.setItem("myTasks", JSON.stringify(tasksContainer));
            }
        } renderTasks(tasksContainer);

    }
})

//render out list using JS with tasks
function renderTasks(taskArray) {
    console.log("calling renderTasks()");

    let listItems = '';
    for(let i = 0; i < tasksContainer.length; i++) {
        listItems += 
            `<li>
                ${tasksContainer[i].task} &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp 
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp 
                &nbsp &nbsp &nbsp 
                Days remaining: ${tasksContainer[i].remaining_days}
            </li>`;
    }
    ulEl.innerHTML = listItems;
}

