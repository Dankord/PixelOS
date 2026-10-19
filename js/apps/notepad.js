
const noteContent = document.querySelector("#note-content");
const noteStatus = document.querySelector("#note-status");

export function initializeNotepad() {
  noteContent.value = localStorage.getItem("pixel-notes") || "";

  noteContent.addEventListener("input", () => {
    localStorage.setItem("pixel-notes", noteContent.value);
    noteStatus.textContent = "Changes saved automatically.";
  });

  document.querySelector("#save-note").addEventListener("click", () => {
    localStorage.setItem("pixel-notes", noteContent.value);
    noteStatus.textContent = "Saved successfully!";
  });

  document.querySelector("#clear-note").addEventListener("click", () => {
    if (!confirm("Clear your note?")) return;

    noteContent.value = "";
    localStorage.removeItem("pixel-notes");
    noteStatus.textContent = "Note cleared.";
  });
}
