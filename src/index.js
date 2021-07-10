const hamburgerBtn = document.getElementById("hamburger");
const navList = document.getElementById("theme-list");

// hamburgerBtn.addEventListener("click", () => {
//     console.log("clicked burger");
//     navList.classList.toggle('show');    
// }
// )

// let form = document.querySelector('form');
// let data = Object.fromEntries(new FormData(form).entries())

// console.log(data);

// document.querySelector('form').addEventListener('submit', (input) => {
//     const data = Object.fromEntries(new FormData(input.target).entries());
//     console.log(data);
// })

/*TODOS:
 (1) sort list DONE
 (2) List deletion side effect
 (3) persist to local storage
 (4) night theme
 (5) improve li spacing, current solution very much a hack
*/ 

const taskSubmit = document.getElementById('task-submit'); 
const today = new Date();
const ulEl = document.getElementById("ul-el");
const sortBtn = document.getElementById("sort-btn");
let tasksContainer = [];

console.log(today);


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
    console.log(taskObj);

    for(let i = 0; i < tasksContainer.length; i++) {
        console.log(tasksContainer[i]);
    }
    renderTasks(tasksContainer);
})

sortBtn.addEventListener('click', () => {
    console.log("sort button clicked");
    let sortedTasks = tasksContainer.sort((a,b) => a.remaining_days - b.remaining_days);
    renderTasks(sortedTasks);
})

ulEl.addEventListener('click', (element) => {
    console.log("clicked list element!");
    if(element.target.tagName == 'LI') {
        element.target.classList.toggle('checked');
    }
    
})

ulEl.addEventListener("dblclick", (element) => {
    console.log("double check");
    if(element.target.tagName == "LI") {
        let taskElement = element.target.innerText.split(' ');
        console.log(taskElement);
        console.log(`Task Element Object ${taskElement[1]}`);
        for(let i = 0; i < tasksContainer.length; i++){
            if((tasksContainer[i].task == taskElement[0]) && tasksContainer[i].remaining_days == taskElement[taskElement.length-1]) {
                tasksContainer.splice(i);
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

