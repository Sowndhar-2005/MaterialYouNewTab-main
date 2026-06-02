/*
 * Material You NewTab - Goals Widget
 * Copyright (c) 2026 Prem
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 */

document.addEventListener("DOMContentLoaded", function () {
    const goalsWidget = document.getElementById("goalsWidget");
    const goalsWidgetList = document.getElementById("goalsWidgetList");
    const goalsProgressText = document.getElementById("goalsProgressText");
    const goalsProgressBar = document.getElementById("goalsProgressBar");
    const goalsBadge = null; // Badge removed - replaced by + icon button
    
    // Toggle/Checkbox DOM
    const goalsWidgetCheckbox = document.getElementById("goalsWidgetCheckbox");

    // Dropdown elements
    const goalsMoreBtn = document.getElementById("goalsMoreBtn");
    const goalsDropdown = document.getElementById("goalsDropdown");
    const clearCompletedGoalsAction = document.getElementById("clearCompletedGoalsAction");
    const resetGoalsAction = document.getElementById("resetGoalsAction");
    const goalsAddBtn = document.getElementById("goalsAddBtn");

    // Input elements
    const goalsInputContainer = document.getElementById("goalsInputContainer");
    const newGoalInput = document.getElementById("newGoalInput");
    const saveGoalBtn = document.getElementById("saveGoalBtn");

    let goalsList = [];

    // Helper to safely escape HTML strings
    function escapeHTML(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    const defaultGoals = [];

    // Load goals from local storage
    function loadGoals() {
        try {
            const stored = localStorage.getItem("goalsList");
            if (stored) {
                goalsList = JSON.parse(stored);
            } else {
                goalsList = [...defaultGoals];
                saveGoals();
            }
        } catch (e) {
            console.error("Error loading goals:", e);
            goalsList = [...defaultGoals];
        }
    }

    // Save goals to local storage
    function saveGoals() {
        localStorage.setItem("goalsList", JSON.stringify(goalsList));
    }

    // Render the goals widget list
    function renderGoals() {
        goalsWidgetList.innerHTML = "";

        if (goalsList.length === 0) {
            const emptyState = document.createElement("div");
            emptyState.className = "goals-empty-state";
            emptyState.textContent = "No goals set. Click + to add one!";
            goalsWidgetList.appendChild(emptyState);
            updateProgress(0, 0);
            return;
        }

        const fragment = document.createDocumentFragment();

        goalsList.forEach(goal => {
            const li = document.createElement("li");
            li.className = "goals-item" + (goal.completed ? " completed" : "");
            li.dataset.id = goal.id;

            // Checked SVG vs Unchecked outline
            const checkboxWrapper = document.createElement("div");
            checkboxWrapper.className = "goals-checkbox";
            
            if (goal.completed) {
                checkboxWrapper.innerHTML = `
                    <svg viewBox="0 0 24 24" class="goals-check-svg">
                        <circle cx="12" cy="12" r="10" class="goals-check-bg"></circle>
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" class="goals-check-mark"></path>
                    </svg>
                `;
            } else {
                checkboxWrapper.innerHTML = `
                    <svg viewBox="0 0 24 24" class="goals-uncheck-svg">
                        <circle cx="12" cy="12" r="10" class="goals-uncheck-circle"></circle>
                    </svg>
                `;
            }

            // Title
            const escapedTitle = escapeHTML(goal.title);
            const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
            const safeHtml = escapedTitle.replace(urlRegex, function(url) {
                let href = url;
                if (!/^https?:\/\//i.test(url)) {
                    href = 'https://' + url;
                }
                return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="goals-link">${url}</a>`;
            });

            const titleSpan = document.createElement("span");
            titleSpan.className = "goals-item-title";
            titleSpan.innerHTML = safeHtml;

            // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "goals-delete-btn";
            deleteBtn.innerHTML = "&times;";
            deleteBtn.title = "Delete Goal";

            li.appendChild(checkboxWrapper);
            li.appendChild(titleSpan);
            li.appendChild(deleteBtn);

            fragment.appendChild(li);
        });

        goalsWidgetList.appendChild(fragment);

        // Update progress metrics
        const total = goalsList.length;
        const completed = goalsList.filter(g => g.completed).length;
        updateProgress(completed, total);
    }

    // Update progress bar and text dynamically
    function updateProgress(completed, total) {
        goalsProgressText.textContent = `${completed} / ${total} completed`;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        goalsProgressBar.style.width = `${percentage}%`;
    }

    // Add a new goal
    function addNewGoal() {
        const text = newGoalInput.value.trim();
        if (!text) return;

        const newGoal = {
            id: "g" + Date.now(),
            title: text,
            completed: false
        };

        goalsList.push(newGoal);
        saveGoals();
        renderGoals();

        newGoalInput.value = "";
        goalsInputContainer.style.display = "none";
        if (goalsAddBtn) {
            goalsAddBtn.classList.remove("open");
        }

        // Scroll list to bottom so user sees newly added goal
        goalsWidgetList.scrollTop = goalsWidgetList.scrollHeight;
    }

    // Toggle goal completion state
    goalsWidgetList.addEventListener("click", function (e) {
        const item = e.target.closest(".goals-item");
        if (!item) return;

        // If clicking a link, do not toggle completed status
        if (e.target.tagName === "A" || e.target.closest("a")) {
            return;
        }

        const id = item.dataset.id;
        const index = goalsList.findIndex(g => g.id === id);
        if (index === -1) return;

        // If delete button is clicked
        if (e.target.classList.contains("goals-delete-btn")) {
            goalsList.splice(index, 1);
            saveGoals();
            renderGoals();
            return;
        }

        // Toggle completed status
        goalsList[index].completed = !goalsList[index].completed;
        saveGoals();
        renderGoals();
    });

    // Inline edit goal on double click
    goalsWidgetList.addEventListener("dblclick", function (e) {
        const item = e.target.closest(".goals-item");
        if (!item) return;

        const id = item.dataset.id;
        const index = goalsList.findIndex(g => g.id === id);
        if (index === -1) return;

        const titleSpan = item.querySelector(".goals-item-title");
        const currentTitle = titleSpan.textContent;

        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.className = "goals-edit-input";
        editInput.value = currentTitle;

        item.classList.add("editing");
        titleSpan.replaceWith(editInput);
        editInput.focus();

        function finishEdit() {
            const newTitle = editInput.value.trim();
            if (newTitle) {
                goalsList[index].title = newTitle;
                saveGoals();
            }
            item.classList.remove("editing");
            renderGoals();
        }

        editInput.addEventListener("blur", finishEdit);
        editInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                finishEdit();
            } else if (event.key === "Escape") {
                renderGoals();
            }
        });
    });

    // Dropdown actions toggle
    goalsMoreBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        goalsDropdown.classList.toggle("show");
    });

    document.addEventListener("click", function () {
        goalsDropdown.classList.remove("show");
    });

    // + button opens the input field
    if (goalsAddBtn) {
        goalsAddBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            const isVisible = goalsInputContainer.style.display === "flex";
            goalsInputContainer.style.display = isVisible ? "none" : "flex";
            goalsAddBtn.classList.toggle("open", !isVisible);
            if (!isVisible) {
                newGoalInput.focus();
            }
        });
    }

    clearCompletedGoalsAction.addEventListener("click", function () {
        goalsList = goalsList.filter(g => !g.completed);
        saveGoals();
        renderGoals();
    });

    resetGoalsAction.addEventListener("click", function () {
        if (confirm("Reset goals to defaults?")) {
            goalsList = [...defaultGoals];
            saveGoals();
            renderGoals();
        }
    });

    saveGoalBtn.addEventListener("click", addNewGoal);
    newGoalInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            addNewGoal();
        }
    });

    // ----------------------- Goals Widget Visibility Toggle -----------------------------
    if (goalsWidgetCheckbox) {
        goalsWidgetCheckbox.addEventListener("change", function () {
            saveCheckboxState("goalsWidgetCheckboxState", goalsWidgetCheckbox);
            if (goalsWidgetCheckbox.checked) {
                goalsWidget.style.display = "flex";
                saveDisplayStatus("goalsWidgetDisplayStatus", "flex");
            } else {
                goalsWidget.style.display = "none";
                saveDisplayStatus("goalsWidgetDisplayStatus", "none");
            }
        });

        // Initialize state
        const savedState = localStorage.getItem("goalsWidgetCheckboxState");
        if (savedState === null) {
            // Default to visible on first load
            goalsWidgetCheckbox.checked = true;
            localStorage.setItem("goalsWidgetCheckboxState", "checked");
            goalsWidget.style.display = "flex";
            saveDisplayStatus("goalsWidgetDisplayStatus", "flex");
        } else {
            loadCheckboxState("goalsWidgetCheckboxState", goalsWidgetCheckbox);
            loadDisplayStatus("goalsWidgetDisplayStatus", goalsWidget);
        }
    } else {
        // Fallback if checkbox doesn't exist yet
        goalsWidget.style.display = "flex";
    }

    // Initialize Widget
    loadGoals();
    renderGoals();
});
