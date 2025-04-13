# SpicyChat UI Customizer & Logic Core

A set of user scripts designed to enhance and customize the chat interface on [SpicyChat.ai](https://spicychat.ai/).

**Author:** Sophie Romanova

---

## 📜 Brief Description & Features

This project consists of two scripts:

1.  **SpicyChat Logic Core:**
    *   **Foundation:** Adds necessary technical labels (data-attributes) to elements on the SpicyChat website.
    *   **Indicator:** Displays a logo in the corner of the screen, showing that the core is active.
    *   **Update Check:** Notifies the user about new versions of the Logic Core itself.
    *   **Required** for the UI Customizer to function.

2.  **SpicyChat UI Customizer:**
    *   **Customization:** Allows users to change the font size of messages.
    *   **Themes:** Provides a collection of pre-made visual themes for the chat interface.
    *   **Persistence:** Remembers the selected font size and theme across sessions.
    *   **Control:** Settings are accessible via the clickable Logic Core logo.

**Main Features:**

*   ✅ Adjust message font size (8px - 32px).
*   🎨 Apply various interface themes (including dark versions of popular styles).
*   💾 Automatically saves your preferences.
*   🖱️ Convenient access to settings via the indicator logo.

---

## 🚀 Installation Instructions

**Step 1: Install a Userscript Manager**

You need a browser extension that can manage userscripts. Choose one of the following:

*   [Tampermonkey](https://www.tampermonkey.net/) (Recommended for Chrome, Firefox, Edge, Opera)
*   [Violentmonkey](https://violentmonkey.github.io/) (A great alternative)

Install the extension for your browser if you don't have one already.

**Step 2: Install SpicyChat Logic Core (REQUIRED)**

*   **Click the link:** [`SpicyChat_Logic_Core.user.js`](https://github.com/RomanovaSpicy/Spicy_CustomUI/raw/refs/heads/main/Core/SpicyChat_Logic_Core.user.js)
*   Your userscript manager (Tampermonkey/Violentmonkey) should automatically open the installation page.
*   Click the **"Install"** button.

**Step 3: Install SpicyChat UI Customizer**

*   **Click the link:** [`SpicyChat_UI_Customizer.user.js`](https://github.com/RomanovaSpicy/Spicy_CustomUI/raw/refs/heads/main/UI_Customizer/SpicyChat_UI_Customizer.user.js)
*   The userscript manager will again open the installation page.
*   Click the **"Install"** button.

**Step 4: Done!**

*   **Refresh** the SpicyChat chat page (F5 or Ctrl+R).
*   A logo should appear in the bottom-right corner. Click it to access the Customizer settings.

---

## ❓ FAQ (Frequently Asked Questions)

*   **Q: Why are there two separate scripts? Can't they be combined?**
    *   **A:** The `Logic Core` handles the basic element tagging, which could potentially be useful for other scripts too. The `UI Customizer` uses these tags to apply styles. This separation simplifies maintenance and potential future extensions. The `Logic Core` is updated less frequently but serves as the foundation.

*   **Q: The logo in the corner isn't showing up. / The script isn't working.**
    *   **A:** Ensure both scripts (`Logic Core` and `UI Customizer`) are installed and **enabled** in your userscript manager (Tampermonkey/Violentmonkey). Refresh the SpicyChat page (F5). Sometimes the site needs a moment to fully load; wait a few seconds. Check the browser console (F12 -> Console) for any errors.

*   **Q: My settings (font/theme) aren't being saved.**
    *   **A:** Make sure your userscript manager has permission to store data (`GM_setValue`, `GM_getValue`). This permission is usually requested during script installation. Check the extension's settings.

*   **Q: How do I update the scripts?**
    *   **A:** The `Logic Core` has a built-in update check and will show a notification if a new version is available (with a link to GitHub). The `UI Customizer` can be updated manually through your userscript manager's dashboard (there's usually a "Check for userscript updates" button) or by reinstalling it using the link from Step 3.

*   **Q: SpicyChat updated their website, and the script stopped working correctly.**
    *   **A:** This can happen. The scripts depend on the website's current structure. If significant changes occur, the scripts might need adaptation. Look for updates in this repository or contact the author.

*   **Q: Can I suggest a theme or an idea?**
    *   **A:** Yes, please contact the author via Discord (see below).

---

## 📞 Contact

*   **Discord:** `@encode_your`

---

## 📄 License (Terms of Use)

These scripts are provided "AS IS", without warranty of any kind.

*   You are free to use, copy, modify, and distribute these scripts for personal, non-commercial purposes.
*   If you distribute modified versions, please link back to the original repository and note the changes made.
*   The author is not responsible for any potential damage or issues arising from the use of these scripts. Use at your own risk.
