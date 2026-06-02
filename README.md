# MYNT: Material You New Tab

MYNT is a premium, modern, and highly customisable browser extension that transforms your default New Tab page into a sleek, functional **Material You** dashboard. Featuring dynamic color-mix themes, live weather indicators, quick shortcuts, organized folder workspaces, a goal progress tracker, Google services shortcuts, and instant AI tools launch, MYNT organizes your digital workspace beautifully and efficiently.

---

## ✨ Features

*   **🎨 Dynamic Material You Styling**: Match your browser style perfectly with custom accent-mix colors, high-contrast dark modes, glassmorphism, and responsive micro-animations.
*   **🔍 Unified Search Bar**: Search natively using Google, DuckDuckGo, Bing, Brave Search, YouTube, Wikipedia, Reddit, Stack Overflow, and Google Scholar from a single theme-matching dropdown input.
*   **📁 Custom Shortcuts & Folders**: Pin your favorite links to the bottom dock. Organize them into folders/workspaces, drag and drop to reorder, and customize SVGs or website names. Supports deleting all items down to `0` for an ultra-minimal look!
*   **🌦️ Live Weather Widget**: Displays real-time temperatures, conditions, humidity, max/min values, and custom locations in Metric (°C) or Imperial (°F).
*   **🎯 Goal Progress Tracker**: A beautiful tasks and goals checklist widget that displays real-time progress percentages and animated bars.
*   **🤖 One-Click AI Sidebar**: Instantly open popular AI portals like ChatGPT, Gemini, Copilot, Perplexity, Claude, and DeepSeek.
*   **📱 Google Apps integration**: Access Gmail, Drive, Docs, Calendar, and more right from a sleek 9-dot menu overlay.

---

## 🔄 Recent Improvements & Refactorings (Old vs New)

Here is a summary of the extensive bugs fixed and refactorings implemented recently to make MYNT stable, crash-free, and premium:

| Category / Component | ❌ Old Behavior (Issues) | 🟢 New Behavior (Improvements) |
| :--- | :--- | :--- |
| **Brave Search Overlay** | Brave Browser's native heuristics matched the search input tag ID (`searchQ`), overlaying Brave's own address-bar dropdown directly over the custom Material You search dropdown. | Renamed input element ID to `mainInput` across HTML, CSS, and JavaScript. This successfully evades Brave's heuristic parser, ensuring our custom theme-matching picker remains fully visible. |
| **Multi-Digit Engines Support** | The engine ID extractor parsed single-digit IDs (`"engine5" -> "5"`) using `.charAt(length - 1)`. This broke for double-digit engines like Stack Overflow (`"engine10"`) and Scholar (`"engine11"`), returning `"0"` and `"1"`, which crashed on data-attributes queries. | Replaced with `.replace("engine", "")` string substitution. Multi-digit search engines are now fully supported, validate correctly, and load with robust recovery logic. |
| **Google Search Selection** | Selecting Google (`engine1`) from the search dropdown resulted in fatal JS script execution crashes because Google does not have a companion radio button in the settings panel to mark `checked`. | Added strict presence checks inside the event handlers. Google selections are now safely stored, validated, and applied without trying to modify non-existent elements. |
| **Empty Edit Shortcuts View** | Opening "Manage" under Edit Shortcuts showed a completely empty sidebar page. This was because the active tab defaulted to `"folders"` (Workspaces & Folders), which was empty. | Defaults the initial settings view to `"shortcuts"` tab and programmatically triggers a click on `"shortcuts"` on slide-in, showing saved shortcuts instantly. |
| **shortcuts.js scoping crash** | Fails to initialize on page load with `ReferenceError: currentLanguage is not defined` because it was not in the scope of `shortcuts.js`. | Declares `currentLanguage` locally inside the `DOMContentLoaded` block in `shortcuts.js`, resolving the crash. |
| **Edit Shortcuts positioning** | `#shortcutEditPage` was rendered outside `#optCont` as a direct child of `#menuCont`, defaulting to `position: static` which pushed the entire view far off-screen. | Defined `#shortcutEditPage` in `style.css` with `position: absolute; top: 0; left: 0; width: 100%; height: 100%;` with theme-matching background, custom scrollbars, and limits. |
| **Sidebar Page Transitions** | Opening pages utilized nested timers and race-prone CSS state changes, occasionally resulting in incomplete transitions or flickering frames. | Sets `display = "block"` instantly, triggers `offsetHeight` to force a browser reflow, and executes the slide transforms inside a unified `requestAnimationFrame` block for buttery-smooth animations. |
| **Google Apps Menu** | Defaulted to hidden on new profiles / first installs, requiring users to guess that they needed to enable it in Settings. | Defaulted to checked and visible on first load (`null` localStorage state) so the 9-dot menu is immediately usable out-of-the-box. |
| **All Shortcuts Deletion** | Blocked users from deleting the very last shortcut in the settings panel, leaving one shortcut stuck even if they wanted an entirely clean dock. | Supports deleting all flat shortcuts down to `0`. Solved falsy `0` fallback key bugs, and kept adding/deleting completely active. |

---

## 📥 Developer Installation Guide

To load this local unpacked repository as a Google Chrome or Chromium extension:

1.  Open your browser and navigate to **`chrome://extensions/`**.
2.  Enable **Developer mode** using the toggle switch in the top-right corner.
3.  Click the **"Load unpacked"** button in the top-left corner.
4.  Select the root folder **`MaterialYouNewTab-main`** (which contains `manifest.json` and the main files).
5.  Open a new tab to enjoy your clean Material You New Tab dashboard!
6.  *Whenever you modify the code, simply click the "Reload" circular arrow on the extension's card to apply all changes instantly.*

---

## 📜 License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.
