/*TODOS:
 (1) sort list DONE
 (2) List deletion side effect DONE
 (3) persist to local storage SEEMS TO BE DONE
 (4) Tasks with more than one word, deletion does not work fix DONE
 (5) night theme DONE
 (6) improve li spacing, current solution very much a hack DONE
 (7) Update days remaining DONE
 (8) sort tasks unchecks if done, need to save status of task DONE
 (9) fix line through on divs DONE
 (10) Theme toggle?
 (11) duplicate name potential delete issue - add num days into deletion
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
            date: date,
            status: false};
}
//update remaining days, generalise remainder to function


taskSubmit.addEventListener('click', () => {
    console.log("task submit clicked");
    let task = document.getElementById("task-input").value;
    let task_date = new Date(document.getElementById("task-date").value);
    let taskObj = createTask(task, task_date);

    taskObj.remaining_days = Math.floor((taskObj.date - today)/(1000*60*60*24))+1;
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

sortBtn.addEventListener('click', () => {
    console.log("sort button clicked");
    tasksContainer = tasksContainer.sort((a,b) => a.remaining_days - b.remaining_days);
    renderTasks(tasksContainer);
    renderTaskStatus();
})


ulEl.addEventListener('click', (element) => {
    console.log("clicked list element!");
    
    if((element.target.tagName == 'LI')) {
        element.target.classList.toggle('checked');

        let taskElement = element.target.innerText.replace("\n", "").replace("Days", "").replace("Remaining: ", "").split(' ');
        let taskStr = taskElement.slice(0, taskElement.length-1).join(" ");
        let taskDays = taskElement[taskElement.length-1];
        console.log("taskstrrrr");
        console.log(taskElement);
        console.log(taskDays);
        
        for(let i = 0; i < tasksContainer.length; i++) {
            if((tasksContainer[i].task == taskStr) && (tasksContainer[i].remaining_days == taskDays)) {
                tasksContainer[i].clicks +=1;
                if(tasksContainer[i].clicks % 2 != 0) {
                    tasksContainer[i].status = true;
                    element.target.childNodes[1].classList.toggle('checked');
                    element.target.childNodes[3].classList.toggle('checked');
                }
                else {
                    tasksContainer[i].status = false;
                    element.target.childNodes[1].classList = 'task';
                    element.target.childNodes[3].classList = 'days-remaining';
                }
            }
        } localStorage.setItem("myTasks", JSON.stringify(tasksContainer));
    }
    console.log(tasksContainer);
    
})

ulEl.addEventListener("dblclick", (element) => {
    console.log("double check");
    //get indexof days, get everything before then trim
    if(element.target.tagName == "LI") {
        let taskElement = element.target.innerText.replace("\n", "").replace("Days", "").replace("Remaining: ", "").split(' ');
        let taskStr = taskElement.slice(0, taskElement.length-1).join(" ");
        let days = taskElement[taskElement.length-1];
        
        console.log(taskElement);
        console.log(`taskStr: ${taskStr}`);
        console.log(days);
        for(let i = 0; i < tasksContainer.length; i++){
            if((tasksContainer[i].task == taskStr) && tasksContainer[i].remaining_days == days) {
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
        } 
        renderTasks(tasksContainer);
        renderTaskStatus();
    }
})

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

window.addEventListener('DOMContentLoaded', () => {
    console.log("DOM CONTENT LOADED");
    console.log(today);

    for(let i in tasksContainer) {
        if(tasksContainer[i].date == null) {
            tasksContainer[i].remaining_days = '';
        } else {
            tasksContainer[i].remaining_days = Math.floor((Date.parse(tasksContainer[i].date) - today)/(1000*60*60*24))+1;
        }
    }

    localStorage.setItem("myTasks", JSON.stringify(tasksContainer));
    //element.target.childNodes[3].classList.toggle('checked');
    
    // console.log(taskLi.childNodes[3].childNodes[3].classList);
    // console.log(taskLi.children);
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