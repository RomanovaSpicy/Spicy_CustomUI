# SpicyChat UI Customizer & Logic Core

A set of user scripts designed to enhance and customize the chat interface on [SpicyChat.ai](https://spicychat.ai/).

**Author:** Sophie Romanova

[💖 Support on Boosty](https://boosty.to/romanovasophie/donate)
---

## 📜 Brief Description & Features

This project consists of **three** scripts:

1.  **`SpicyChat Logic Core`** (`Logic_Core/SpicyChat_Logic_Core.user.js`)
    *   **Foundation:** Adds necessary technical labels (data-attributes) to elements on the SpicyChat website.
    *   **Indicator:** Displays a logo in the corner of the screen, showing that the core is active.
    *   **Update Check:** Notifies the user about new versions of the Logic Core itself.
    *   **Required** for the `UI Customizer` and `Accessibility Enhancer` to function.

2.  **`SpicyChat UI Customizer`** (`UI_Customizer/SpicyChat_UI_Customizer.user.js`)
    *   **Customization:** Allows users to change the font size of messages and apply various **visual themes** (not specifically designed for accessibility).
    *   **Persistence:** Remembers the selected font size and theme across sessions.
    *   **Control:** Settings are accessible via the clickable Logic Core logo.
    *   **Requires `SpicyChat Logic Core`.**
    *   **Conflicts with `Accessibility Enhancer`. Choose only one.**

3.  **`SpicyChat Accessibility Enhancer` [Beta]** (`Accessibility_Enhancer[Beta]/SpicyChat_Accessibility_Enhancer.js`)
    *   **Accessibility:** Improves the interface for users with visual impairments.
    *   **Themes:** Provides a collection of **specialized themes** designed for color blindness (Deuteranopia, Protanopia, Tritanopia), photosensitivity, and low vision (high contrast).
    *   **Customization:** Allows users to change the font size of messages.
    *   **Persistence:** Remembers the selected font size and theme across sessions (uses the same storage as UI Customizer).
    *   **Control:** Settings are accessible via the clickable Logic Core logo.
    *   **Requires `SpicyChat Logic Core`.**
    *   **Conflicts with `UI Customizer`. Choose only one.**
    *   **Status:** Beta.

**Main Features (depending on script chosen):**

*   ✅ Adjust message font size (10px - 36px).
*   🎨 Apply various interface themes (Visual themes in *UI Customizer*, Accessibility themes in *Accessibility Enhancer*).
*   💾 Automatically saves your preferences.
*   🖱️ Convenient access to settings via the indicator logo.
*   ♿ Specialized themes for visual accessibility needs in the *Accessibility Enhancer*.

---

## 🚀 Installation Instructions

**Step 1: Install a Userscript Manager**

You need a browser extension that can manage userscripts. Choose one of the following:

*   [Tampermonkey](https://www.tampermonkey.net/) (Recommended for Chrome, Firefox, Edge, Opera)
*   [Violentmonkey](https://violentmonkey.github.io/) (A great alternative)

Install the extension for your browser if you don't have one already.

**Step 2: Install SpicyChat Logic Core (REQUIRED)**

*   **Click the link:** [`SpicyChat_Logic_Core.user.js` (Raw Install Link)](https://raw.githubusercontent.com/RomanovaSpicy/Spicy_CustomUI/main/Logic_Core/SpicyChat_Logic_Core.user.js)
*   Your userscript manager (Tampermonkey/Violentmonkey) should automatically open the installation page.
*   Click the **"Install"** button.

**Step 3: Install *ONE* Interface Script (UI Customizer *OR* Accessibility Enhancer)**

**IMPORTANT:** Do **NOT** install both `SpicyChat UI Customizer` and `SpicyChat Accessibility Enhancer` simultaneously. They control the same settings and will conflict. Choose **ONE** based on your needs.

*   **Option A: For General Visual Themes**
    *   **Click:** [`SpicyChat_UI_Customizer.user.js` (Raw Install Link)](https://raw.githubusercontent.com/RomanovaSpicy/Spicy_CustomUI/main/UI_Customizer/SpicyChat_UI_Customizer.user.js)
    *   Click **"Install"** in the userscript manager.

*   **Option B: For Accessibility Themes [Beta]**
    *   **Click:** [`SpicyChat_Accessibility_Enhancer.js` (Raw Install Link)](https://raw.githubusercontent.com/RomanovaSpicy/Spicy_CustomUI/main/Accessibility_Enhancer%5BBeta%5D/SpicyChat_Accessibility_Enhancer.js)
    *   Click **"Install"** in the userscript manager.

**Step 4: Done!**

*   **Refresh** the SpicyChat chat page (F5 or Ctrl+R).
*   A logo should appear in the bottom-right corner. Click it to access the settings panel for the script you installed in Step 3.

---

## ❓ FAQ (Frequently Asked Questions)

*   **Q: Why are there separate scripts (`Logic Core`, `UI Customizer`, `Accessibility Enhancer`)?**
    *   **A:** The `Logic Core` provides the essential foundation (element tagging) used by both interface scripts. Separating the `UI Customizer` (visual themes) and `Accessibility Enhancer` (accessibility themes) allows users to choose the specific functionality they need without loading unnecessary code. It also simplifies maintenance.

*   **Q: Can I use both the `UI Customizer` and the `Accessibility Enhancer` at the same time?**
    *   **A: No.** They modify the same parts of the interface and use the same settings storage keys (`scUICustomizer_Theme_v1`, `scUICustomizer_FontSize_v1`). Installing both will cause conflicts and unpredictable results. Please choose **one** based on your needs and ensure the other is disabled or uninstalled in your userscript manager.

*   **Q: The logo in the corner isn't showing up / The script isn't working.**
    *   **A:**
        1.  Ensure `Logic Core` is installed and enabled.
        2.  Ensure EITHER `UI Customizer` OR `Accessibility Enhancer` (not both!) is installed and enabled.
        3.  Refresh the SpicyChat page (F5 or Ctrl+R). Allow a few seconds for the page and scripts to load.
        4.  Check the browser console (F12 -> Console) for any errors related to the scripts.

*   **Q: My settings (font/theme) aren't being saved.**
    *   **A:** Make sure your userscript manager has permission to store data (`GM_setValue`, `GM_getValue`). This is usually requested during script installation. Check the extension's settings.

*   **Q: How do I update the scripts?**
    *   **A:** The `Logic Core` has a built-in update check and will notify you. The `UI Customizer` and `Accessibility Enhancer` can be updated via your userscript manager's dashboard (look for a "Check for userscript updates" button) or by reinstalling using the links in Step 3.

*   **Q: SpicyChat updated their website, and the script stopped working correctly.**
    *   **A:** This can happen. The scripts depend on the website's structure. If significant changes occur, the scripts (especially `Logic Core` and the `Dictionary`) might need updates. Check this repository for newer versions or contact the author.

*   **Q: Can I suggest a theme or an idea?**
    *   **A:** Yes, please contact the author via Discord (see below). Feedback, especially on the Accessibility Enhancer [Beta], is welcome.

---

## 📞 Contact

*   **Discord:** `@encode_your`

---

## 📄 License (Terms of Use)

These scripts are provided "AS IS", without warranty of any kind.

*   You are free to use, copy, modify, and distribute these scripts for personal, non-commercial purposes.
*   If you distribute modified versions, please link back to the original repository and note the changes made.
*   The author is not responsible for any potential damage or issues arising from the use of these scripts. Use at your own risk.
