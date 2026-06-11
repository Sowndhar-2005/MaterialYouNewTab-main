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
            
            // Parse markdown links [text](url) first
            const markdownLinks = [];
            const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|www\.[^\s)]+|[^\s)]+)\)/gi;
            let tempHtml = escapedTitle.replace(markdownLinkRegex, function(match, text, url) {
                let href = url.trim();
                if (!/^https?:\/\//i.test(href)) {
                    href = 'https://' + href;
                }
                const placeholder = `___MARKDOWN_LINK_${markdownLinks.length}___`;
                markdownLinks.push(`<a href="${href}" target="_blank" rel="noopener noreferrer" class="goals-link">${text}</a>`);
                return placeholder;
            });

            // Replace raw URLs with links
            const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
            tempHtml = tempHtml.replace(urlRegex, function(url) {
                let href = url;
                if (!/^https?:\/\//i.test(url)) {
                    href = 'https://' + url;
                }
                return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="goals-link">${url}</a>`;
            });

            // Restore markdown links
            let safeHtml = tempHtml;
            markdownLinks.forEach((linkHtml, index) => {
                safeHtml = safeHtml.replace(`___MARKDOWN_LINK_${index}___`, linkHtml);
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
        const currentTitle = goalsList[index].title;

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

    // + button opens the Manage Goals modal (which includes add)
    if (goalsAddBtn) {
        goalsAddBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            openManageGoalsModal();
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

    // --- Markdown Link Helper [text](url) ---
    function insertLinkTemplate(inputEl) {
        const start = inputEl.selectionStart;
        const end = inputEl.selectionEnd;
        const text = inputEl.value;
        const selectedText = text.substring(start, end);
        
        let replacement;
        let newCursorPos;
        
        if (selectedText) {
            replacement = `[${selectedText}](url)`;
            newCursorPos = start + selectedText.length + 3; // Put cursor at 'url'
        } else {
            replacement = "[]()";
            newCursorPos = start + 1; // Put cursor inside brackets: [|]
        }
        
        inputEl.value = text.substring(0, start) + replacement + text.substring(end);
        inputEl.focus();
        inputEl.setSelectionRange(newCursorPos, newCursorPos);
        if (selectedText) {
            // Select the word 'url' so they can type over it easily
            inputEl.setSelectionRange(newCursorPos - 3, newCursorPos);
        }
    }

    // --- Add Goal Modal Logic ---
    let addGoalOverlay = null;
    let addGoalInput = null;

    function setupAddGoalModal() {
        if (document.getElementById("addGoalModalOverlay")) return;

        addGoalOverlay = document.createElement("div");
        addGoalOverlay.id = "addGoalModalOverlay";
        addGoalOverlay.className = "goals-modal-overlay";

        addGoalOverlay.innerHTML = `
            <div class="goals-modal-box" id="addGoalModalBox">
                <div class="goals-modal-header">
                    <h2 class="goals-modal-title">Add Goal</h2>
                    <button class="goals-modal-close-btn" id="addGoalModalCloseBtn">&times;</button>
                </div>
                <div class="goals-modal-body" style="display: flex; flex-direction: column; gap: 8px;">
                    <div class="goals-modal-input-group" style="display: flex; gap: 8px; width: 100%;">
                        <input type="text" id="addGoalModalInput" placeholder="Enter your goal..." autocomplete="off" style="flex: 1;">
                        <button class="goals-link-helper-btn" id="addGoalLinkHelperBtn" title="Insert Link Template">🔗 Link</button>
                    </div>
                </div>
                <div class="goals-modal-footer">
                    <button class="prompt-modal-button prompt-modal-cancel" id="addGoalModalCancelBtn">Cancel</button>
                    <button class="prompt-modal-button prompt-modal-ok" id="addGoalModalSaveBtn">Add</button>
                </div>
            </div>
        `;

        document.body.appendChild(addGoalOverlay);

        addGoalInput = document.getElementById("addGoalModalInput");

        // Event: Close / Cancel
        document.getElementById("addGoalModalCloseBtn").addEventListener("click", closeAddGoalModal);
        document.getElementById("addGoalModalCancelBtn").addEventListener("click", closeAddGoalModal);

        // Event: Save
        document.getElementById("addGoalModalSaveBtn").addEventListener("click", saveGoalFromModal);
        addGoalInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                saveGoalFromModal();
            } else if (e.key === "Escape") {
                closeAddGoalModal();
            }
        });

        // Event: Link Helper
        document.getElementById("addGoalLinkHelperBtn").addEventListener("click", function () {
            insertLinkTemplate(addGoalInput);
        });

        // Event: Click outside
        addGoalOverlay.addEventListener("click", function (e) {
            if (e.target === addGoalOverlay) {
                closeAddGoalModal();
            }
        });
    }

    function openAddGoalModal() {
        setupAddGoalModal();
        addGoalOverlay.classList.add("show");
        addGoalInput.value = "";
        addGoalInput.focus();
    }

    function closeAddGoalModal() {
        if (addGoalOverlay) {
            addGoalOverlay.classList.remove("show");
        }
    }

    function saveGoalFromModal() {
        const text = addGoalInput.value.trim();
        if (!text) return;

        const newGoal = {
            id: "g" + Date.now(),
            title: text,
            completed: false
        };

        goalsList.push(newGoal);
        saveGoals();
        renderGoals();
        closeAddGoalModal();
    }

    // ----------------------- Manage Goals Modal Setup & Logic -----------------------------
    let modalOverlay = null;
    let modalList = null;
    let modalInput = null;

    function setupManageGoalsModal() {
        if (document.getElementById("goalsModalOverlay")) return;

        modalOverlay = document.createElement("div");
        modalOverlay.id = "goalsModalOverlay";
        modalOverlay.className = "goals-modal-overlay";

        modalOverlay.innerHTML = `
            <div class="goals-modal-box" id="goalsModalBox">
                <div class="goals-modal-header">
                    <h2 class="goals-modal-title">Manage Goals</h2>
                    <button class="goals-modal-close-btn" id="goalsModalCloseBtn">&times;</button>
                </div>
                <div class="goals-modal-add-section">
                    <div class="goals-modal-input-group" style="flex: 1; display: flex; gap: 8px;">
                        <input type="text" id="goalsModalInput" placeholder="Add new goal..." autocomplete="off" style="flex: 1;">
                        <button class="goals-link-helper-btn" id="goalsModalLinkHelperBtn" title="Insert Link Template">🔗 Link</button>
                    </div>
                    <button class="goals-modal-btn" id="goalsModalAddBtn">Add</button>
                </div>
                <ul class="goals-modal-list" id="goalsModalList"></ul>
                <div class="goals-modal-footer">
                    <button class="prompt-modal-button prompt-modal-ok" id="goalsModalDoneBtn">Done</button>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);

        modalList = document.getElementById("goalsModalList");
        modalInput = document.getElementById("goalsModalInput");

        // Event: Close modal on CloseBtn or DoneBtn
        document.getElementById("goalsModalCloseBtn").addEventListener("click", closeManageGoalsModal);
        document.getElementById("goalsModalDoneBtn").addEventListener("click", closeManageGoalsModal);

        // Event: Close modal when clicking outside the box
        modalOverlay.addEventListener("click", function (e) {
            if (e.target === modalOverlay) {
                closeManageGoalsModal();
            }
        });

        // Event: Add new goal inside modal
        document.getElementById("goalsModalAddBtn").addEventListener("click", addGoalFromModal);
        modalInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                addGoalFromModal();
            }
        });

        // Event: Link Helper in Manage Goals Modal
        document.getElementById("goalsModalLinkHelperBtn").addEventListener("click", function () {
            insertLinkTemplate(modalInput);
        });
    }

    function openManageGoalsModal() {
        setupManageGoalsModal();
        modalOverlay.classList.add("show");
        renderManageGoalsList();
        setTimeout(() => modalInput && modalInput.focus(), 50);
    }

    function closeManageGoalsModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove("show");
        }
    }

    function addGoalFromModal() {
        const text = modalInput.value.trim();
        if (!text) return;

        const newGoal = {
            id: "g" + Date.now(),
            title: text,
            completed: false
        };

        goalsList.push(newGoal);
        saveGoals();
        renderGoals();
        renderManageGoalsList();

        modalInput.value = "";
        modalList.scrollTop = modalList.scrollHeight; // Scroll to bottom
    }

    function renderManageGoalsList() {
        if (!modalList) return;
        modalList.innerHTML = "";

        if (goalsList.length === 0) {
            const emptyItem = document.createElement("div");
            emptyItem.style.textAlign = "center";
            emptyItem.style.padding = "20px";
            emptyItem.style.opacity = "0.6";
            emptyItem.textContent = "No goals set yet.";
            modalList.appendChild(emptyItem);
            return;
        }

        goalsList.forEach((goal, index) => {
            const li = document.createElement("li");
            li.className = "manage-goal-item";
            li.dataset.id = goal.id;
            li.setAttribute("draggable", "true");

            // Drag handle
            const dragHandle = document.createElement("div");
            dragHandle.className = "drag-handle";
            dragHandle.innerHTML = "☰";
            dragHandle.title = "Drag to reorder";

            // Title input field (seamless inline edit)
            const input = document.createElement("input");
            input.type = "text";
            input.className = "manage-goal-input";
            input.value = goal.title;
            
            // Edit title on change/blur
            input.addEventListener("change", function () {
                const newTitle = input.value.trim();
                if (newTitle) {
                    goal.title = newTitle;
                    saveGoals();
                    renderGoals();
                } else {
                    input.value = goal.title; // revert
                }
            });

            // Action buttons container
            const actions = document.createElement("div");
            actions.className = "manage-goal-actions";

            // Reorder Up
            const upBtn = document.createElement("button");
            upBtn.className = "reorder-btn";
            upBtn.innerHTML = "↑";
            upBtn.title = "Move Up";
            if (index === 0) {
                upBtn.disabled = true;
                upBtn.style.opacity = "0.2";
                upBtn.style.cursor = "not-allowed";
            } else {
                upBtn.addEventListener("click", function () {
                    swapGoals(index, index - 1);
                });
            }

            // Reorder Down
            const downBtn = document.createElement("button");
            downBtn.className = "reorder-btn";
            downBtn.innerHTML = "↓";
            downBtn.title = "Move Down";
            if (index === goalsList.length - 1) {
                downBtn.disabled = true;
                downBtn.style.opacity = "0.2";
                downBtn.style.cursor = "not-allowed";
            } else {
                downBtn.addEventListener("click", function () {
                    swapGoals(index, index + 1);
                });
            }

            // Delete Button
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-goal-btn";
            deleteBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            `;
            deleteBtn.title = "Delete Goal";
            deleteBtn.addEventListener("click", function () {
                goalsList.splice(index, 1);
                saveGoals();
                renderGoals();
                renderManageGoalsList();
            });

            actions.appendChild(upBtn);
            actions.appendChild(downBtn);
            actions.appendChild(deleteBtn);

            li.appendChild(dragHandle);
            li.appendChild(input);
            li.appendChild(actions);

            // Setup HTML5 Drag and Drop events
            setupDragAndDropEvents(li);

            modalList.appendChild(li);
        });
    }

    function swapGoals(idx1, idx2) {
        const temp = goalsList[idx1];
        goalsList[idx1] = goalsList[idx2];
        goalsList[idx2] = temp;
        saveGoals();
        renderGoals();
        renderManageGoalsList();
    }

    // --- HTML5 Drag & Drop Implementation ---
    let dragSrcEl = null;

    function setupDragAndDropEvents(el) {
        el.addEventListener("dragstart", function (e) {
            dragSrcEl = this;
            this.classList.add("dragging");
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", this.dataset.id);
        });

        el.addEventListener("dragover", function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = "move";

            // Visual insertion cue
            const rect = this.getBoundingClientRect();
            const relativeY = e.clientY - rect.top;
            if (relativeY < rect.height / 2) {
                this.classList.add("drag-over-top");
                this.classList.remove("drag-over-bottom");
            } else {
                this.classList.add("drag-over-bottom");
                this.classList.remove("drag-over-top");
            }
            return false;
        });

        el.addEventListener("dragleave", function () {
            this.classList.remove("drag-over-top", "drag-over-bottom");
        });

        el.addEventListener("dragend", function () {
            this.classList.remove("dragging");
            const items = modalList.querySelectorAll(".manage-goal-item");
            items.forEach(item => {
                item.classList.remove("drag-over-top", "drag-over-bottom");
            });
        });

        el.addEventListener("drop", function (e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }

            if (dragSrcEl && dragSrcEl !== this) {
                const sourceId = dragSrcEl.dataset.id;
                const targetId = this.dataset.id;

                const sourceIndex = goalsList.findIndex(g => g.id === sourceId);
                const targetIndex = goalsList.findIndex(g => g.id === targetId);

                if (sourceIndex !== -1 && targetIndex !== -1) {
                    const rect = this.getBoundingClientRect();
                    const relativeY = e.clientY - rect.top;

                    // Remove item from sourceIndex
                    const [movedItem] = goalsList.splice(sourceIndex, 1);

                    // Insert at targetIndex
                    let newIndex = targetIndex;
                    if (sourceIndex < targetIndex && relativeY < rect.height / 2) {
                        newIndex = targetIndex - 1;
                    } else if (sourceIndex > targetIndex && relativeY >= rect.height / 2) {
                        newIndex = targetIndex + 1;
                    }

                    goalsList.splice(newIndex, 0, movedItem);
                    saveGoals();
                    renderGoals();
                    renderManageGoalsList();
                }
            }
            return false;
        });
    }

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
