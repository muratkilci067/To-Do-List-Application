import { saveTasks, loadTasks } from "./locale.js";
const inputEntry = document.getElementById("input-entry");
const addBtn = document.getElementById("add-btn");
const listUl = document.querySelector(".list-ul");

let taskList = loadTasks() || [];
let currentlyEditingId = null;


function renderTaskList() {
  listUl.innerHTML = "";

  const sortedTasks = [...taskList].sort((a, b) => {
    if (a.status === b.status) return 0;
    if (a.status === "undone") return -1;
    return 1;
  });
  sortedTasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.classList.add("listLi");
    listItem.dataset.id = task.id;

    listItem.innerHTML = `
      <p class="listP">${task.inputEntry}</p>
      <div class="editArea hidden">
      <input class="editInput" value="${task.inputEntry}"/>
      <button class="saveButton">save</button>
      <button class="cancelButton">cancel</button>
      </div>
      <i class="fa-solid fa-trash-can iconRemove"></i>
      <i class="fa-solid fa-rotate-left iconBack"></i>
      <i class="fa-solid fa-pen-to-square iconEdit"></i>      
      `;

    const iconRemove = listItem.querySelector(".iconRemove");
    const iconBack = listItem.querySelector(".iconBack");
    const iconEdit = listItem.querySelector(".iconEdit");

    if (task.status === "done") {
      listItem.classList.add("liDone");
      iconBack.style.display = "flex";
      iconEdit.style.display = "none";
    } else {
      iconBack.style.display = "none";
    }

    listUl.appendChild(listItem);
    
    setTimeout(()=> listItem.classList.add("show"),200);
  });
  updatePanel();
}
    listUl.addEventListener("click", (event)=> {
      const target = event.target;
      const listItem = target.closest("li");
      if(!listItem) return;

      const taskId = Number(listItem.dataset.id);
      const task = taskList.find((t)=>t.id === taskId);

      if (currentlyEditingId !== null && currentlyEditingId !== task.id) {
        alert("Please complete the current edit first!");
        return;
      }

      if(target.tagName === "P" && task.status !== "done"){
        task.status = "done";
        saveTasks(taskList);
        launchConfetti();
        renderTaskList();
        return;
      }

      if(target.classList.contains("iconBack")){
        task.status = "undone";
        saveTasks(taskList);
        currentlyEditingId = null;
        renderTaskList();
        return;
      }

      if(target.classList.contains("iconRemove")){
        listItem.classList.add("hide");
         setTimeout(()=> {
      taskList = taskList.filter(t => t.id !== task.id);
      saveTasks(taskList);
      currentlyEditingId = null;
      renderTaskList();
      }, 200);
      return;
      }

      if(target.classList.contains("iconEdit")){
        currentlyEditingId = task.id;
        const taskText = listItem.querySelector(".listP");
        const editArea = listItem.querySelector(".editArea");
        const input = editArea.querySelector(".editInput");
        const saveButton = editArea.querySelector(".saveButton");
        const cancelButton = editArea.querySelector(".cancelButton");

        taskText.classList.add("hidden");
        editArea.classList.remove("hidden");
        target.classList.add("hidden");
        listItem.querySelector(".iconRemove").classList.add("hidden");

        input.focus();
        input.addEventListener("click", (e) => { e.stopPropagation() });

        saveButton.addEventListener("click", function saveHandler(e){
          e.stopPropagation();
          if (input.value.trim() === "") {
          alert("Input cannot be empty");
          return;
          }
          task.inputEntry = input.value;
          saveTasks(taskList);
          currentlyEditingId = null;
          renderTaskList();
          saveButton.removeEventListener("click", saveHandler);
        });
        cancelButton.addEventListener("click", function cancelHandler(e){
          e.stopPropagation();
          currentlyEditingId = null;
          renderTaskList();
          cancelButton.removeEventListener("click", cancelHandler);
        });
        return;
      }
    });

    inputEntry.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addBtn.click();
  };
})
addBtn.addEventListener("click", () => {
  const value = inputEntry.value.trim();
  if (value === "") {
    alert("Please enter a task");
    return;
  }
  addTask(value);
  inputEntry.value = "";
  renderTaskList();


})

function addTask(text, initialStatus = "undone") {
  let newTask = {
    inputEntry: text,
    status: initialStatus,
    id: Date.now()
  };
  taskList.push(newTask);
  saveTasks(taskList);
}


function updatePanel() {
  const totalCount = taskList.length;
  const doneCount = taskList.filter(task => task.status === "done").length;
  const undoneCount = taskList.filter(task => task.status === "undone").length;


  document.querySelector(".totalSpan").textContent = totalCount;
  document.querySelector(".doneSpan").textContent = doneCount;
  document.querySelector(".undoneSpan").textContent = undoneCount;
}

function launchConfetti() {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 }
  });
}