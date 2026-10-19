
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskSummary = document.querySelector("#task-summary");

let tasks = JSON.parse(localStorage.getItem("pixel-tasks") || "[]");

function saveTasks() {
  localStorage.setItem("pixel-tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.replaceChildren();

  tasks.forEach(task => {
    const item = document.createElement("li");
    item.className = "task-item";

    if (task.completed) {
      item.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Complete task");

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const label = document.createElement("span");
    label.textContent = task.text;

    const removeButton = document.createElement("button");
    removeButton.className = "retro-button";
    removeButton.textContent = "×";
    removeButton.setAttribute("aria-label", "Delete task");

    removeButton.addEventListener("click", () => {
      tasks = tasks.filter(existing => existing.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, label, removeButton);
    taskList.append(item);
  });

  const remaining = tasks.filter(task => !task.completed).length;
  taskSummary.textContent = `${remaining} tasks remaining`;
}

export function initializeTaskManager() {
  taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
      id: crypto.randomUUID(),
      text,
      completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
  });

  renderTasks();
}
