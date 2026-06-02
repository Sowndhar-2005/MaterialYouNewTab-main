<!-- Initialized : Sun 20 Aug 2023 03:41:08 PM IST -->
<h1 align="center">

<a href="https://prem-k-r.github.io/MaterialYouNewTab/"><img src="https://github.com/user-attachments/assets/48c3a9cb-06fa-4c45-92ec-194cdb7c5661" width="58"></a>
<br>
MYNT: Material You New Tab

</h1>
<div align="center">

MYNT: Material You New Tab is a versatile browser extension that personalizes your New Tab page with customizable themes, a welcoming message, and various handy tools, all while integrating seamlessly with your preferred search engine.

</div>

<div align="center">

![License](https://img.shields.io/github/license/prem-k-r/MaterialYouNewTab)
![Last Commit](https://img.shields.io/github/last-commit/prem-k-r/MaterialYouNewTab)
![GitHub contributors](https://img.shields.io/github/contributors/prem-k-r/MaterialYouNewTab)
![GitHub stars](https://img.shields.io/github/stars/prem-k-r/MaterialYouNewTab)
![GitHub forks](https://img.shields.io/github/forks/prem-k-r/MaterialYouNewTab)

[![](https://img.shields.io/chrome-web-store/v/jjpokbgpiljgndebfoljdeihhkpcpfgl.svg)](https://chrome.google.com/webstore/detail/mynt-material-you-new-tab/jjpokbgpiljgndebfoljdeihhkpcpfgl) [![](https://img.shields.io/chrome-web-store/rating/jjpokbgpiljgndebfoljdeihhkpcpfgl.svg)](https://chrome.google.com/webstore/detail/mynt-material-you-new-tab/jjpokbgpiljgndebfoljdeihhkpcpfgl) [![](https://img.shields.io/chrome-web-store/users/jjpokbgpiljgndebfoljdeihhkpcpfgl.svg)](https://chrome.google.com/webstore/detail/mynt-material-you-new-tab/jjpokbgpiljgndebfoljdeihhkpcpfgl) ▪️ [![](https://img.shields.io/amo/v/mynt.svg)](https://addons.mozilla.org/en-US/firefox/addon/mynt/) [![](https://img.shields.io/amo/rating/mynt.svg)](https://addons.mozilla.org/en-US/firefox/addon/mynt/) [![](https://img.shields.io/amo/users/mynt.svg)](https://addons.mozilla.org/en-US/firefox/addon/mynt/) ▪️ [![](https://img.shields.io/badge/dynamic/json?label=edge%20add-on&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Flcgdmfjofmcblocogcabdpfidfbkblcd)](https://microsoftedge.microsoft.com/addons/detail/mynt-material-you-new-ta/lcgdmfjofmcblocogcabdpfidfbkblcd)
[![](https://img.shields.io/badge/dynamic/json?label=rating&suffix=/5&query=%24.averageRating&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Flcgdmfjofmcblocogcabdpfidfbkblcd)](https://microsoftedge.microsoft.com/addons/detail/mynt-material-you-new-ta/lcgdmfjofmcblocogcabdpfidfbkblcd)
[![](https://img.shields.io/badge/dynamic/json?label=users&query=%24.activeInstallCount&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Flcgdmfjofmcblocogcabdpfidfbkblcd)](https://microsoftedge.microsoft.com/addons/detail/mynt-material-you-new-ta/lcgdmfjofmcblocogcabdpfidfbkblcd)

</div>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation-guide">Installation Guide</a> •
  <a href="#download">Download</a> •
  <a href="#-currently-supported-languages-32">Currently Supported Languages</a>
<br>
  <a href="#-contributing">Contributing</a> •
  <a href="#-star-history">Star History</a> •
  <a href="#-issues-and-support">Issues and Support</a> •
  <a href="#-privacy-policy">Privacy Policy</a> •
  <a href="#-license">License</a>
</p>

<img src="https://i.postimg.cc/CF43Yzj1/material-you-new-Tab-poster.webp" alt="Screenshot 1" width="100%">

#### 🔴 🟡 🟢 Test live: [https://prem-k-r.github.io/MaterialYouNewTab/](https://prem-k-r.github.io/MaterialYouNewTab/)

## 🔄 Recent Refactorings & Bug Fixes (Old vs New)

Here is a summary of the key bug fixes and code improvements made to **MYNT**:

| Category / Component | ❌ Old Behavior (Issues) | 🟢 New Behavior (Improvements) |
| :--- | :--- | :--- |
| **Brave Search Bar Overlay** | Brave Browser's native heuristics matched the search input tag ID (`searchQ`), overlaying Brave's own address-bar dropdown directly over the custom Material You search dropdown. | Renamed input element ID to `mainInput` across HTML, CSS, and JavaScript. This successfully evades Brave's heuristic parser, ensuring our custom theme-matching picker remains fully visible. |
| **Multi-Digit Engines Support** | The engine ID extractor parsed single-digit IDs (`"engine5" -> "5"`) using `.charAt(length - 1)`. This broke for double-digit engines like Stack Overflow (`"engine10"`) and Scholar (`"engine11"`), returning `"0"` and `"1"`, which crashed on data-attributes queries. | Replaced with `.replace("engine", "")` string substitution. Multi-digit search engines are now fully supported, validate correctly, and load with robust recovery logic. |
| **Google Search Selection** | Selecting Google (`engine1`) from the search dropdown resulted in fatal JS script execution crashes because Google does not have a companion radio button in the settings panel to mark `checked`. | Added strict presence checks inside the event handlers. Google selections are now safely stored, validated, and applied without trying to modify non-existent elements. |
| **Empty Edit Shortcuts View** | Opening "Manage" under Edit Shortcuts showed a completely empty sidebar page. This was because the active tab defaulted to `"folders"` (Workspaces & Folders), which was empty. | Defaults the initial settings view to `"shortcuts"` tab and programmatically triggers a click on `"shortcuts"` on slide-in, showing saved shortcuts instantly. |
| **shortcuts.js scoping crash** | Fails to initialize on page load with `ReferenceError: currentLanguage is not defined` because it was not in the scope of `shortcuts.js`. | Declares `currentLanguage` locally inside the `DOMContentLoaded` block in `shortcuts.js`, resolving the crash. |
| **Edit Shortcuts positioning** | `#shortcutEditPage` was rendered outside `#optCont` as a direct child of `#menuCont`, defaulting to `position: static` which pushed the entire view far off-screen. | Defined `#shortcutEditPage` in `style.css` with `position: absolute; top: 0; left: 0; width: 100%; height: 100%;` with theme-matching background, custom scrollbars, and limits. |
| **Sidebar Page Transitions** | Opening pages utilized nested timers and race-prone CSS state changes, occasionally resulting in incomplete transitions or flickering frames. | Sets `display = "block"` instantly, triggers `offsetHeight` to force a browser reflow, and executes the slide transforms inside a unified `requestAnimationFrame` block for buttery-smooth animations. |

## ✨ Features

- **Integrated Search**: Search directly from the New Tab page using your preferred search engine — Google, DuckDuckGo, Bing, Brave Search, YouTube, Wikipedia, and more.
- **Customizable Themes**: Choose from a selection of dynamic Material You themes or use the built-in color picker to match your style.
- **Wallpaper**: Upload your own wallpapers or enable daily random images sourced from [Lorem Picsum](https://picsum.photos).
- **Personalized Greeting**: Add a custom message or your name, so you're greeted each time you open a new tab.
- **Clock & Time Display**: Choose between a modern analog or digital clock.
- **Live Weather Updates**: View real-time temperature, conditions, humidity, feels like, and max-min temperature values. Supports °C and °F with location customization.
- **Quick Shortcuts**: Access common platforms (YouTube, Email, WhatsApp, etc.) or add/edit your own custom shortcuts and folders for instant navigation.
- **AI Tools**: Open ChatGPT, Gemini, Copilot, Perplexity, Claude, DeepSeek, and more with one click.
- **Google Apps**: Quickly launch Gmail, Drive, Docs, and other Google services.
- **Browser Compatibility**: Supports all Chromium-based browsers, including **Chrome**, **Edge**, **Brave**, and **Opera**, as well as Firefox-based browsers like **Firefox** and **Zen**.

## 📥 Installation Guide

### Download

1. **Development Version** (v3.3.*)

    - **Clone the Repository**:
      Use the following command to clone the repository:

       ```bash
       git clone https://github.com/prem-k-r/MaterialYouNewTab.git
       ```

    - Alternatively, download the latest version as a ZIP file by clicking below:

      [![Download ZIP](https://img.shields.io/badge/Download-ZIP-blue.svg)](https://github.com/prem-k-r/MaterialYouNewTab/archive/refs/heads/main.zip)

    - You can also download the ZIP file by clicking on the Code button. On the repository page, look for a green button labeled **Code**. Click on the **Code** button, and in the dropdown menu, select **Download ZIP**.

2. **Stable Release** (v3.3)

<p align="center">
    <a href="https://github.com/prem-k-r/MaterialYouNewTab/releases/latest"><img src="https://github.com/user-attachments/assets/51048d6d-0b35-4f62-8351-4a3ea52d2213" alt="Download from GitHub" height="48" /></a>
    <a href="https://chromewebstore.google.com/detail/mynt-material-you-new-tab/jjpokbgpiljgndebfoljdeihhkpcpfgl"><img src="https://github.com/user-attachments/assets/7a829ba4-dcd0-452b-922a-5efacbfda498" alt="Download from Chrome Web Store" height="48" /></a>
    <a href="https://microsoftedge.microsoft.com/addons/detail/mynt-material-you-new-ta/lcgdmfjofmcblocogcabdpfidfbkblcd"><img src="https://github.com/user-attachments/assets/3ad87ccf-92bf-4dab-bdf4-6577c3305d54" alt="Download from Microsoft Edge" height="48" /></a>
    <a href="https://addons.mozilla.org/en-US/firefox/addon/mynt/"><img src="https://blog.mozilla.org/addons/files/2020/04/get-the-addon-fx-apr-2020.svg" alt="Download from Mozilla Add-ons" height="48" /></a>
</p>

---

### Installation

#### ![Chromium](https://img.icons8.com/?size=20&id=104996&format=png&color=000000) Chromium-Based Browsers

1. **Install from [Chrome Web Store](https://chromewebstore.google.com/detail/mynt-material-you-new-tab/jjpokbgpiljgndebfoljdeihhkpcpfgl) or [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/mynt-material-you-new-ta/lcgdmfjofmcblocogcabdpfidfbkblcd)**:

   **Or** follow the manual steps below:

2. **Manual Installation**:

   - **Prepare the Extension Folder**:

     - Ensure you’ve cloned the repository or downloaded the ZIP file and extracted it.

   - **Open Extensions Page**:
     Open your preferred browser and enter the following text in the address bar:

     - ![Chrome](https://img.icons8.com/color/20/000000/chrome--v1.png) Chrome: `chrome://extensions`

     - ![Edge](https://img.icons8.com/?size=20&id=dGm9KIZPpukc&format=png&color=000000) Edge: `edge://extensions`

     - ![Brave](https://img.icons8.com/color/20/000000/brave-web-browser.png) Brave: `brave://extensions`

     - ![Opera](https://img.icons8.com/color/20/000000/opera--v1.png) Opera: `opera://extensions`

   - **Enable Developer Mode**:

     - Turn on **Developer Mode** in the extensions page.

   - **Load Unpacked Extension**:
     - Click on **Load unpacked** and select your extracted extension folder.

3. **Additional Steps ONLY for <img height="16" src="https://cdn.simpleicons.org/opera"/> Opera (or <img height="16" src="https://cdn.simpleicons.org/operagx"/> Opera GX)**:

> [!NOTE]
> Opera does **not support replacing the default New Tab**.  
> This method only sets the extension as a **startup page**.

<details><summary>Click here for the workaround</summary>

- Go to the **Settings**.
- Scroll to the **On startup** section (use the search option if needed).
- Click on **Open a specific page or set of pages** and then click on **Add a new page**.
- Add the following (replace 32-character extension ID if installed manually) to the **Site URL**:

```text
chrome-extension://jjpokbgpiljgndebfoljdeihhkpcpfgl/index.html
```

- To find the extension ID:

  - Go to `opera://extensions`, find the extension, and copy the 32-character ID from its details.

- To simulate new tabs:

  - Bookmark the extension page to access new tab pages manually.

  - Or, right-click the tab and select **Duplicate tab**.

</details>

Below are screenshots of the process to guide you through each step visually.

<img src="https://i.postimg.cc/w6JYypvc/chrome.png" alt="Screenshot 1" width="569">
<img src="https://i.postimg.cc/0ksR7BKg/edge.png" alt="Screenshot 2" width="569">
<img src="https://i.postimg.cc/MqPSg5NR/brave.png" alt="Screenshot 3" width="569">

---

#### ![Firefox](https://img.icons8.com/color/20/000000/firefox--v1.png) Firefox

1. **Install from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/mynt/)**

   <img src="https://i.postimg.cc/bPW2fHX7/FireFox.png" alt="Screenshot" width="569">

2. **Update the Homepage**:

   - Open Firefox and **obtain the UUID**:
      - Hover over the New Tab button (next to the tab close button). A tooltip will display the extension's unique ID, which looks like this: `0f31e1c1-d63c-4660-b950-8bfbda3bb20a`. Copy or note this ID.
      - Alternatively, type `about:debugging#/runtime/this-firefox` in the address bar and find the extension's UUID there.
   - Open **Settings** and navigate to **Home**, or type `about:preferences#home` in the address bar.
   - Under the **Homepage and new windows** section, select **Custom URLs...**.
   - Paste the following URL, replacing the ID with your actual UUID:

     ```text
     moz-extension://e31d6701-f699-414f-bb4c-8fde495c432e/index.html
     ```

   - This will update both your homepage and new tab to the extension.
  
3. **Additional Steps ONLY for Zen Browser** <img height="16" src="https://cdn.simpleicons.org/zenbrowser"/> :

   - Open a new tab and go to `about:config`.
   - Accept the risk and continue if prompted.
   - In the search bar, type:

     ```text
     zen.urlbar.replace-newtab
     ```

   - Set its value to **false** by clicking the toggle icon.

   This ensures the browser does not override the custom New Tab page set by the extension.

4. **Manual Installation (Temporary)**:

   - Clone the repository or download and extract the ZIP file.
   - **Prepare the Manifest**:

     - Delete the existing `manifest.json` file.
     - Rename `manifest(firefox).json` to `manifest.json`.

   - **Load Temporary Add-on**:
     - Go to `about:debugging#/runtime/this-firefox`, select **"This Firefox"**, then click **Load Temporary Add-on**.
     - Browse and select the updated `manifest.json`.

---

<!-- ### Installation Video

For a step-by-step walkthrough, watch this [installation guide video](https://youtu.be/P4ryQPixfw8).

[![Watch the video](https://img.youtube.com/vi/P4ryQPixfw8/0.jpg)](https://youtu.be/P4ryQPixfw8) -->

## 🌐 Currently Supported Languages (1)

Currently, the extension supports English out-of-the-box:

| Language | Code | Translator(s) |
| --- | :---: | --- |
| <img src='https://flagcdn.com/us.svg' width=20> &nbsp; **English** | en | [XengShi](https://github.com/XengShi/), [Prem](https://github.com/prem-k-r/) |

If you would like to help translate MYNT into your language, feel free to open a pull request or check out the [CONTRIBUTING.md](./CONTRIBUTING.md) guide.

## 🤝 Contributing

Contributions are welcome! If you’d like to contribute:

1. Follow the guidelines in the [CONTRIBUTING.md](./CONTRIBUTING.md) file.
2. Fork the repository.
3. Create a new branch: `git checkout -b feature/YourFeature`.
4. Commit your changes: `git commit -m 'Add Your Feature'`.
5. Push to the branch: `git push origin feature/YourFeature`.
6. Open a pull request.

## ⭐ Star History

Here is the star history chart for the **MYNT: Material You New Tab** repository. It shows the growth of stars over time, reflecting the increasing interest and support for the project.

<a href="https://star-history.com/#prem-k-r/MaterialYouNewTab&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=prem-k-r/MaterialYouNewTab&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=prem-k-r/MaterialYouNewTab&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=prem-k-r/MaterialYouNewTab&type=Date" />
 </picture>
</a>

## ❓ Issues and Support

- If you encounter any issues or bugs, feel free to open an issue on [GitHub](https://github.com/prem-k-r/MaterialYouNewTab/issues).
- For general questions or support, you can contact the repository maintainers through the **Telegram group**: [Join here](https://t.me/Material_You_NewTab).

## 🛡 Privacy Policy

MYNT: Material You New Tab prioritizes your privacy and is focused solely on providing a better browsing experience.
We make the following commitments:

- **No commercialization** — absolutely no ads, paid features, or premium tiers
- **No trackers** — no data collection, analytics, or background reporting of any kind
- **No access to personal information** — all settings, cache, and preferences are stored locally in your browser

For more details, read our [Privacy Policy](https://prem-k-r.github.io/MaterialYouNewTab/privacy-policy.html).

## 📜 License

Copyright (C) 2024-2026 Prem Kumar

Copyright (C) 2023-2025 XengShi

> This extension is the continuation of XengShi's Material You NewTab [(_Learn more_)](https://github.com/prem-k-r/MaterialYouNewTab/discussions/28#discussioncomment-13837571).

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). This means you must **not** distribute this software, whether original or modified, to any platform **without** its source code or the reference to its original source code. See the [LICENSE](https://github.com/prem-k-r/MaterialYouNewTab/blob/main/LICENSE) file for details.
