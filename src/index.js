const hamburgerBtn = document.getElementById("hamburger");
const navList = document.getElementById("theme-list");
let hamburgerClicks = -1;
const theme = document.getElementById("hamburger");
const taskSubmit = document.getElementById('task-submit'); 
const today = new Date();
const ulEl = document.getElementById("ul-el");
const sortBtn = document.getElementById("sort-btn");
let tasksContainer = [];
let tasksFromLocal = JSON.parse(localStorage.getItem("myTasks"));

//if tasks in local storage render them
if(tasksFromLocal) {
    tasksContainer = tasksFromLocal;
    renderTasks(tasksContainer);
}

//event listenner to switch between day and night themes
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
})

//builds the task data structure
function createTask(task, date) {
    return {task: task,
            date: date,
            status: false,
            sortKey: 0};
}

//submits task if add task button clicked
taskSubmit.addEventListener('click', () => {
    console.log("task submit clicked");
    let task = document.getElementById("task-input").value;
    let task_date = new Date(document.getElementById("task-date").value);
    let taskObj = createTask(task, task_date);

    taskObj.remaining_days = Math.floor((taskObj.date - today)/(1000*60*60*24))+1;
    taskObj.sortKey = taskObj.remaining_days;
    taskObj.clicks = 0;

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

//sorts tasks based on remaining days, tasks marked as done get pushed to the bottom of the stack
sortBtn.addEventListener('click', () => {
    console.log("sort button clicked");
    tasksContainer = tasksContainer.sort((a,b) => a.sortKey - b.sortKey);
    localStorage.setItem("myTasks", JSON.stringify(tasksContainer));
    renderTasks(tasksContainer);
    renderTaskStatus();
})

//controls which event occurs when clicking on a dask, single click marks task as done, double click deletes
let clickCount = 0;
const timeOut = 400;
ulEl.addEventListener('click', (element) => {
    clickCount ++;
    if(clickCount === 1) {
        singleClickTimer = setTimeout(function(){
            clickCount = 0;
            checkItem(element);
        }, timeOut); }
    else if (clickCount === 2) {
        clearTimeout(singleClickTimer);
        clickCount = 0;
        deleteItem(element);
    }
}, false);
    
//renders a task as 'done' by toggling the theme
function checkItem(element) {
    console.log("clicked list element!");

    
    if((element.target.tagName == 'LI')) {
        element.target.classList.toggle('checked');

        let taskElement = element.target.innerText.replace("\n", "").replace("Days", "").replace("Remaining: ", "").split(' ');
        let taskStr = taskElement.slice(0, taskElement.length-1).join(" ");
        let taskDays = taskElement[taskElement.length-1];
        if(taskDays == "Remaining:") {
            taskDays = '';
        }
        console.log("taskstrrrr");
        console.log(taskStr);
        console.log(taskDays);


        
        for(let i = 0; i < tasksContainer.length; i++) {
            if((tasksContainer[i].task == taskStr) && (tasksContainer[i].remaining_days == taskDays)) {
                tasksContainer[i].clicks +=1;
                console.log("match");
                if(tasksContainer[i].clicks % 2 != 0) {
                    
                    tasksContainer[i].status = true;
                    element.target.childNodes[1].classList.toggle('checked');
                    element.target.childNodes[3].classList.toggle('checked');
                    tasksContainer[i].sortKey = 1000;

                }
                else {
                    tasksContainer[i].status = false;
                    element.target.childNodes[1].classList = 'task';
                    element.target.childNodes[3].classList = 'days-remaining';
                    tasksContainer[i].sortKey = tasksContainer[i].remaining_days;
                }
            }
        } 
       
        
        
        localStorage.setItem("myTasks", JSON.stringify(tasksContainer));
    }

    renderTasks(tasksContainer);
    renderTaskStatus();
}

// deletes a task
function deleteItem(element)  {
    console.log("double check");

    if(element.target.tagName == "LI") {
        let taskElement = element.target.innerText.replace("\n", "").replace("Days", "").replace("Remaining: ", "").split(' ');
        let taskStr = taskElement.slice(0, taskElement.length-1).join(" ");
        let taskDays = taskElement[taskElement.length-1];
        if(taskDays == "Remaining:") {
            taskDays = '';
        }
        
        for(let i = 0; i < tasksContainer.length; i++){
            if((tasksContainer[i].task == taskStr) && tasksContainer[i].remaining_days == taskDays) {
                tasksContainer.splice(i, 1);
                console.log(`taskcontainer ${tasksContainer.task}`);
                
                localStorage.setItem("myTasks", JSON.stringify(tasksContainer));
        } 
        renderTasks(tasksContainer);
        renderTaskStatus();
    }}}

//dynamically renders tasks on the page
function renderTasks(taskArray) {
    console.log("calling renderTasks()");

    let listItems = '';
    
    for(let i = 0; i < tasksContainer.length; i++) {
        listItems += 
            `<li class="li-tasks" id="task-list-elem">
                    <div class="task" id="task-div"> ${tasksContainer[i].task} </div> 
                    <div class="days-remaining" id="days-div"> Days Remaining: ${tasksContainer[i].remaining_days} </div>
            </li>`;

    }
    ulEl.innerHTML = listItems;
}

//renders tasks when the dom is loaded, also updates the remaining days function
window.addEventListener('DOMContentLoaded', () => {
    console.log("DOM CONTENT LOADED");
    console.log(today);

    for(let i in tasksContainer) {
        if(tasksContainer[i].date == null) {
            tasksContainer[i].remaining_days = '';
        } else if(tasksContainer[i].sortKey == 1000) {
            tasksContainer[i].remaining_days = Math.floor((Date.parse(tasksContainer[i].date) - today)/(1000*60*60*24))+1;  
        } else {
            tasksContainer[i].remaining_days = Math.floor((Date.parse(tasksContainer[i].date) - today)/(1000*60*60*24))+1;
            tasksContainer[i].sortKey = tasksContainer[i].remaining_days;    
        }
    }

    localStorage.setItem("myTasks", JSON.stringify(tasksContainer));
    console.log(tasksContainer);
    renderTaskStatus();

}
)
    
function renderTaskStatus() {
    const taskLi = document.getElementById("ul-el");
    for(let i in tasksContainer) {
        if(tasksContainer[i].status == true) {
     
            for(let j in taskLi.childNodes) {
                try {
                    let text = taskLi.childNodes[j].childNodes[1].textContent.trim();
                    if(text === tasksContainer[i].task) {
                        taskLi.childNodes[j].classList.toggle('checked');
                        let cn = taskLi.childNodes[j].childNodes;
                        cn[1].classList.toggle('checked');
                        cn[3].classList.toggle('checked');
                    }
                }
            
                 catch(e) {
                    console.log(e)
                 }
    }

    }
}
}