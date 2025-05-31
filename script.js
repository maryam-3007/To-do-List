const inputBox = document.getElementById("search");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

window.addEventListener("load", loadTasks);

function Addtask() {
  const task = inputBox.value.trim();
  if (!task) {
    alert("Please write down a task");
    return;
  }

  addTaskToUI(task, false); 
  inputBox.value = "";
  saveTasks();
}

function addTaskToUI(taskText, isChecked) {
  const li = document.createElement("li");
 li.innerHTML = `
  <label>
    <input type="checkbox" ${isChecked ? "checked" : ""}>
    <span>${taskText}</span>
  </label>
  <div class="action-buttons">
    <span class="edit-btn">✏️</span>
    <span class="delete-btn">🗑️</span>
  </div>
`;


  if (isChecked) {
    li.classList.add("completed");
  }

  listContainer.appendChild(li);

  const checkbox = li.querySelector("input[type='checkbox']");
  const taskSpan = li.querySelector("label span");
  const editBtn = li.querySelector(".edit-btn");
  const deleteBtn = li.querySelector(".delete-btn");

  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed", checkbox.checked);
    updateCounters();
    saveTasks();
  });

  editBtn.addEventListener("click", () => {
    const updatedText = prompt("Edit task:", taskSpan.textContent);
    if (updatedText !== null && updatedText.trim() !== "") {
      taskSpan.textContent = updatedText.trim();
      li.classList.remove("completed");
      checkbox.checked = false;
      updateCounters();
      saveTasks();
    }
  });

  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this task?")) {
      li.remove();
      updateCounters();
      saveTasks();
    }
  });

  updateCounters();
}

function updateCounters() {
  const completedTasks = document.querySelectorAll("#list-container .completed").length;
  const totalTasks = document.querySelectorAll("#list-container li").length;
  const uncompletedTasks = totalTasks - completedTasks;

  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = uncompletedTasks;
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#list-container li").forEach(li => {
    const taskText = li.querySelector("label span").textContent;
    const isChecked = li.querySelector("input[type='checkbox']").checked;
    tasks.push({ text: taskText, checked: isChecked });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => {
    addTaskToUI(task.text, task.checked);
  });
}
