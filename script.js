// StudyFlow - Dashboard functionality

let tasks = JSON.parse(localStorage.getItem("studyflowTasks")) || [];
let sessions = Number(localStorage.getItem("studyflowSessions")) || 0;

let timeLeft = 25 * 60;
let timerInterval = null;

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const completedCount = document.getElementById("completedCount");
const remainingCount = document.getElementById("remainingCount");
const sessionCount = document.getElementById("sessionCount");

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const notesInput = document.getElementById("notesInput");
const saveStatus = document.getElementById("saveStatus");

const themeBtn = document.getElementById("themeBtn");

// Save tasks
function saveTasks() {
    localStorage.setItem("studyflowTasks", JSON.stringify(tasks));
}

// Update dashboard statistics
function updateStats() {
    const completed = tasks.filter(task => task.completed).length;
    const remaining = tasks.length - completed;

    completedCount.textContent = completed;
    remainingCount.textContent = remaining;
    sessionCount.textContent = sessions;
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        if (task.completed) {
            taskText.style.textDecoration = "line-through";
            taskText.style.opacity = "0.5";
        }

        taskText.addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            displayTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        li.appendChild(taskText);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    updateStats();
}

// Add a task
addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
    displayTasks();
});

// Allow Enter key to add a task
taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTaskBtn.click();
    }
});

// Timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Start timer
startBtn.addEventListener("click", () => {
    if (timerInterval !== null) return;

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;

            sessions++;
            localStorage.setItem("studyflowSessions", sessions);
            updateStats();

            alert("Focus session complete! Great work!");
        }
    }, 1000);
});

// Pause timer
pauseBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

// Reset timer
resetBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

// Save notes
notesInput.value = localStorage.getItem("studyflowNotes") || "";

notesInput.addEventListener("input", () => {
    localStorage.setItem("studyflowNotes", notesInput.value);
    saveStatus.textContent = "Saved!";
});

// Dark mode
if (localStorage.getItem("studyflowTheme") === "dark") {
    document.body.classList.add("dark");
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("studyflowTheme", theme);
});

// Load everything when the page opens
displayTasks();
updateTimerDisplay();