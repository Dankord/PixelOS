
const desktop = document.querySelector("#desktop");
const taskbarApps = document.querySelector("#taskbar-apps");

const windows = {
  notes: document.querySelector("#window-notes"),
  tasks: document.querySelector("#window-tasks")
};

let highestZIndex = 10;
const openApps = new Set();

function focusWindow(app) {
  const win = windows[app];
  if (!win) return;

  highestZIndex++;
  win.style.zIndex = highestZIndex;

  document.querySelectorAll(".taskbar-app").forEach(button => {
    button.classList.toggle("active", button.dataset.app === app);
  });
}

function renderTaskbar() {
  taskbarApps.replaceChildren();

  openApps.forEach(app => {
    const button = document.createElement("button");
    button.className = "retro-button taskbar-app";
    button.dataset.app = app;
    button.textContent = app === "notes" ? "📝 Notepad" : "📋 Tasks";

    button.addEventListener("click", () => {
      const win = windows[app];

      // A hidden taskbar app is minimized: restore it.
      if (win.style.display === "none") {
        win.style.display = "";
        focusWindow(app);
      } else {
        minimizeWindow(app);
      }
    });

    taskbarApps.append(button);
  });
}

export function openWindow(app) {
  const win = windows[app];
  if (!win) return;

  win.classList.remove("hidden");
  win.style.display = "";
  openApps.add(app);

  renderTaskbar();
  focusWindow(app);
}

export function closeWindow(app) {
  const win = windows[app];
  if (!win) return;

  win.classList.add("hidden");
  win.style.display = "none";
  openApps.delete(app);

  renderTaskbar();
}

export function minimizeWindow(app) {
  const win = windows[app];
  if (!win) return;

  win.style.display = "none";
  renderTaskbar();
}

export function initializeWindows() {
  document.querySelectorAll(".window").forEach(win => {
    const app = win.dataset.app;

    win.querySelector("[data-close]").addEventListener("click", () => {
      closeWindow(app);
    });

    win.querySelector("[data-minimize]").addEventListener("click", () => {
      minimizeWindow(app);
    });

    win.addEventListener("pointerdown", () => focusWindow(app));

    // Make each window draggable by its title bar.
    const bar = win.querySelector(".title-bar");

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    bar.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;
      if (event.target.closest("button")) return;

      dragging = true;
      focusWindow(app);

      startX = event.clientX;
      startY = event.clientY;
      initialLeft = win.offsetLeft;
      initialTop = win.offsetTop;

      bar.setPointerCapture(event.pointerId);
    });

    bar.addEventListener("pointermove", event => {
      if (!dragging) return;

      const maxLeft = desktop.clientWidth - win.offsetWidth;
      const maxTop = desktop.clientHeight - 32;

      const left = initialLeft + event.clientX - startX;
      const top = initialTop + event.clientY - startY;

      win.style.left = Math.max(0, Math.min(left, maxLeft)) + "px";
      win.style.top = Math.max(0, Math.min(top, maxTop)) + "px";
    });

    function stopDragging() {
      dragging = false;
    }

    bar.addEventListener("pointerup", stopDragging);
    bar.addEventListener("pointercancel", stopDragging);
  });
}
