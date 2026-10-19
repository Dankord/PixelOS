
import {
  openWindow,
  initializeWindows
} from "./window-manager.js";

import { initializeNotepad } from "./apps/notepad.js";
import { initializeTaskManager } from "./apps/task-manager.js";

function initializeStartMenu() {
  const startButton = document.querySelector("#start-button");
  const startMenu = document.querySelector("#start-menu");

  startButton.addEventListener("click", () => {
    startMenu.classList.toggle("hidden");
  });

  document.querySelectorAll("[data-open]").forEach(button => {
    button.addEventListener("click", () => {
      openWindow(button.dataset.open);
      startMenu.classList.add("hidden");
    });
  });
}

function initializeClock() {
  const clock = document.querySelector("#clock");

  function updateClock() {
    clock.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  updateClock();
  setInterval(updateClock, 1000);
}

function main() {
  initializeWindows();
  initializeNotepad();
  initializeTaskManager();
  initializeStartMenu();
  initializeClock();
}

main();
