let listTasks = document.getElementById("listTasks");
let inpTask = document.getElementById("inpTask");
let btnAdd = document.getElementById("btnAdd");
let btnClear = document.getElementById("btnClear");
let btnSort = document.getElementById("btnSort");
let btnRemove = document.getElementById("btnRemove");

let tasks = [];

function saveTaskList() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function retrieveList() {
    let retrievedTasks = localStorage.getItem("tasks");
    if(retrievedTasks) {
        tasks = JSON.parse(retrievedTasks);
    }
}

function clearTaskList() {
    tasks = [];
    renderTaskList();
    saveTaskList();
}

function toggleTaskStatus(id) {
    let checkbox = document.getElementById(id);
    let task = document.getElementById("task" + id);
    if(checkbox.checked) {
        task.className = "task-done taskText";
        tasks[id].status = "done"; 
        saveTaskList();
    }
    else {
        task.className = "task-not_done taskText";
        tasks[id].status = "not_done";
        saveTaskList();
    }
}

function shiftTaskDown(id) {
    let temp = tasks[id];
    tasks[id] = tasks[id+1];
    tasks[id+1] = temp;
    saveTaskList();
    renderTaskList();
}

function shiftTaskUp(id) {
    let temp = tasks[id];
    tasks[id] = tasks[id-1];
    tasks[id-1] = temp;
    saveTaskList();
    renderTaskList();
}

function renderTaskList() {
    listTasks.innerText = "";
    for(let i = 0; i < tasks.length; i++) {
        let li = document.createElement("li");
            let isChecked = (tasks[i].status == "done") ? "checked" : "";
            let shiftBtnHtml = "";
            if(tasks.length > 1) {
                if(i == 0) {
                    shiftBtnHtml = `<button type="button" class="btn btn-secondary btnDown" id="btnDown${i}" onclick=shiftTaskDown(${i})><i class="fas fa-long-arrow-alt-down"></i></button>`;            
                }
                else if(i == tasks.length - 1) {
                    shiftBtnHtml = `<button type="button" class="btn btn-secondary btnUp" id="btnUp${i}" onclick=shiftTaskUp(${i})><i class="fas fa-long-arrow-alt-up"></i></button>`;
                }
                else {
                    shiftBtnHtml = `<button type="button" class="btn btn-secondary btnDown" id="btnDown${i}" onclick=shiftTaskDown(${i})><i class="fas fa-long-arrow-alt-down"></i></button>` + `<button type="button" class="btn btn-secondary btnUp" id="btnUp${i}" onclick=shiftTaskUp(${i})><i class="fas fa-long-arrow-alt-up"></i></button>`;
                }
            }
            
            li.innerHTML += `${shiftBtnHtml}<input type="checkbox" id=${i} onclick=toggleTaskStatus(${i}) ${isChecked}>`
            let taskPara = document.createElement("span");
            taskPara.id = "task" + i;
            // taskPara.innerHTML += tasks[i].task + `<button type="button" class="btn btn-info view-note-btn" onclick=viewNote(${i})><i id="view-note-icon-${i}" class="far fa-comment-alt-edit"></i></button>
            //                                        <div class="note-container">
            //                                          <textarea type="text" id="task-note-${i}" style="display: none;"class="form-control task-note" aria-label="Default" aria-describedby="inputGroup-sizing-default" placeholder="Add a note...">${tasks[i].note}</textarea>
            //                                          <button type="button" id="save-note-btn-${i}" style="display: none;" class="btn btn-success save-note-btn" onclick=saveNote(${i})><i class="far fa-save"></i></button>
            //                                        </div>`;
            taskPara.innerHTML = tasks[i].task;
            if(tasks[i].status === "done") {
                taskPara.className = "task-done taskText"
                li.append(taskPara);
            }
            else {
                taskPara.className = "task-not_done taskText";
                li.append(taskPara);
            }

            if(window.innerWidth >= 768) {
                li.innerHTML += `<button type="button" class="btn btn-info view-note-btn" onclick=viewNote(${i})><i id="view-note-icon-${i}" class="far fa-comment-alt-edit"></i></button>`
            }
            else {
                li.innerHTML += `<a onclick=viewNote(${i})><i class="fas fa-chevron-down view-note-icon-mobile"></i></a>`;
            }
            li.innerHTML += `<div class="note-container">
                                <textarea type="text" id="task-note-${i}" style="display: none;"class="form-control task-note" aria-label="Default" aria-describedby="inputGroup-sizing-default" placeholder="Add a note...">${tasks[i].note}</textarea>
                                <button type="button" id="save-note-btn-${i}" style="display: none;" class="btn btn-success save-note-btn" onclick=saveNote(${i})><i class="far fa-save"></i></button>
                            </div>`;
        listTasks.appendChild(li);
    }
}

function addTask() {
    let task = inpTask.value;
    tasks.push({"task": task, "status": "not_done", "note": ""});
    renderTaskList();
    saveTaskList();
}

function viewNote(id) {
    let taskNoteArea = document.getElementById("task-note-" + id);
    let saveNoteBtn = document.getElementById("save-note-btn-" + id);
    if(taskNoteArea.style.display == "none") {
        taskNoteArea.style.display = "block";
        saveNoteBtn.style.display = "block";
        let viewNoteIcon = document.getElementById("view-note-icon-" + id);
        viewNoteIcon.className = "fas fa-times";
    }
    else {
        taskNoteArea.style.display = "none";
        saveNoteBtn.style.display = "none";
        let viewNoteIcon = document.getElementById("view-note-icon-" + id);
        viewNoteIcon.className = "far fa-comment-alt-edit";
    }
    
}

function saveNote(id) {
    let inpTaskNote = document.getElementById("task-note-" + id);
    let taskNote = inpTaskNote.value;
    if(taskNote == "") alert("Please enter a task note");
    tasks[id].note = taskNote;
    saveTaskList();
    renderTaskList();
}

btnClear.onclick = function() {
    clearTaskList();
}

btnAdd.onclick = function() {
    if(inpTask.value == "") {
        alert("Input field is empty. Please enter a task");
    }
    else {
        addTask();
        inpTask.value = "";
    }
}

inpTask.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        if(inpTask.value == "") {
            alert("Input field is empty. Please enter a task");
        }
        else {
            addTask();
            inpTask.value = "";
        }
    }
});

btnSort.onclick = function() {
    let sortedTasks = [];
    for(let i = 0; i < tasks.length; i++) {
        if(tasks[i].status == "not_done") {
            sortedTasks.push(tasks[i]);
        }
    }
    for(let i = 0; i < tasks.length; i++) {
        if(tasks[i].status == "done") {
            sortedTasks.push(tasks[i]);
        }
    }
    tasks = sortedTasks;
    saveTaskList();
    renderTaskList();
}

btnRemove.onclick = function() {
    let undone_tasks = [];
    for(let i = 0; i < tasks.length; i++) {
        if(tasks[i].status == "not_done") {
            undone_tasks.push(tasks[i]);
        }
    }
    tasks = undone_tasks;
    saveTaskList();
    renderTaskList();
}

retrieveList();
renderTaskList();