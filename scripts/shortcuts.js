/*
 * Material You New Tab
 * Copyright (c) 2024-2026 Prem, 2023-2025 XengShi
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 */

document.addEventListener("DOMContentLoaded", function () {
    // Current Language
    const currentLanguage = localStorage.getItem("selectedLanguage") || "en";

    // Constants
    const MAX_SHORTCUTS = 50;
    const PLACEHOLDER = {
        get name() { return translations[currentLanguage]?.shortcutDefaultName || translations["en"].shortcutDefaultName; },
        url: "https://github.com/prem-k-r/MaterialYouNewTab",
        get inputName() { return translations[currentLanguage]?.shortcutInputName || translations["en"].shortcutInputName; },
        get inputUrl() { return translations[currentLanguage]?.shortcutInputUrl || translations["en"].shortcutInputUrl; },
        get inputIcon() { return translations[currentLanguage]?.shortcutInputIcon || translations["en"].shortcutInputIcon; },
    };

    // DOM Elements
    const dom = {
        shortcuts: document.getElementById("shortcuts-section"),
        shortcutsCheckbox: document.getElementById("shortcutsCheckbox"),
        shortcutEditField: document.getElementById("shortcutEditField"),
        adaptiveIconField: document.getElementById("adaptiveIconField"),
        adaptiveIconToggle: document.getElementById("adaptiveIconToggle"),
        shortcutSettingsContainer: document.getElementById("shortcutList"),
        shortcutsContainer: document.getElementById("shortcutsContainer"),
        newShortcutButton: document.getElementById("newShortcutButton"),
        resetShortcutsButton: document.getElementById("resetButton"),

        // Folders DOM Elements
        shortcutsTabBtn: document.getElementById("shortcutsTabBtn"),
        foldersTabBtn: document.getElementById("foldersTabBtn"),
        shortcutsSettingsView: document.getElementById("shortcutsSettingsView"),
        foldersSettingsView: document.getElementById("foldersSettingsView"),
        folderList: document.getElementById("folderList"),
        addFolderBtn: document.getElementById("addFolderBtn"),
        folderDetailsView: document.getElementById("folderDetailsView"),
        folderDetailsBackBtn: document.getElementById("folderDetailsBackBtn"),
        folderDetailsTitle: document.getElementById("folderDetailsTitle"),
        folderNameInput: document.getElementById("folderNameInput"),
        folderWebsitesList: document.getElementById("folderWebsitesList"),
        addWebsiteBtn: document.getElementById("addWebsiteBtn"),
        websiteForm: document.getElementById("websiteForm"),
        websiteFormTitle: document.getElementById("websiteFormTitle"),
        webNameInput: document.getElementById("webNameInput"),
        webUrlInput: document.getElementById("webUrlInput"),
        webIconInput: document.getElementById("webIconInput"),
        saveWebsiteBtn: document.getElementById("saveWebsiteBtn"),
        cancelWebsiteBtn: document.getElementById("cancelWebsiteBtn"),
    };

    // Preset Data
    const presets = [
        {
            name: "YouTube",
            url: "youtube.com",
            domains: ["youtube.com", "m.youtube.com", "youtu.be"],
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" class="accentColor shortcutDarkColor"/><g style="transform: scale(0.6); transform-origin: center;"><path class="bgLightTint" id="darkLightTint" fill-rule="evenodd"
                    d="M23.498 6.186a3.02 3.02 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.02 3.02 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.02 3.02 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.02 3.02 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814M9.545 15.568V8.432L15.818 12z"/></g></svg>`
        },
        {
            name: "Gmail",
            url: "mail.google.com",
            domains: ["gmail.com", "mail.google.com"],
            svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" class="accentColor shortcutDarkColor"/><g style="transform: scale(0.58); transform-origin: center;"><path class="bgLightTint" id="darkLightTint" 
                    d="m8.606 13.6 3.396 2.323 3.274-2.259 7.338 7.24q-.29.095-.614.096H2c-.264 0-.516-.052-.747-.144zM24 7.652V19a2 2 0 0 1-.18.83l-7.193-7.097zM0 7.715l7.25 4.958-7.123 7.03A2.04 2.04 0 0 1 0 19ZM22 3a2 2 0 0 1 2 2v.704l-12.002 8.274L0 5.772V5a2 2 0 0 1 2-2Z"/></g></svg>`
        },
        {
            name: "Telegram",
            url: "web.telegram.org",
            domains: ["telegram.org", "t.me", "web.telegram.org"],
            svg: `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path class="accentColor shortcutDarkColor"
                    d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0Zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38Z"/></svg>`
        },
        {
            name: "WhatsApp",
            url: "web.whatsapp.com",
            domains: ["whatsapp.com", "web.whatsapp.com", "api.whatsapp.com"],
            svg: `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path class="accentColor shortcutDarkColor"
                    d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.953 9.953 0 0 1-5.03-1.355L.004 20l1.352-4.968A9.953 9.953 0 0 1 0 10C0 4.477 4.477 0 10 0ZM6.592 5.3l-.2.008a.961.961 0 0 0-.372.1 1.293 1.293 0 0 0-.294.228c-.12.113-.188.211-.261.306a2.73 2.73 0 0 0-.566 1.678c.002.49.13.967.33 1.413.409.902 1.082 1.857 1.97 2.742.214.213.424.427.65.626a9.448 9.448 0 0 0 3.84 2.046l.568.087c.185.01.37-.004.556-.013a1.99 1.99 0 0 0 .833-.231c.131-.067.259-.14.383-.22 0 0 .043-.028.125-.09.135-.1.218-.171.33-.288.083-.086.155-.187.21-.302.078-.163.156-.474.188-.733.024-.198.017-.306.014-.373-.004-.107-.093-.218-.19-.265l-.582-.261s-.87-.379-1.402-.621a.497.497 0 0 0-.176-.041.482.482 0 0 0-.378.127c-.005-.002-.072.055-.795.931a.35.35 0 0 1-.368.13 1.432 1.432 0 0 1-.191-.066c-.124-.052-.167-.072-.252-.108a6.028 6.028 0 0 1-1.575-1.003c-.126-.11-.243-.23-.363-.346a6.298 6.298 0 0 1-1.02-1.268l-.059-.095a.923.923 0 0 1-.102-.205c-.038-.147.061-.265.061-.265s.243-.266.356-.41c.11-.14.203-.276.263-.373.118-.19.155-.385.093-.536-.28-.684-.57-1.365-.868-2.041-.059-.134-.234-.23-.393-.249a4.439 4.439 0 0 0-.162-.016 3.385 3.385 0 0 0-.403.004l.201-.008.001.001Z"/></svg>`
        },
        {
            name: "Twitter",
            url: "x.com",
            domains: ["twitter.com", "x.com"],
            svg: `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path class="accentColor shortcutDarkColor"
                    d="M10 0c5.529 0 10 4.471 10 10s-4.471 10-10 10S0 15.529 0 10 4.471 0 10 0ZM8.171 15.271c4.429 0 6.858-3.671 6.858-6.857V8.1a4.783 4.783 0 0 0 1.2-1.257c-.429.186-.9.314-1.386.386.5-.3.886-.772 1.057-1.329a5.215 5.215 0 0 1-1.529.586 2.405 2.405 0 0 0-1.757-.757A2.42 2.42 0 0 0 10.2 8.143c0 .186.014.371.071.543-2-.1-3.785-1.057-4.971-2.515-.2.358-.329.772-.329 1.215 0 .828.429 1.571 1.072 2-.4 0-.772-.115-1.086-.3v.028c0 1.172.829 2.143 1.929 2.372a2.3 2.3 0 0 1-.629.085c-.157 0-.3-.014-.457-.042.3.957 1.2 1.657 2.243 1.671a4.883 4.883 0 0 1-3 1.029c-.2 0-.386 0-.572-.029a6.765 6.765 0 0 0 3.686 1.086"/></svg>`
        },
        {
            name: "Discord",
            url: "discord.com/app",
            domains: ["discord.com", "discord.gg", "discordapp.com"],
            svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" class="accentColor shortcutDarkColor"/><g style="transform: scale(0.75); transform-origin: center;"><path class="bgLightTint" id="darkLightTint"
                    d="M19.303 5.337A17.3 17.3 0 0 0 14.963 4c-.191.329-.403.775-.552 1.125a16.6 16.6 0 0 0-4.808 0C9.454 4.775 9.23 4.329 9.05 4a17 17 0 0 0-4.342 1.337C1.961 9.391 1.218 13.35 1.59 17.255a17.7 17.7 0 0 0 5.318 2.664 13 13 0 0 0 1.136-1.836c-.627-.234-1.22-.52-1.794-.86.149-.106.297-.223.435-.34 3.46 1.582 7.207 1.582 10.624 0 .149.117.287.234.435.34-.573.34-1.167.626-1.793.86a13 13 0 0 0 1.135 1.836 17.6 17.6 0 0 0 5.318-2.664c.457-4.52-.722-8.448-3.1-11.918M8.52 14.846c-1.04 0-1.889-.945-1.889-2.101s.828-2.102 1.89-2.102c1.05 0 1.91.945 1.888 2.102 0 1.156-.838 2.1-1.889 2.1m6.974 0c-1.04 0-1.89-.945-1.89-2.101s.828-2.102 1.89-2.102c1.05 0 1.91.945 1.889 2.102 0 1.156-.828 2.1-1.89 2.1"/></g></svg>`
        }
    ];

    const defaultFolders = [];

    // Caches
    let shortcutsCache = [];
    let foldersCache = [];
    let selectedFolderId = null;
    let selectedWebsiteIndex = null;

    // Initialization
    loadSettings();
    initFoldersData();
    loadShortcuts();
    setupEventListeners();
    setupFolderEventListeners();
    setupFolderDragAndDrop();
    setupWebsitesDragAndDrop();

    // Determine initial tab view
    const initialTab = localStorage.getItem("activeShortcutTab") || "shortcuts";
    switchTab(initialTab);

    // Loads all settings from localStorage and applies them
    function loadSettings() {
        loadCheckboxState("shortcutsCheckboxState", dom.shortcutsCheckbox);
        loadCheckboxState("adaptiveIconToggle", dom.adaptiveIconToggle);
        loadActiveStatus("shortcutEditField", dom.shortcutEditField);
        loadActiveStatus("adaptiveIconField", dom.adaptiveIconField);
        loadDisplayStatus("shortcutsDisplayStatus", dom.shortcuts);

        if (dom.adaptiveIconToggle.checked) {
            dom.shortcutsContainer.classList.add("adaptive-icons");
        } else {
            dom.shortcutsContainer.classList.remove("adaptive-icons");
        }
    }

    // Initialize Folder Data structure
    function initFoldersData() {
        const stored = localStorage.getItem("shortcutFolders");
        if (stored) {
            try {
                foldersCache = JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse folders, using presets:", e);
                foldersCache = [...defaultFolders];
                saveFoldersToStorage();
            }
        } else {
            foldersCache = [...defaultFolders];
            saveFoldersToStorage();
        }
    }

    function saveFoldersToStorage() {
        localStorage.setItem("shortcutFolders", JSON.stringify(foldersCache));
        renderAllDockItems();
    }

    // Sets up all event listeners
    function setupEventListeners() {
        dom.shortcutsCheckbox.addEventListener("change", handleShortcutsToggle);
        dom.adaptiveIconToggle.addEventListener("change", handleAdaptiveIconToggle);
        dom.newShortcutButton.addEventListener("click", handleNewShortcutClick);
        dom.resetShortcutsButton.addEventListener("click", resetShortcuts);
    }

    // Tab Toggle logic (Shortcuts vs Folders)
    function switchTab(tab) {
        localStorage.setItem("activeShortcutTab", tab);
        if (tab === "shortcuts") {
            dom.shortcutsTabBtn.classList.add("active");
            dom.foldersTabBtn.classList.remove("active");
            dom.shortcutsSettingsView.style.display = "block";
            dom.foldersSettingsView.style.display = "none";

            // Show new shortcut button for Shortcuts view
            dom.newShortcutButton.style.display = "flex";
            dom.resetShortcutsButton.style.display = "flex";

            loadShortcuts();
        } else {
            dom.shortcutsTabBtn.classList.remove("active");
            dom.foldersTabBtn.classList.add("active");
            dom.shortcutsSettingsView.style.display = "none";
            dom.foldersSettingsView.style.display = "block";

            // Hide traditional toolbar items in Folders tab
            dom.newShortcutButton.style.display = "none";
            dom.resetShortcutsButton.style.display = "none";

            renderFolderSettingsList();
            renderAllDockItems();
        }
    }

    function setupFolderEventListeners() {
        dom.shortcutsTabBtn.addEventListener("click", () => switchTab("shortcuts"));
        dom.foldersTabBtn.addEventListener("click", () => switchTab("folders"));

        // Back to folder list
        dom.folderDetailsBackBtn.addEventListener("click", () => {
            dom.folderDetailsView.style.display = "none";
            dom.folderList.style.display = "block";
            dom.addFolderBtn.style.display = "flex";
            renderFolderSettingsList();
            renderFoldersDock();
        });

        // Add Folder Btn click
        dom.addFolderBtn.addEventListener("click", () => {
            const colors = ["blue", "red", "green", "orange", "purple", "cyan"];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const newFolder = {
                id: "f_" + Date.now(),
                name: "New Workspace",
                icon: "📁",
                color: randomColor,
                websites: []
            };
            foldersCache.push(newFolder);
            saveFoldersToStorage();
            openSidebarToFolder(newFolder.id);
        });

        // Sync name inputs
        dom.folderNameInput.addEventListener("input", () => {
            if (!selectedFolderId) return;
            const folder = foldersCache.find(f => f.id === selectedFolderId);
            if (folder) {
                folder.name = dom.folderNameInput.value.trim() || "New Workspace";
                saveFoldersToStorage();
            }
        });

        // Set up presets colors
        dom.folderDetailsView.querySelectorAll(".color-preset").forEach(preset => {
            preset.addEventListener("click", () => {
                if (!selectedFolderId) return;
                const color = preset.getAttribute("data-color");
                const folder = foldersCache.find(f => f.id === selectedFolderId);
                if (folder) {
                    folder.color = color;
                    saveFoldersToStorage();

                    // Mark active preset color
                    dom.folderDetailsView.querySelectorAll(".color-preset").forEach(p => p.classList.remove("active"));
                    preset.classList.add("active");
                }
            });
        });

        // Add website within details view
        dom.addWebsiteBtn.addEventListener("click", () => {
            selectedWebsiteIndex = null;
            dom.websiteFormTitle.textContent = "Add Website";
            dom.webNameInput.value = "";
            dom.webUrlInput.value = "";
            dom.webIconInput.value = "";
            dom.websiteForm.style.display = "block";
            dom.webNameInput.focus();
        });

        // Cancel website add/edit
        dom.cancelWebsiteBtn.addEventListener("click", () => {
            dom.websiteForm.style.display = "none";
        });

        // Save website logic
        dom.saveWebsiteBtn.addEventListener("click", () => {
            if (!selectedFolderId) return;
            const folder = foldersCache.find(f => f.id === selectedFolderId);
            if (!folder) return;

            const name = dom.webNameInput.value.trim();
            const url = dom.webUrlInput.value.trim();
            const icon = dom.webIconInput.value.trim();

            if (!name || !url) return;

            if (selectedWebsiteIndex === null) {
                // Add new website
                folder.websites.push({ name, url, icon });
            } else {
                // Edit existing website
                folder.websites[selectedWebsiteIndex] = { name, url, icon };
            }

            saveFoldersToStorage();
            dom.websiteForm.style.display = "none";
            renderFolderWebsitesEditor(folder);
        });
    }

    // Opens Sidebar directly to edit details of a specific folder
    function openSidebarToFolder(folderId, showAddWebsiteForm = false) {
        selectedFolderId = folderId;
        const folder = foldersCache.find(f => f.id === folderId);
        if (!folder) return;

        // Reset display
        dom.folderList.style.display = "none";
        dom.addFolderBtn.style.display = "none";
        dom.folderDetailsView.style.display = "block";
        dom.websiteForm.style.display = "none";

        // Populate fields
        dom.folderNameInput.value = folder.name;

        // Set active color preset
        dom.folderDetailsView.querySelectorAll(".color-preset").forEach(p => {
            p.classList.remove("active");
            if (p.getAttribute("data-color") === folder.color) {
                p.classList.add("active");
            }
        });

        // Render Websites Editor list inside details
        renderFolderWebsitesEditor(folder);

        // Open settings panel if closed
        if (typeof openMenuBar === "function") {
            openMenuBar();
            const editBtn = document.getElementById("shortcutEditButton");
            if (editBtn) {
                editBtn.click();
            }
            setTimeout(() => {
                // Toggle tab inside sidebar to folders
                switchTab("folders");
            }, 100);
        }

        // Show add website modal form inside details immediately if requested
        if (showAddWebsiteForm) {
            setTimeout(() => {
                dom.addWebsiteBtn.click();
            }, 300);
        }
    }

    // Renders the list of websites inside the expanded folder settings details view
    function renderFolderWebsitesEditor(folder) {
        dom.folderWebsitesList.innerHTML = "";

        if (folder.websites.length === 0) {
            const empty = document.createElement("div");
            empty.style.padding = "10px";
            empty.style.fontSize = "0.85rem";
            empty.style.opacity = "0.6";
            empty.style.textAlign = "center";
            empty.textContent = "No websites added yet. Click + Add Website!";
            dom.folderWebsitesList.appendChild(empty);
            return;
        }

        folder.websites.forEach((web, index) => {
            const entry = document.createElement("div");
            entry.className = "folder-websites-entry";
            entry.draggable = true;
            entry._index = index;
            entry.innerHTML = `
                <div class="web-drag-handle">⋮⋮</div>
                <div class="web-name-info">
                    <span class="name">${escapeHtml(web.name)}</span>
                    <span class="url">${escapeHtml(web.url)}</span>
                </div>
                <div class="web-actions">
                    <button class="edit-web-btn" title="Edit Website">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                        </svg>
                    </button>
                    <button class="delete-web-btn" title="Delete Website">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;

            // Edit Btn
            entry.querySelector(".edit-web-btn").addEventListener("click", () => {
                selectedWebsiteIndex = index;
                dom.websiteFormTitle.textContent = "Edit Website";
                dom.webNameInput.value = web.name;
                dom.webUrlInput.value = web.url;
                dom.webIconInput.value = web.icon || "";
                dom.websiteForm.style.display = "block";
                dom.webNameInput.focus();
            });

            // Delete Btn
            entry.querySelector(".delete-web-btn").addEventListener("click", () => {
                if (confirm(`Remove ${web.name}?`)) {
                    folder.websites.splice(index, 1);
                    saveFoldersToStorage();
                    renderFolderWebsitesEditor(folder);
                }
            });

            dom.folderWebsitesList.appendChild(entry);
        });
    }

    // Renders the folders list inside the sidebar settings view
    function renderFolderSettingsList() {
        dom.folderList.innerHTML = "";

        if (foldersCache.length === 0) {
            const empty = document.createElement("div");
            empty.style.padding = "20px";
            empty.style.fontSize = "0.95rem";
            empty.style.opacity = "0.6";
            empty.style.textAlign = "center";
            empty.textContent = "No workspaces found. Click + Add Folder to start!";
            dom.folderList.appendChild(empty);
            return;
        }

        foldersCache.forEach((folder) => {
            const entry = document.createElement("div");
            entry.className = "folder-settings-entry";
            entry.draggable = true;
            entry._folderId = folder.id;
            entry.innerHTML = `
                <div class="grip-container">⋮⋮</div>
                <div class="folder-name-container">
                    <span class="name">${escapeHtml(folder.name)}</span>
                    <span class="count">${folder.websites.length} websites</span>
                </div>
                <div class="arrow-btn">➔</div>
                <button class="delete-folder-btn" title="Delete Folder" style="background: transparent; border: none; cursor: pointer; color: #f44336; margin-left: 8px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;

            // Open Detail View when clicked (except for delete button)
            entry.addEventListener("click", (e) => {
                if (e.target.closest(".delete-folder-btn") || e.target.closest(".grip-container")) {
                    return;
                }
                openSidebarToFolder(folder.id);
            });

            // Delete Folder Btn click
            entry.querySelector(".delete-folder-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete the "${folder.name}" workspace? This removes all websites inside it!`)) {
                    const idx = foldersCache.findIndex(f => f.id === folder.id);
                    if (idx !== -1) {
                        foldersCache.splice(idx, 1);
                        saveFoldersToStorage();
                        renderFolderSettingsList();
                        renderFoldersDock();
                    }
                }
            });

            dom.folderList.appendChild(entry);
        });
    }

    // Renders the main Workspace Folders row at the bottom dock (delegates to combined renderer)
    function renderFoldersDock() {
        renderAllDockItems();
    }

    function getColorHex(colorName) {
        const mappings = {
            blue: "var(--accentColor-blue, #3569B2)",
            red: "#f44336",
            green: "#4caf50",
            orange: "#ff9800",
            purple: "#9c27b0",
            cyan: "#00bcd4"
        };
        return mappings[colorName] || "var(--accentColor-blue, #3569B2)";
    }

    // Displays the floating folder popup panel directly above the folder card in the dock
    function showFolderPopup(folder, folderCard) {
        // Clear any previous popups
        document.querySelectorAll(".folder-popup-panel").forEach(p => p.remove());

        const popup = document.createElement("div");
        popup.className = "folder-popup-panel";

        // Render header (Title on left, Open All pill button on right)
        const header = document.createElement("div");
        header.className = "popup-header";

        const title = document.createElement("span");
        title.className = "popup-title";
        title.innerHTML = `${escapeHtml(folder.name)}`;

        const openAllBtn = document.createElement("button");
        openAllBtn.className = "popup-open-all-btn";
        openAllBtn.title = "Open All";
        openAllBtn.innerHTML = `
            <span>Open All</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
        `;
        openAllBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (folder.websites.length === 0) return;
            if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.create) {
                folder.websites.forEach((web, i) => {
                    chrome.tabs.create({ url: normalizeUrl(web.url), active: i === 0 });
                });
            } else {
                folder.websites.forEach((web, i) => {
                    if (i === 0) {
                        window.open(normalizeUrl(web.url), "_blank");
                    } else {
                        setTimeout(() => {
                            window.open(normalizeUrl(web.url), "_blank");
                        }, i * 100);
                    }
                });
            }
        });

        header.appendChild(title);
        header.appendChild(openAllBtn);

        // Websites List (Grid layout)
        const list = document.createElement("div");
        list.className = "popup-website-list";

        if (folder.websites.length === 0) {
            const empty = document.createElement("div");
            empty.style.padding = "16px";
            empty.style.fontSize = "0.85rem";
            empty.style.opacity = "0.6";
            empty.style.textAlign = "center";
            empty.style.gridColumn = "1 / span 2";
            empty.textContent = "No websites added";
            list.appendChild(empty);
        } else {
            folder.websites.forEach(web => {
                const item = document.createElement("a");
                item.className = "popup-website-item";
                item.href = normalizeUrl(web.url);
                item.target = "_self";
                item.rel = "noopener noreferrer";

                const iconContainer = document.createElement("div");
                iconContainer.className = "popup-website-icon";
                const logo = getLogoHtml(web.name, normalizeUrl(web.url), web.icon);
                if (logo) iconContainer.appendChild(logo);

                const nameSpan = document.createElement("span");
                nameSpan.className = "popup-website-name";
                nameSpan.textContent = web.name;

                item.appendChild(iconContainer);
                item.appendChild(nameSpan);
                list.appendChild(item);
            });
        }

        popup.appendChild(header);
        popup.appendChild(list);

        document.body.appendChild(popup);

        // Position popup centered above folderCard
        const rect = folderCard.getBoundingClientRect();
        popup.style.bottom = `${window.innerHeight - rect.top + 12}px`;
        popup.style.left = `${rect.left + rect.width / 2}px`;

        // Smooth transition trigger
        requestAnimationFrame(() => {
            popup.classList.add("show");
        });

        // Close on outside click listener
        const closeHandler = (e) => {
            if (!popup.contains(e.target) && !folderCard.contains(e.target)) {
                popup.classList.remove("show");
                setTimeout(() => popup.remove(), 200);
                document.removeEventListener("click", closeHandler);
            }
        };
        setTimeout(() => {
            document.addEventListener("click", closeHandler);
        }, 10);
    }

    // Handles the new shortcut button click with animation and focus
    let focusTimeoutId;
    function handleNewShortcutClick() {
        if (this.classList.contains("inactive")) return;

        const storedAmount = localStorage.getItem("shortcutAmount");
        const currentAmount = (storedAmount !== null) ? parseInt(storedAmount) : shortcutsCache.length;
        if (currentAmount >= MAX_SHORTCUTS) return;

        addNewShortcut();

        const allEntries = document.querySelectorAll(".shortcutSettingsEntry");
        const lastEntry = allEntries[allEntries.length - 1];
        const urlInput = lastEntry.querySelector("input.URL");

        urlInput.scrollIntoView({ behavior: "smooth", block: "center" });

        clearTimeout(focusTimeoutId);
        const modalContainer = document.getElementById("prompt-modal-container");
        focusTimeoutId = setTimeout(() => {
            if (modalContainer?.style.display !== "flex")
                urlInput.focus();
        }, 800);
    }

    // Loads shortcuts from localStorage or uses presets if none exist
    function loadShortcuts() {
        const storedAmount = localStorage.getItem("shortcutAmount");
        const amount = (storedAmount !== null) ? parseInt(storedAmount) : presets.length;
        const deleteInactive = amount <= 0;

        shortcutsCache = [];
        dom.shortcutSettingsContainer.innerHTML = "";

        for (let i = 0; i < amount; i++) {
            const name = localStorage.getItem(`shortcutName${i}`) || (presets[i] ? presets[i].name : PLACEHOLDER.name);
            const url = localStorage.getItem(`shortcutURL${i}`) || (presets[i] ? presets[i].url : PLACEHOLDER.url);
            const icon = localStorage.getItem(`shortcutIcon${i}`) || "";

            shortcutsCache.push({ name, url, icon });

            const entry = createShortcutEntry(name, url, icon, deleteInactive, i);
            dom.shortcutSettingsContainer.appendChild(entry);
        }

        // Render all dock items once (shortcuts + folders together)
        renderAllDockItems();

        if (amount >= MAX_SHORTCUTS) {
            dom.newShortcutButton.classList.add("inactive");
        }

        setupDragAndDrop();
    }

    // Creates a shortcut entry element for the settings panel
    function createShortcutEntry(name, url, iconUrl, deleteInactive, index) {
        const entry = document.createElement("div");
        entry.className = "shortcutSettingsEntry";
        entry.draggable = true;
        entry._index = index;

        entry.innerHTML = `
            <div class="grip-container" draggable="true">
                <svg stroke="currentColor" width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                    <circle cy="2" cx="5.5" r=".75"/>
                    <circle cy="8" cx="5.5" r=".75"/>
                    <circle cy="14" cx="5.5" r=".75"/>
                    <circle cy="2" cx="10.5" r=".75"/>
                    <circle cy="8" cx="10.5" r=".75"/>
                    <circle cy="14" cx="10.5" r=".75"/>
                </svg>
            </div>
            <div class="shortcutInputGroup">
                <input class="shortcutName" placeholder="${PLACEHOLDER.inputName}" value="${escapeHtml(name)}">
                <div class="shortcutInputRow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39"/></svg>
                    <input class="URL" placeholder="${PLACEHOLDER.inputUrl}" value="${escapeHtml(url)}">
                </div>
                <div class="shortcutInputRow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2M8.5 13.5l2.5 3.01L14.5 12l4.5 6H5z"/></svg>
                    <input class="iconURL" placeholder="${PLACEHOLDER.inputIcon}" value="${escapeHtml(iconUrl || "")}">
                </div>
            </div>
            <div class="shortcutActions">
                <button type="button" class="uploadCustomIconButton">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M12 3.5a.89.89 0 0 0-.641.27l-3.57 3.571a.895.895 0 0 0 1.265 1.265l2.051-2.051v8.577a.895.895 0 1 0 1.79 0V6.555l2.051 2.051a.895.895 0 0 0 1.266-1.265l-3.57-3.57A.91.91 0 0 0 12 3.5m-6.263 9.842c-.494 0-.895.4-.895.895v3.579A2.7 2.7 0 0 0 7.526 20.5h8.948a2.7 2.7 0 0 0 2.684-2.684v-3.58a.895.895 0 1 0-1.79 0v3.58c0 .505-.39.895-.894.895H7.526a.88.88 0 0 1-.894-.895v-3.58c0-.493-.401-.894-.895-.894"/>
                    </svg>
                </button>
                <input type="file" class="iconFileInput" accept="image/*" hidden>
                <div class="shortcutDelete">
                    <button class="${deleteInactive ? 'inactive' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                            <path d="M7.8 20.4q-.742 0-1.271-.529Q6 19.343 6 18.6v-12h-.3q-.383 0-.641-.257-.259-.258-.259-.638t.259-.643Q5.317 4.8 5.7 4.8h3.9v-.3q0-.383.259-.641.258-.259.641-.259h3q.383 0 .641.259.259.258.259.641v.3h3.9q.383 0 .641.257.259.257.259.638 0 .38-.259.643-.258.262-.641.262H18v11.99q0 .76-.529 1.285-.529.525-1.271.525Zm8.4-13.8H7.8v12h8.4zm-5.705 10.2q.38 0 .643-.259.262-.259.262-.641V9.3q0-.383-.257-.641-.258-.259-.638-.259t-.643.259Q9.6 8.917 9.6 9.3v6.6q0 .383.257.641.258.259.638.259Zm3 0q.38 0 .643-.259.262-.259.262-.641V9.3q0-.383-.257-.641-.258-.259-.638-.259t-.643.259q-.262.258-.262.641v6.6q0 .383.257.641.258.259.638.259ZM7.8 6.6v12z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        const inputs = entry.querySelectorAll("input.shortcutName, input.URL, input.iconURL");
        const uploadButton = entry.querySelector(".uploadCustomIconButton");
        const fileInput = entry.querySelector(".iconFileInput");
        const iconInput = entry.querySelector(".iconURL");
        const deleteBtn = entry.querySelector(".shortcutDelete button");

        attachInputListeners(inputs, entry);

        uploadButton.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", async e => {
            const selectedFile = e.target.files?.[0];
            if (!selectedFile) return;
            if (!selectedFile.type.startsWith("image/")) {
                const invalidFileTypeMessage = translations[currentLanguage]?.invalidFileTypeMessage || translations["en"]?.invalidFileTypeMessage;
                alertPrompt(invalidFileTypeMessage);
                fileInput.value = "";
                return;
            }

            const maxIconBytes = 100 * 1024;
            if (selectedFile.size > maxIconBytes) {
                const iconFileTooLargeMessage = translations[currentLanguage]?.iconFileTooLargeMessage || translations["en"].iconFileTooLargeMessage;
                const fileSizeKB = localizeNumbers((selectedFile.size / 1024).toFixed(1), currentLanguage);
                const maxSizeKB = localizeNumbers((maxIconBytes / 1024).toFixed(0), currentLanguage);

                const message = iconFileTooLargeMessage
                    .replace("{size}", fileSizeKB)
                    .replace("{max}", maxSizeKB);
                alertPrompt(message);
                fileInput.value = "";
                return;
            }

            function applyIcon(iconValue) {
                iconInput.value = iconValue;
                try {
                    saveShortcut(entry);
                    renderShortcut(
                        entry.querySelector(".shortcutName").value,
                        entry.querySelector(".URL").value,
                        iconInput.value,
                        entry._index
                    );
                } catch (err) {
                    console.error("Failed to save icon:", err);
                    iconInput.value = "";
                } finally {
                    fileInput.value = "";
                }
            }

            const isSvgFile = selectedFile.type === "image/svg+xml";

            if (isSvgFile) {
                const textReader = new FileReader();
                textReader.onload = () => {
                    const sanitized = sanitizeSvg(textReader.result);
                    if (!sanitized) {
                        alertPrompt(translations[currentLanguage]?.invalidSvgMessage || translations["en"]?.invalidSvgMessage);
                        fileInput.value = "";
                        return;
                    }
                    applyIcon(sanitized);
                };
                textReader.onerror = () => {
                    console.error("Failed to read SVG file:", textReader.error);
                    fileInput.value = "";
                };
                textReader.readAsText(selectedFile);
            } else {
                const reader = new FileReader();
                reader.onload = () => applyIcon(reader.result);
                reader.onerror = () => {
                    console.error("Failed to read selected file:", reader.error);
                    fileInput.value = "";
                };
                reader.readAsDataURL(selectedFile);
            }
        });

        deleteBtn.addEventListener("click", () => deleteShortcut(entry));

        return entry;
    }

    function createShortcutElement(name, url, icon, index) {
        const normalizedUrl = normalizeUrl(url);

        const shortcut = document.createElement("div");
        shortcut.className = "shortcuts";
        shortcut._index = index;

        const link = document.createElement("a");
        link.href = normalizedUrl;

        const logoContainer = document.createElement("div");
        logoContainer.className = "shortcutLogoContainer";

        const logo = getLogoHtml(name, normalizedUrl, icon);
        if (logo) logoContainer.appendChild(logo);

        const span = document.createElement("span");
        span.className = "shortcut-name";
        span.textContent = name;

        link.appendChild(logoContainer);
        link.appendChild(span);
        shortcut.appendChild(link);

        return shortcut;
    }

    // Unifies rendering of both traditional shortcuts and folder workspaces together in the bottom dock
    function renderAllDockItems() {
        dom.shortcutsContainer.innerHTML = "";

        // 1. Render all flat shortcuts
        shortcutsCache.forEach((item, index) => {
            const shortcutEl = createShortcutElement(item.name, item.url, item.icon, index);
            dom.shortcutsContainer.appendChild(shortcutEl);
        });

        // 2. Render all folder cards
        foldersCache.forEach((folder) => {
            const card = document.createElement("div");
            card.className = "folder-card";
            card.style.borderLeft = `4px solid ${getColorHex(folder.color)}`;

            card.innerHTML = `
                <span class="folder-name">${escapeHtml(folder.name)}</span>
                <span class="folder-chevron">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display: block;">
                        <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z"/>
                    </svg>
                </span>
                <span class="folder-badge">${folder.websites.length}</span>
            `;

            card.addEventListener("click", (e) => {
                e.stopPropagation();
                showFolderPopup(folder, card);
            });

            dom.shortcutsContainer.appendChild(card);
        });
    }

    // Updates shortcutsCache and re-renders the dock
    function renderShortcut(name, url, icon, index) {
        if (index < shortcutsCache.length) {
            shortcutsCache[index] = { name, url, icon };
        } else {
            shortcutsCache.push({ name, url, icon });
        }
        renderAllDockItems();
    }

    // Escapes HTML to prevent XSS
    function escapeHtml(unsafe) {
        return unsafe.replace(/[&<>"']/g, match => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        }[match]));
    }

    // Validates custom icon URL
    function isValidCustomIconUrl(url) {
        if (typeof url !== "string") return false;
        const trimmedUrl = url.trim();
        if (trimmedUrl.includes(" ")) return false;
        const lowercaseUrl = trimmedUrl.toLowerCase();
        return (
            lowercaseUrl.startsWith("data:image/") ||
            lowercaseUrl.startsWith("https://") ||
            lowercaseUrl.startsWith("http://")
        );
    }

    function applyCustomSvgAccentColor(svg) {
        const color = localStorage.getItem("selectedTheme") === "dark"
            ? "#bfbfbf"
            : localStorage.getItem("accentLightTintColor") || "#e2eeff";

        return svg.replace(/\bcurrentColor\b/g, color);
    }

    // Sanitizes raw SVG code, returns data URL or null if unsafe
    function sanitizeSvg(raw) {
        const trimmed = raw.trim();
        const normalized = trimmed
            .replace(/^<\?xml[\s\S]*?\?>\s*/i, "")
            .replace(/^<!doctype[\s\S]*?>\s*/i, "")
            .replace(/^<!--[\s\S]*?-->\s*/i, "");
        if (!normalized.toLowerCase().startsWith("<svg")) return null;

        const forbidden = [
            /<script[\s>]/i,                // <script> tags
            /\bon\w+\s*=/i,                 // event handlers: onload=, onclick=, onerror=, …
            /<iframe[\s>]/i,                // iframes
            /<foreignObject[\s>]/i,         // foreignObject (can embed HTML)
            /javascript\s*:/i,              // javascript: URIs
            /data:(?!image\/[a-z]+;base64,)[^"'\s]*/i, // non-image data URIs
        ];

        for (const pattern of forbidden) {
            if (pattern.test(normalized)) return null;
        }

        return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(applyCustomSvgAccentColor(normalized));
    }

    // Normalizes icon input: converts raw SVG code → data URL, passes URLs through
    function processIconInput(raw) {
        const trimmed = raw.trim();
        if (!trimmed) return { value: "", error: null };

        if (/<svg[\s>]/i.test(trimmed)) {
            const dataUrl = sanitizeSvg(trimmed);
            return { value: dataUrl ?? "", error: null };
        }

        return { value: trimmed, error: null };
    }

    // Normalizes URLs to ensure they're valid
    function normalizeUrl(url) {
        url = url.trim();
        return encodeURI(
            url.startsWith("https://") || url.startsWith("http://") ? url : `https://${url}`
        );
    }

    // Gets the appropriate logo HTML for a given URL
    function getLogoHtml(name, url, customIcon = "") {
        let hostname;

        function setIconType(element, type) {
            element.setAttribute("data-icon-type", type);
            return element;
        }

        function createLetterFallback() {
            let letter = "?";

            if (name.trim()) {
                letter = name.trim().charAt(0).toUpperCase();
            } else {
                try {
                    hostname = new URL(normalizeUrl(url)).hostname.replace(/^www\./, "");
                    letter = hostname.charAt(0).toUpperCase() || "?";
                } catch {
                    letter = (url.trim()?.charAt(0) || "?").toUpperCase();
                }
            }

            const selectedTheme = localStorage.getItem("selectedTheme");
            const color = selectedTheme === "dark"
                ? "#bfbfbf"
                : localStorage.getItem("accentLightTintColor") || "#ffffff";
            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <text x="50%" y="58%" text-anchor="middle" dominant-baseline="middle"
                        font-size="30" font-family="Inter, Segoe UI, Arial, sans-serif" font-weight="700"
                        fill="${color}">
                        ${letter}
                    </text>
                </svg>
            `;

            const img = document.createElement("img");
            img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
            img.alt = "";
            return img;
        }

        if (customIcon && isValidCustomIconUrl(customIcon)) {
            const customIconImg = document.createElement("img");
            customIconImg.src = customIcon.trim();
            customIconImg.alt = "";
            customIconImg.referrerPolicy = "no-referrer";
            setIconType(customIconImg, "custom");
            customIconImg.addEventListener("error", () => {
                customIconImg.src = createLetterFallback().src;
                setIconType(customIconImg, "letter");
            }, { once: true });

            return customIconImg;
        }

        try {
            hostname = new URL(normalizeUrl(url)).hostname.replace(/^www\./, "");
        } catch (error) {
            return createLetterFallback();
        }

        if (hostname === "github.com") {
            const img = document.createElement("img");
            img.src = "./svgs/github-shortcut.svg";
            img.alt = "";
            setIconType(img, "default");
            return img;
        }

        const preset = presets.find(p => p.domains.includes(hostname));
        if (preset) {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = preset.svg;
            const svgElement = wrapper.firstElementChild;
            setIconType(svgElement, "default");
            return svgElement;
        }

        const img = document.createElement("img");
        img.src = `https://s2.googleusercontent.com/s2/favicons?domain_url=https://${hostname}&sz=256`;
        img.alt = "";
        img.referrerPolicy = "no-referrer";
        setIconType(img, "default");
        img.addEventListener("error", () => {
            img.src = createLetterFallback().src;
            setIconType(img, "letter");
        }, { once: true });

        return img;
    }

    // Validates the icon input field on blur
    function validateIconInput(input) {
        const raw = input.value.trim();
        if (!raw) return;

        if (/<svg[\s>]/i.test(raw)) {
            const { value } = processIconInput(raw);
            if (!value) {
                alertPrompt(translations[currentLanguage]?.invalidSvgMessage || translations["en"]?.invalidSvgMessage);
                input.value = "";
            } else {
                input.value = value;
            }
        } else {
            if (!isValidCustomIconUrl(raw)) {
                alertPrompt(translations[currentLanguage]?.invalidIconUrlMessage || translations["en"]?.invalidIconUrlMessage);
                input.value = "";
            }
        }
    }

    // Attaches event listeners to shortcut input fields
    function attachInputListeners(inputs, entry) {
        inputs.forEach(input => {
            input.addEventListener("blur", () => {
                if (input.classList.contains("iconURL")) {
                    validateIconInput(input);
                }

                saveShortcut(entry);
                renderShortcut(
                    entry.querySelector(".shortcutName").value,
                    entry.querySelector(".URL").value,
                    entry.querySelector(".iconURL").value,
                    entry._index
                );
            });
            input.addEventListener("focus", e => e.target.select());
        });

        inputs[0].addEventListener("keydown", e => e.key === "Enter" && inputs[1].focus());
        inputs[1].addEventListener("keydown", e => e.key === "Enter" && inputs[2].focus());
        inputs[2].addEventListener("keydown", e => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            e.stopPropagation();
            e.target.blur();
        });
    }

    // Drag and drop functionality for reordering shortcuts
    function setupDragAndDrop() {
        let draggedElement = null;
        let autoScrollInterval = null;
        let dragOffset = { x: 0, y: 0 };
        let isReordering = false;
        let pendingReorder = false;
        let isDragging = false;

        function cachePositions() {
            const map = new Map();
            const entries = dom.shortcutSettingsContainer.querySelectorAll(".shortcutSettingsEntry");
            for (const el of entries) {
                map.set(el, el.getBoundingClientRect().top);
            }
            return map;
        }

        function animateGlide(oldPositions) {
            const entries = [...dom.shortcutSettingsContainer.children];
            const newPositions = new Map();

            entries.forEach(el => {
                if (el !== draggedElement) {
                    newPositions.set(el, el.getBoundingClientRect().top);
                }
            });

            entries.forEach(el => {
                if (el === draggedElement) return;
                const oldTop = oldPositions.get(el);
                const newTop = newPositions.get(el);
                if (oldTop !== undefined && newTop !== undefined) {
                    const delta = oldTop - newTop;
                    if (delta !== 0) {
                        el.style.transition = "none";
                        el.style.transform = `translateY(${delta}px)`;
                        requestAnimationFrame(() => {
                            el.style.transition = "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)";
                            el.style.transform = "none";
                        });
                    }
                }
            });
        }

        function handleAutoScroll(clientY) {
            const container = dom.shortcutSettingsContainer;
            const containerRect = container.getBoundingClientRect();
            const scrollThreshold = 50;
            const scrollSpeed = 5;

            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }

            if (clientY - containerRect.top < scrollThreshold && container.scrollTop > 0) {
                autoScrollInterval = setInterval(() => {
                    container.scrollTop = Math.max(0, container.scrollTop - scrollSpeed);
                }, 16);
            } else if (containerRect.bottom - clientY < scrollThreshold &&
                container.scrollTop < container.scrollHeight - container.clientHeight) {
                autoScrollInterval = setInterval(() => {
                    const maxScroll = container.scrollHeight - container.clientHeight;
                    container.scrollTop = Math.min(maxScroll, container.scrollTop + scrollSpeed);
                }, 16);
            }
        }

        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }

        let dragElementsCache = [];
        let cacheTimestamp = 0;

        function getSortedElements() {
            const now = Date.now();
            if (now - cacheTimestamp < 16) {
                return dragElementsCache;
            }

            dragElementsCache = [...dom.shortcutSettingsContainer.querySelectorAll(".shortcutSettingsEntry:not(.dragging)")]
                .map(el => ({
                    element: el,
                    rect: el.getBoundingClientRect()
                }));
            cacheTimestamp = now;
            return dragElementsCache;
        }

        function getDragAfterElement(y) {
            const elements = getSortedElements();
            let low = 0, high = elements.length - 1;

            while (low <= high) {
                const mid = (low + high) >>> 1;
                const middleY = elements[mid].rect.top + elements[mid].rect.height / 2;
                y < middleY ? (high = mid - 1) : (low = mid + 1);
            }

            return elements[low]?.element || null;
        }

        function insertElementWithAnimation(element, targetElement, insertBefore = true) {
            const oldPositions = cachePositions();
            const container = dom.shortcutSettingsContainer;

            if (targetElement) {
                if (insertBefore) {
                    container.insertBefore(element, targetElement);
                } else {
                    container.insertBefore(element, targetElement.nextSibling);
                }
            } else {
                container.appendChild(element);
            }

            animateGlide(oldPositions);
            pendingReorder = true;
        }

        function handleDragMove(clientX, clientY) {
            if (!isReordering || !draggedElement) return;

            handleAutoScroll(clientY);

            const afterElement = getDragAfterElement(clientY);

            if (afterElement === null || afterElement === undefined) {
                insertElementWithAnimation(draggedElement, null, false);
                return;
            }

            if (afterElement && afterElement !== draggedElement) {
                if (afterElement.previousSibling !== draggedElement) {
                    insertElementWithAnimation(draggedElement, afterElement, true);
                }
            } else if (!afterElement) {
                const lastElement = dom.shortcutSettingsContainer.lastElementChild;
                if (lastElement && lastElement !== draggedElement) {
                    insertElementWithAnimation(draggedElement, null, false);
                }
            }
        }

        function cleanup() {
            stopAutoScroll();

            if (draggedElement) {
                draggedElement.classList.remove("dragging");
            }

            if (pendingReorder) {
                updateShortcutIndices();
                saveShortcutOrder();
                pendingReorder = false;
            }

            dom.shortcutSettingsContainer.classList.remove("dragging-ongoing");
            isReordering = false;
            isDragging = false;
            draggedElement = null;

            window.isDragging = true;
            setTimeout(() => {
                window.isDragging = false;
            }, 100);
        }

        dom.shortcutSettingsContainer.addEventListener("dragstart", e => {
            const item = e.target.closest(".shortcutSettingsEntry");
            if (item) {
                isReordering = true;
                window.isDragging = true;
                draggedElement = item;

                const rect = item.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left;
                dragOffset.y = e.clientY - rect.top;

                dom.shortcutSettingsContainer.classList.add("dragging-ongoing");

                setTimeout(() => {
                    item.classList.add("dragging");
                }, 0);

                e.dataTransfer.effectAllowed = "move";
            }
        });

        dom.shortcutSettingsContainer.addEventListener("dragover", e => {
            e.preventDefault();
            handleDragMove(e.clientX, e.clientY);
        });

        dom.shortcutSettingsContainer.addEventListener("dragend", e => {
            if (!isReordering || !draggedElement) return;
            cleanup();
        });

        document.addEventListener("dragend", () => {
            if (isReordering) {
                cleanup();
            }
        });

        window.addEventListener("blur", () => {
            if (isReordering || isDragging) {
                cleanup();
            }
        });
    }

    // Drag and drop functionality for reordering folder workspaces
    function setupFolderDragAndDrop() {
        let draggedElement = null;
        let autoScrollInterval = null;
        let dragOffset = { x: 0, y: 0 };
        let isReordering = false;
        let pendingReorder = false;

        function cachePositions() {
            const map = new Map();
            const entries = dom.folderList.querySelectorAll(".folder-settings-entry");
            for (const el of entries) {
                map.set(el, el.getBoundingClientRect().top);
            }
            return map;
        }

        function animateGlide(oldPositions) {
            const entries = [...dom.folderList.children];
            const newPositions = new Map();

            entries.forEach(el => {
                if (el !== draggedElement) {
                    newPositions.set(el, el.getBoundingClientRect().top);
                }
            });

            entries.forEach(el => {
                if (el === draggedElement) return;
                const oldTop = oldPositions.get(el);
                const newTop = newPositions.get(el);
                if (oldTop !== undefined && newTop !== undefined) {
                    const delta = oldTop - newTop;
                    if (delta !== 0) {
                        el.style.transition = "none";
                        el.style.transform = `translateY(${delta}px)`;
                        requestAnimationFrame(() => {
                            el.style.transition = "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)";
                            el.style.transform = "none";
                        });
                    }
                }
            });
        }

        function handleAutoScroll(clientY) {
            const container = dom.folderList;
            const containerRect = container.getBoundingClientRect();
            const scrollThreshold = 50;
            const scrollSpeed = 5;

            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }

            if (clientY - containerRect.top < scrollThreshold && container.scrollTop > 0) {
                autoScrollInterval = setInterval(() => {
                    container.scrollTop = Math.max(0, container.scrollTop - scrollSpeed);
                }, 16);
            } else if (containerRect.bottom - clientY < scrollThreshold &&
                container.scrollTop < container.scrollHeight - container.clientHeight) {
                autoScrollInterval = setInterval(() => {
                    const maxScroll = container.scrollHeight - container.clientHeight;
                    container.scrollTop = Math.min(maxScroll, container.scrollTop + scrollSpeed);
                }, 16);
            }
        }

        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }

        function getDragAfterElement(y) {
            const elements = [...dom.folderList.querySelectorAll(".folder-settings-entry:not(.dragging)")]
                .map(el => ({
                    element: el,
                    rect: el.getBoundingClientRect()
                }));

            let low = 0, high = elements.length - 1;
            while (low <= high) {
                const mid = (low + high) >>> 1;
                const middleY = elements[mid].rect.top + elements[mid].rect.height / 2;
                y < middleY ? (high = mid - 1) : (low = mid + 1);
            }
            return elements[low]?.element || null;
        }

        function insertElementWithAnimation(element, targetElement, insertBefore = true) {
            const oldPositions = cachePositions();
            const container = dom.folderList;

            if (targetElement) {
                if (insertBefore) {
                    container.insertBefore(element, targetElement);
                } else {
                    container.insertBefore(element, targetElement.nextSibling);
                }
            } else {
                container.appendChild(element);
            }

            animateGlide(oldPositions);
            pendingReorder = true;
        }

        function handleDragMove(clientX, clientY) {
            if (!isReordering || !draggedElement) return;

            handleAutoScroll(clientY);

            const afterElement = getDragAfterElement(clientY);

            if (afterElement === null) {
                insertElementWithAnimation(draggedElement, null, false);
                return;
            }

            if (afterElement && afterElement !== draggedElement) {
                if (afterElement.previousSibling !== draggedElement) {
                    insertElementWithAnimation(draggedElement, afterElement, true);
                }
            }
        }

        function cleanup() {
            stopAutoScroll();

            if (draggedElement) {
                draggedElement.classList.remove("dragging");
            }

            if (pendingReorder) {
                saveFolderOrder();
                pendingReorder = false;
            }

            dom.folderList.classList.remove("dragging-ongoing");
            isReordering = false;
            draggedElement = null;

            window.isDragging = true;
            setTimeout(() => {
                window.isDragging = false;
            }, 100);
        }

        dom.folderList.addEventListener("mousedown", e => {
            const entry = e.target.closest(".folder-settings-entry");
            if (entry) {
                const handle = e.target.closest(".grip-container");
                if (handle) {
                    entry.setAttribute("draggable", "true");
                } else {
                    entry.setAttribute("draggable", "false");
                }
            }
        });

        dom.folderList.addEventListener("dragstart", e => {
            const item = e.target.closest(".folder-settings-entry");
            if (item && item.getAttribute("draggable") === "true") {
                isReordering = true;
                window.isDragging = true;
                draggedElement = item;

                const rect = item.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left;
                dragOffset.y = e.clientY - rect.top;

                dom.folderList.classList.add("dragging-ongoing");

                setTimeout(() => {
                    item.classList.add("dragging");
                }, 0);

                e.dataTransfer.effectAllowed = "move";
            } else {
                e.preventDefault();
            }
        });

        dom.folderList.addEventListener("dragover", e => {
            e.preventDefault();
            handleDragMove(e.clientX, e.clientY);
        });

        dom.folderList.addEventListener("dragend", e => {
            if (!isReordering || !draggedElement) return;
            cleanup();
        });

        document.addEventListener("dragend", () => {
            if (isReordering) {
                cleanup();
            }
        });

        window.addEventListener("blur", () => {
            if (isReordering) {
                cleanup();
            }
        });
    }

    function saveFolderOrder() {
        const entries = dom.folderList.querySelectorAll(".folder-settings-entry");
        const newOrder = [];
        entries.forEach(entry => {
            const folderId = entry._folderId;
            const folder = foldersCache.find(f => f.id === folderId);
            if (folder) {
                newOrder.push(folder);
            }
        });

        foldersCache = newOrder;
        saveFoldersToStorage();

        // Re-render settings list so the DOM matches order exactly
        renderFolderSettingsList();
    }

    // Drag and drop functionality for reordering websites inside a folder
    function setupWebsitesDragAndDrop() {
        let draggedElement = null;
        let autoScrollInterval = null;
        let dragOffset = { x: 0, y: 0 };
        let isReordering = false;
        let pendingReorder = false;

        function cachePositions() {
            const map = new Map();
            const entries = dom.folderWebsitesList.querySelectorAll(".folder-websites-entry");
            for (const el of entries) {
                map.set(el, el.getBoundingClientRect().top);
            }
            return map;
        }

        function animateGlide(oldPositions) {
            const entries = [...dom.folderWebsitesList.children];
            const newPositions = new Map();

            entries.forEach(el => {
                if (el !== draggedElement) {
                    newPositions.set(el, el.getBoundingClientRect().top);
                }
            });

            entries.forEach(el => {
                if (el === draggedElement) return;
                const oldTop = oldPositions.get(el);
                const newTop = newPositions.get(el);
                if (oldTop !== undefined && newTop !== undefined) {
                    const delta = oldTop - newTop;
                    if (delta !== 0) {
                        el.style.transition = "none";
                        el.style.transform = `translateY(${delta}px)`;
                        requestAnimationFrame(() => {
                            el.style.transition = "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)";
                            el.style.transform = "none";
                        });
                    }
                }
            });
        }

        function handleAutoScroll(clientY) {
            const container = dom.folderWebsitesList;
            const containerRect = container.getBoundingClientRect();
            const scrollThreshold = 40;
            const scrollSpeed = 5;

            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }

            if (clientY - containerRect.top < scrollThreshold && container.scrollTop > 0) {
                autoScrollInterval = setInterval(() => {
                    container.scrollTop = Math.max(0, container.scrollTop - scrollSpeed);
                }, 16);
            } else if (containerRect.bottom - clientY < scrollThreshold &&
                container.scrollTop < container.scrollHeight - container.clientHeight) {
                autoScrollInterval = setInterval(() => {
                    const maxScroll = container.scrollHeight - container.clientHeight;
                    container.scrollTop = Math.min(maxScroll, container.scrollTop + scrollSpeed);
                }, 16);
            }
        }

        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }

        function getDragAfterElement(y) {
            const elements = [...dom.folderWebsitesList.querySelectorAll(".folder-websites-entry:not(.dragging)")]
                .map(el => ({
                    element: el,
                    rect: el.getBoundingClientRect()
                }));

            let low = 0, high = elements.length - 1;
            while (low <= high) {
                const mid = (low + high) >>> 1;
                const middleY = elements[mid].rect.top + elements[mid].rect.height / 2;
                y < middleY ? (high = mid - 1) : (low = mid + 1);
            }
            return elements[low]?.element || null;
        }

        function insertElementWithAnimation(element, targetElement, insertBefore = true) {
            const oldPositions = cachePositions();
            const container = dom.folderWebsitesList;

            if (targetElement) {
                if (insertBefore) {
                    container.insertBefore(element, targetElement);
                } else {
                    container.insertBefore(element, targetElement.nextSibling);
                }
            } else {
                container.appendChild(element);
            }

            animateGlide(oldPositions);
            pendingReorder = true;
        }

        function handleDragMove(clientX, clientY) {
            if (!isReordering || !draggedElement) return;

            handleAutoScroll(clientY);

            const afterElement = getDragAfterElement(clientY);

            if (afterElement === null) {
                insertElementWithAnimation(draggedElement, null, false);
                return;
            }

            if (afterElement && afterElement !== draggedElement) {
                if (afterElement.previousSibling !== draggedElement) {
                    insertElementWithAnimation(draggedElement, afterElement, true);
                }
            }
        }

        function cleanup() {
            stopAutoScroll();

            if (draggedElement) {
                draggedElement.classList.remove("dragging");
            }

            if (pendingReorder) {
                saveWebsitesOrder();
                pendingReorder = false;
            }

            dom.folderWebsitesList.classList.remove("dragging-ongoing");
            isReordering = false;
            draggedElement = null;

            window.isDragging = true;
            setTimeout(() => {
                window.isDragging = false;
            }, 100);
        }

        dom.folderWebsitesList.addEventListener("mousedown", e => {
            const entry = e.target.closest(".folder-websites-entry");
            if (entry) {
                const handle = e.target.closest(".web-drag-handle");
                if (handle) {
                    entry.setAttribute("draggable", "true");
                } else {
                    entry.setAttribute("draggable", "false");
                }
            }
        });

        dom.folderWebsitesList.addEventListener("dragstart", e => {
            const item = e.target.closest(".folder-websites-entry");
            if (item && item.getAttribute("draggable") === "true") {
                isReordering = true;
                window.isDragging = true;
                draggedElement = item;

                const rect = item.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left;
                dragOffset.y = e.clientY - rect.top;

                dom.folderWebsitesList.classList.add("dragging-ongoing");

                setTimeout(() => {
                    item.classList.add("dragging");
                }, 0);

                e.dataTransfer.effectAllowed = "move";
            } else {
                e.preventDefault();
            }
        });

        dom.folderWebsitesList.addEventListener("dragover", e => {
            e.preventDefault();
            handleDragMove(e.clientX, e.clientY);
        });

        dom.folderWebsitesList.addEventListener("dragend", e => {
            if (!isReordering || !draggedElement) return;
            cleanup();
        });

        document.addEventListener("dragend", () => {
            if (isReordering) {
                cleanup();
            }
        });

        window.addEventListener("blur", () => {
            if (isReordering) {
                cleanup();
            }
        });
    }

    function saveWebsitesOrder() {
        if (!selectedFolderId) return;
        const folder = foldersCache.find(f => f.id === selectedFolderId);
        if (!folder) return;

        const entries = dom.folderWebsitesList.querySelectorAll(".folder-websites-entry");
        const newWebsites = [];
        entries.forEach(entry => {
            const index = entry._index;
            if (folder.websites[index]) {
                newWebsites.push(folder.websites[index]);
            }
        });

        folder.websites = newWebsites;
        saveFoldersToStorage();

        // Re-render websites editor so indices are reset correctly in DOM
        renderFolderWebsitesEditor(folder);
    }

    // Updates indices of all shortcut entries after reordering
    function updateShortcutIndices() {
        document.querySelectorAll(".shortcutSettingsEntry").forEach((entry, index) => {
            entry._index = index;
        });
    }

    // Saves the new shortcut order to localStorage
    function saveShortcutOrder() {
        const entries = dom.shortcutSettingsContainer.querySelectorAll(".shortcutSettingsEntry");
        const newOrder = Array.from(entries).map(entry => ({
            name: entry.querySelector(".shortcutName").value,
            url: entry.querySelector(".URL").value,
            icon: entry.querySelector(".iconURL").value
        }));

        if (hasOrderChanged(newOrder)) {
            localStorage.setItem("shortcutAmount", newOrder.length.toString());
            newOrder.forEach((item, index) => {
                localStorage.setItem(`shortcutName${index}`, item.name);
                localStorage.setItem(`shortcutURL${index}`, item.url);

                try {
                    localStorage.setItem(`shortcutIcon${index}`, item.icon || "");
                } catch (iconError) {
                    if (iconError.name === "QuotaExceededError" || iconError.code === 22) {
                        localStorage.removeItem(`shortcutIcon${index}`);
                        const entry = entries[index];
                        if (entry) entry.querySelector(".iconURL").value = "";
                        item.icon = "";
                    } else {
                        throw iconError;
                    }
                }
            });

            shortcutsCache = newOrder;
            renderAllShortcuts(newOrder);
        }
    }

    // Checks if the shortcut order has changed
    function hasOrderChanged(newOrder) {
        if (newOrder.length !== shortcutsCache.length) return true;

        return newOrder.some((item, index) => {
            const cached = shortcutsCache[index];
            return item.name !== cached.name || item.url !== cached.url || (item.icon || "") !== (cached.icon || "");
        });
    }

    // Renders all shortcuts + folders in the main dock
    function renderAllShortcuts(order) {
        shortcutsCache = order;
        renderAllDockItems();
    }

    // Handles the shortcuts toggle checkbox change
    function handleShortcutsToggle() {
        const isChecked = this.checked;
        saveCheckboxState("shortcutsCheckboxState", this);

        dom.shortcuts.style.display = isChecked ? "flex" : "none";
        saveDisplayStatus("shortcutsDisplayStatus", isChecked ? "flex" : "none");

        dom.shortcutEditField.classList.toggle("inactive", !isChecked);
        saveActiveStatus("shortcutEditField", isChecked ? "active" : "inactive");

        dom.adaptiveIconField.classList.toggle("inactive", !isChecked);
        saveActiveStatus("adaptiveIconField", isChecked ? "active" : "inactive");
    }

    // Handles the adaptive icon toggle checkbox change
    function handleAdaptiveIconToggle() {
        saveCheckboxState("adaptiveIconToggle", this);
        if (this.checked) {
            dom.shortcutsContainer.classList.add("adaptive-icons");
        } else {
            dom.shortcutsContainer.classList.remove("adaptive-icons");
        }
    }

    // Adds a new shortcut
    function addNewShortcut() {
        const storedAmount = localStorage.getItem("shortcutAmount");
        const currentAmount = (storedAmount !== null) ? parseInt(storedAmount) : shortcutsCache.length;
        if (currentAmount >= MAX_SHORTCUTS) return;

        const newAmount = currentAmount + 1;
        localStorage.setItem("shortcutAmount", newAmount.toString());

        if (newAmount === MAX_SHORTCUTS) {
            dom.newShortcutButton.classList.add("inactive");
        }

        const entry = createShortcutEntry(PLACEHOLDER.name, PLACEHOLDER.url, "", false, currentAmount);
        dom.shortcutSettingsContainer.appendChild(entry);

        saveShortcut(entry);
        renderShortcut(PLACEHOLDER.name, PLACEHOLDER.url, "", currentAmount);
    }

    // Deletes a shortcut
    function deleteShortcut(entry) {
        const storedAmount = localStorage.getItem("shortcutAmount");
        const currentAmount = (storedAmount !== null) ? parseInt(storedAmount) : shortcutsCache.length;
        if (currentAmount <= 0) return;

        const index = entry._index;
        entry.remove();

        // Remove from cache and shift remaining entries down
        shortcutsCache.splice(index, 1);

        localStorage.setItem("shortcutAmount", (currentAmount - 1).toString());
        for (let i = index; i < currentAmount - 1; i++) {
            const nextEntry = dom.shortcutSettingsContainer.children[i];
            nextEntry._index = i;
            saveShortcut(nextEntry);
        }
        localStorage.removeItem(`shortcutName${currentAmount - 1}`);
        localStorage.removeItem(`shortcutURL${currentAmount - 1}`);
        localStorage.removeItem(`shortcutIcon${currentAmount - 1}`);

        dom.newShortcutButton.classList.remove("inactive");

        // Re-render dock with updated shortcutsCache (no folders removed)
        renderAllDockItems();
    }

    // Resets all shortcuts to default
    async function resetShortcuts() {
        if (!(await confirmPrompt(translations[currentLanguage]?.resetShortcutsPrompt || translations["en"].resetShortcutsPrompt)))
            return;

        const shortcutEntries = [...dom.shortcutSettingsContainer.querySelectorAll(".shortcutSettingsEntry")];
        shortcutEntries.forEach(el => el.classList.add("reset-shift-animation"));

        const svg = dom.resetShortcutsButton.querySelector("svg");
        svg.classList.add("rotate-animation");

        for (let i = 0; i < (localStorage.getItem("shortcutAmount") || 0); i++) {
            localStorage.removeItem(`shortcutName${i}`);
            localStorage.removeItem(`shortcutURL${i}`);
            localStorage.removeItem(`shortcutIcon${i}`);
        }
        localStorage.removeItem("shortcutAmount");

        await new Promise(resolve => setTimeout(resolve, 300));

        dom.shortcutSettingsContainer.innerHTML = "";
        shortcutsCache = [];
        renderAllDockItems();
        dom.newShortcutButton.classList.remove("inactive");
        setTimeout(() => svg.classList.remove("rotate-animation"), 500);

        loadShortcuts();
    }

    // Saves a single shortcut to localStorage
    function saveShortcut(entry) {
        const index = entry._index;
        const name = entry.querySelector(".shortcutName").value;
        const url = entry.querySelector(".URL").value;
        const iconInput = entry.querySelector(".iconURL");
        const icon = iconInput.value || "";

        localStorage.setItem(`shortcutName${index}`, name);
        localStorage.setItem(`shortcutURL${index}`, url);

        try {
            localStorage.setItem(`shortcutIcon${index}`, icon);
        } catch (iconError) {
            if (iconError.name === "QuotaExceededError" || iconError.code === 22) {
                iconInput.value = "";
                localStorage.removeItem(`shortcutIcon${index}`);

                const iconStorageQuotaMessage = translations[currentLanguage]?.iconStorageQuotaMessage || translations["en"].iconStorageQuotaMessage;
                alertPrompt(iconStorageQuotaMessage);
            } else {
                throw iconError;
            }
        }
    }
});
