# MYNT: Material You New Tab (Custom Fork)

A highly customized, feature-rich browser extension that replaces the default New Tab page, inspired by Google's beautiful **Material You** design language.

This project is a modified and enhanced fork of the original repository: [prem-k-r/materialYouNewTab](https://github.com/prem-k-r/materialYouNewTab).

<p align="center">
  <img src="images/Screenshot%202026-06-27%20110537.png" alt="Material You New Tab Preview" width="100%" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />
</p>

---

## 🌟 Enhanced Features & Modifications

This fork builds upon the original extension by replacing standard widgets and adding new productivity tools:

### 1. 📂 Custom Shortcut Folders & Workspaces (New Feature)
- Organize your shortcuts like never before. You can now toggle the shortcuts settings panel to create **Folders/Workspaces**.
- Group favorite websites into named folders (e.g., *AI Tools*, *Dev*, *Social*).
- Personalize each folder with a custom **color preset marker** for quick visual scanning.
- Add, edit, remove, and drag-and-drop to reorder websites inside folders.

### 2. 📰 Streamlined News Widget (Weather Redesign)
- Replaced the large standalone weather section with a multi-category **News Widget**.
- Keep up with your interests directly from your homepage across tabs: **AI, Dev, Anime, Gaming, Sports, Cinema, Local (Tamil Nadu & India), Global, and Other (Science, Finance, Space)**.
- Features real-time RSS refresh.
- Replaced the large temperature details layout with a sleek, minimalist **floating weather temperature pill** next to the news container.

### 3. 🎯 Goals & Progress Tracker (Replaced Tasks List)
- Replaced the basic To-Do list with an interactive **Goals Section**.
- **Auto-Link Support**: Typing any website address or raw URL (e.g. `github.com`, `https://...`) inside a goal automatically converts it into a clickable link.
- **Dynamic Styling**: Goal titles and links automatically inherit the warm, soft-cream text color (`var(--textColorDark-blue)`) of the main greeting, keeping text readable across all custom themes.
- Completed goals can be checked off with a smooth, bouncing checkmark animation, cleared, or reset.

### 4. 🌅 Personalized Greeting
- Enhanced greeting with a personalized username setting.
- Rotates daily through **poetical status subtexts** suited for morning, afternoon, evening, and night to keep your tab fresh and inspiring.

### 5. ⚡ Distraction-Free UI Refinements
- **Clean Settings**: Removed Github and Feedback links from the settings drawer for a clean and focused layout.
- **Navigation Targets**: Optimized browser tab behavior—links inside the **News** widget open in a new tab, whereas bottom shortcuts and custom goal links open directly in the current tab.

---

## 🚀 Installation Instructions

### Chrome & Chromium-based Browsers (Edge, Brave, Opera, Vivaldi)
1. Download or clone this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle switch in the top-right corner).
4. Click **Load unpacked** and select the root directory (`MaterialYouNewTab-main`) of the project.
5. Open a new tab to see MYNT in action!

### Firefox
1. Download or clone this repository to your local machine.
2. Open Firefox and enter `about:debugging` in the URL bar.
3. Click **This Firefox** on the left menu.
4. Click **Load Temporary Add-on...** under *Temporary Extensions*.
5. Select `manifest(firefox).json` (or any file in the extension root) and load it.

---

## 🛠️ Credits & License

- Original extension: [prem-k-r/materialYouNewTab](https://github.com/prem-k-r/materialYouNewTab)
- Icons: Material Design Icons
- Font pairings: Google Fonts (Outfit, Poppins, Inter)
- Licensed under the **GNU General Public License v3.0**.
