/*
 * Material You NewTab
 * Copyright (c) 2023-2025 XengShi
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

// ------------------------Google App Menu-----------------------------------
const iconContainer = document.getElementById("iconContainer");
const googleAppsCont = document.getElementById("googleAppsCont");

// Toggle menu and tooltip visibility
googleAppsCont.addEventListener("click", function (event) {
    const isMenuVisible = iconContainer.style.display === "grid";

    // Toggle menu visibility
    iconContainer.style.display = isMenuVisible ? "none" : "grid";

    // Add or remove the class to hide the tooltip
    if (!isMenuVisible) {
        iconContainer.style.animation = "panelScaleIn 200ms cubic-bezier(0.4, 0, 0.2, 1) forwards";
        googleAppsCont.classList.add("menu-open"); // Hide tooltip
    } else {
        googleAppsCont.classList.remove("menu-open"); // Restore tooltip
    }

    event.stopPropagation();
});

// Close menu when clicking outside
document.addEventListener("click", function (event) {
    const isClickInside =
        iconContainer.contains(event.target) || googleAppsCont.contains(event.target);

    if (!isClickInside && iconContainer.style.display === "grid") {
        iconContainer.style.display = "none"; // Hide menu
        googleAppsCont.classList.remove("menu-open"); // Restore tooltip
    }
});
// ------------------------End of Google App Menu Setup-----------------------------------

// Save and load toggle state and initialize drag and drop rearrangeable favorites
document.addEventListener("DOMContentLoaded", function () {
    const googleAppsCont = document.getElementById("googleAppsCont");
    const googleAppsCheckbox = document.getElementById("googleAppsCheckbox");
    const iconContainer = document.getElementById("iconContainer");

    googleAppsCheckbox.addEventListener("change", function () {
        saveCheckboxState("googleAppsCheckboxState", googleAppsCheckbox);
        if (googleAppsCheckbox.checked) {
            googleAppsCont.style.display = "flex";
            saveDisplayStatus("googleAppsDisplayStatus", "flex");
        } else {
            googleAppsCont.style.display = "none";
            saveDisplayStatus("googleAppsDisplayStatus", "none");
        }
    });
    // Check if this is the first load
    const savedState = localStorage.getItem("googleAppsCheckboxState");
    if (savedState === null) {
        // Default to visible on first load
        googleAppsCheckbox.checked = true;
        localStorage.setItem("googleAppsCheckboxState", "checked");
        googleAppsCont.style.display = "flex";
        saveDisplayStatus("googleAppsDisplayStatus", "flex");
    } else {
        loadCheckboxState("googleAppsCheckboxState", googleAppsCheckbox);
        loadDisplayStatus("googleAppsDisplayStatus", googleAppsCont);
    }

    // Rearrange favorites via HTML5 Drag and Drop API
    const iconItems = iconContainer.querySelectorAll(".icon-item");

    iconItems.forEach(item => {
        item.setAttribute("draggable", "true");

        item.addEventListener("dragstart", () => {
            item.classList.add("dragging");
        });

        item.addEventListener("dragend", () => {
            item.classList.remove("dragging");
            saveFavoritesOrder();
        });
    });

    iconContainer.addEventListener("dragover", e => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        const afterElement = getDragAfterElement(iconContainer, e.clientY, e.clientX);
        if (afterElement == null) {
            iconContainer.appendChild(dragging);
        } else {
            iconContainer.insertBefore(dragging, afterElement);
        }
    });

    function getDragAfterElement(container, y, x) {
        const draggableElements = [...container.querySelectorAll(".icon-item:not(.dragging)")];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const centerX = box.left + box.width / 2;
            const centerY = box.top + box.height / 2;
            const distance = Math.hypot(x - centerX, y - centerY);

            if (distance < closest.distance) {
                return { distance: distance, element: child };
            } else {
                return closest;
            }
        }, { distance: Number.POSITIVE_INFINITY }).element;
    }

    function saveFavoritesOrder() {
        const order = [];
        const items = iconContainer.querySelectorAll(".icon-item");
        items.forEach(item => {
            order.push(item.getAttribute("href"));
        });
        localStorage.setItem("favoritesOrder", JSON.stringify(order));
    }

    function loadFavoritesOrder() {
        const order = JSON.parse(localStorage.getItem("favoritesOrder") || "null");
        if (!order) return;

        const itemsMap = new Map();
        const items = iconContainer.querySelectorAll(".icon-item");
        items.forEach(item => {
            itemsMap.set(item.getAttribute("href"), item);
        });

        const separator = iconContainer.querySelector(".separator");
        
        items.forEach(item => item.remove());
        if (separator) separator.remove();

        let appendedCount = 0;
        order.forEach(href => {
            const item = itemsMap.get(href);
            if (item) {
                if (appendedCount === 12 && separator) {
                    iconContainer.appendChild(separator);
                }
                iconContainer.appendChild(item);
                appendedCount++;
                itemsMap.delete(href);
            }
        });

        itemsMap.forEach(item => {
            if (appendedCount === 12 && separator) {
                iconContainer.appendChild(separator);
            }
            iconContainer.appendChild(item);
            appendedCount++;
        });
    }

    loadFavoritesOrder();
});