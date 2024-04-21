const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task))
}

addEmptyList();

//первый аргумент событие, второй то, что выполнится после события
form.addEventListener('submit',addTask)
//первый аргумент событие, второй то, что выполнится после события
tasksList.addEventListener('click',deleteTask)
tasksList.addEventListener('click',doneTask)

function addTask(event){
    //чтобы страница не перезагружалась, так как форма отправляется
    event.preventDefault();
    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    tasks.push(newTask);

    renderTask(newTask);

    taskInput.value = '';
    taskInput.focus();

    addEmptyList();
    saveToLocalStorage()
}

function deleteTask(event){

    if(event.target.dataset.action !== 'delete') return;

    const parentNode = event.target.closest('.list-group-item');
    const id = Number(parentNode.id);

    // первый вариант
    // const index = tasks.findIndex((task) => task.id === id);
    // tasks.splice(index,1);

    tasks = tasks.filter((task) => task.id !== id )
    
    parentNode.remove();

    addEmptyList();
    saveToLocalStorage()
}

function doneTask(event){
    if(event.target.dataset.action !== 'done') return;
    
    const parentNode = event.target.closest('.list-group-item');
    const id = Number(parentNode.id);

    const task = tasks.find((task) => task.id === id)
    task.done = !task.done;

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');

    saveToLocalStorage()
}

function addEmptyList(event){
    if(tasks.length === 0){
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/logo.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
        </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    }

    if(tasks.length > 0){
        const emptyList1 = document.querySelector('#emptyList');
        emptyList1 ? emptyList1.remove() : null;
    }
}

function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task){
        const cssClass = task.done ? "task-title task-title--done" : "task-title";
        const taskHtml = `<li id=${task.id} class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>`;
    tasksList.insertAdjacentHTML('beforeend', taskHtml);
    
}