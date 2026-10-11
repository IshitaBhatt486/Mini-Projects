const form = document.getElementById("newTaskForm");
const newTask = document.getElementById("newTask");
const tasksContainer = document.getElementById("tasksContainer");
const emptyState = document.getElementById("emptyState");
const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");
const progressTrack = document.querySelector(".progress-track");
const clearCompleted = document.getElementById("clearCompleted");
let tasks = JSON.parse(localStorage.getItem("focus-list-tasks") || "[]");
document.getElementById("today").textContent = new Intl.DateTimeFormat("en-US", { weekday:"long", month:"long", day:"numeric" }).format(new Date());
function saveTasks() { localStorage.setItem("focus-list-tasks", JSON.stringify(tasks)); }
function updateSummary() { const complete=tasks.filter(task=>task.completed).length; const total=tasks.length; const percent=total?Math.round((complete/total)*100):0; progressText.textContent=`${complete} of ${total} complete`; progressPercent.textContent=`${percent}%`; progressBar.style.width=`${percent}%`; progressTrack.setAttribute("aria-valuenow",percent); emptyState.hidden=total>0; clearCompleted.hidden=complete===0; }
function createTaskElement(task) { const taskN=document.createElement("div"); taskN.className=`taskN${task.completed?" completed":""}`; taskN.dataset.id=task.id; const checkbox=document.createElement("input"); checkbox.type="checkbox"; checkbox.className="checkBox"; checkbox.checked=task.completed; checkbox.setAttribute("aria-label",`Mark ${task.text} as complete`); const taskName=document.createElement("div"); taskName.className="taskName"; taskName.textContent=task.text; const del=document.createElement("button"); del.className="delButton"; del.type="button"; del.setAttribute("aria-label",`Delete ${task.text}`); del.innerHTML=`<svg class="trash-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M9 7l1-2h4l1 2m-9 0 1 13h10l1-13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`; taskN.append(checkbox,taskName,del); return taskN; }
function renderTasks() { tasksContainer.replaceChildren(...tasks.map(createTaskElement)); updateSummary(); }
form.addEventListener("submit",event=>{ event.preventDefault(); const text=newTask.value.trim(); if(!text){newTask.focus();return;} tasks.unshift({id:crypto.randomUUID(),text,completed:false}); saveTasks(); renderTasks(); newTask.value=""; newTask.focus(); });
tasksContainer.addEventListener("change",event=>{ if(!event.target.matches(".checkBox"))return; const task=tasks.find(item=>item.id===event.target.closest(".taskN").dataset.id); if(!task)return; task.completed=event.target.checked; saveTasks(); renderTasks(); });
tasksContainer.addEventListener("click",event=>{ const deleteButton=event.target.closest(".delButton"); if(!deleteButton)return; const id=deleteButton.closest(".taskN").dataset.id; tasks=tasks.filter(task=>task.id!==id); saveTasks(); renderTasks(); });
clearCompleted.addEventListener("click",()=>{ tasks=tasks.filter(task=>!task.completed); saveTasks(); renderTasks(); });
renderTasks();
