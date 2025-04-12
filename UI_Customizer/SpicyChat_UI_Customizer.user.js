// ==UserScript==
// @name         SpicyChat UI Customizer
// @namespace    http://tampermonkey.net/
// @version      0.9.4
// @description  Customize SpicyChat font size and themes. Requires 'SpicyChat Logic Core'.
// @author       Discord: @encode_your, SpicyChat: @sophieaaa
// @match        https://spicychat.ai/chat/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_info
// @updateURL    https://github.com/RomanovaSpicy/Spicy_CustomUI/raw/refs/heads/main/UI_Customizer/SpicyChat_UI_Customizer.user.js
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // --- IDs & Storage Keys ---
    const LOGO_ID = 'sc-persistent-logo';
    const POPUP_ID = 'sc-ui-customizer-popup';
    const DYNAMIC_STYLE_ID = 'sc-dynamic-customizer-style';
    const THEME_STYLE_ID = 'sc-current-theme-style';
    const VIEW_SETTINGS_ID = 'sc-view-settings';
    const VIEW_THEMES_ID = 'sc-view-themes';
    const FONT_SLIDER_ID = 'sc-fontsize-slider';
    const FONT_VALUE_ID = 'sc-fontsize-value';
    const THEME_DISPLAY_ID = 'sc-current-theme-name';
    const CHANGE_THEME_BTN_ID = 'sc-change-theme-btn';
    const RESET_BTN_ID = 'sc-reset-settings-btn';
    const THEME_LIST_ID = 'sc-theme-list-container';
    const BACK_BTN_ID = 'sc-back-to-settings-btn';
    const STORAGE_THEME_KEY = 'scUICustomizer_Theme_v1';
    const STORAGE_FONT_SIZE_KEY = 'scUICustomizer_FontSize_v1';

    // --- Default Settings ---
    const DEFAULT_FONT_SIZE = 14;
    const DEFAULT_THEME_KEY = 'nordic_night_v2';

    // --- Theme Definitions ---
    const themes = {
        'nordic_night_v2': {
            name: '❄️ Nordic Night v2',
            description: 'Refined Nord theme. High contrast text, cool tones, subtle gradients.',
            css: `
                :root {
                    --nord-bg0: #292E39; --nord-bg1: #353C4A; --nord-bg2: #404859; --nord-bg3: #4C566A;
                    --nord-text-main: #ECEFF4; --nord-text-italic: #88C0D0; --nord-text-quote: #A3B6CC;
                    --nord-fg0: #ECEFF4; --nord-fg1: #E5E9F0; --nord-fg2: #D8DEE9; --nord-fg-dim: #A3B6CC;
                    --nord-frost1: #8FBCBB; --nord-frost2: #88C0D0; --nord-frost3: #81A1C1; --nord-frost4: #5E81AC;
                    --nord-red: #BF616A; --nord-yellow: #EBCB8B;
                    --nord-shadow-light: rgba(0, 0, 0, 0.15); --nord-shadow-medium: rgba(0, 0, 0, 0.3);
                }
                html.dark body { background: linear-gradient(175deg, var(--nord-bg0), #242933) !important; background-attachment: fixed !important; font-family: 'Inter', sans-serif; }
                html.dark body::before { display: none !important; }
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { background-color: transparent !important; scrollbar-width: thin !important; scrollbar-color: var(--nord-bg3) transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar, [data-ui-component="SideNavBar"]::-webkit-scrollbar { width: 8px !important; height: 8px !important; background-color: transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-track, [data-ui-component="SideNavBar"]::-webkit-scrollbar-track { background: rgba(41, 46, 57, 0.3) !important; border-radius: 4px !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--nord-bg3) !important; border-radius: 4px !important; border: 1px solid var(--nord-bg0) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--nord-frost4) !important; border-color: var(--nord-bg1) !important; }
                [data-ui-component="ChatHeaderBar"] { background: var(--nord-bg1) !important; border-bottom: 1px solid rgba(143, 188, 187, 0.1) !important; box-shadow: 0 2px 6px var(--nord-shadow-medium); padding: 6px 0 !important; }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: var(--nord-fg1) !important; font-weight: 500; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--nord-fg-dim) !important; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--nord-frost2) !important; }
                [data-ui-component="SideNavBar"] { background: linear-gradient(to bottom, var(--nord-bg1), var(--nord-bg0)) !important; border-right: 1px solid rgba(143, 188, 187, 0.1) !important; box-shadow: 1px 0 5px var(--nord-shadow-medium); }
                [data-ui-component^="SideNav"] button { color: var(--nord-fg-dim) !important; transition: background-color 0.2s ease, color 0.2s ease; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--nord-frost4) !important; color: var(--nord-fg0) !important; }
                [data-ui-component^="SideNav"] button svg { stroke: var(--nord-fg-dim) !important; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: var(--nord-fg0) !important; }
                [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] { border: 1px solid transparent !important; border-radius: 10px !important; padding: 0.9rem 1.2rem !important; margin-bottom: 1.1rem !important; box-shadow: 0 3px 8px var(--nord-shadow-light), inset 0 1px 2px rgba(255, 255, 255, 0.03) !important; transition: box-shadow 0.2s ease; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { box-shadow: 0 4px 12px var(--nord-shadow-medium), inset 0 1px 2px rgba(255, 255, 255, 0.03) !important; }
                [data-ui-component="BotMessageContainer"] { background-color: var(--nord-bg1) !important; border-left: 3px solid var(--nord-frost2) !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--nord-bg0) !important; border-left: 3px solid var(--nord-frost3) !important; }
                [data-ui-component="ChatHeroInnerContainer"] { background: linear-gradient(140deg, var(--nord-bg1), var(--nord-bg2)); border: 1px solid rgba(143, 188, 187, 0.1) !important; }
                [data-ui-component="MessageSenderName"] { color: var(--nord-fg2) !important; font-weight: 600; margin-bottom: 2px; }
                [data-ui-component="MessageTextSpan"] { color: var(--nord-text-main) !important; line-height: inherit !important; }
                [data-ui-component="MessageTextSpan"] > em { color: var(--nord-text-italic) !important; font-style: italic !important; }
                [data-ui-component="MessageTextSpan"] > q { color: var(--nord-text-quote) !important; font-style: italic !important; opacity: 0.9; }
                [data-ui-component="MessageAvatarImage"] { border-radius: 50% !important; box-shadow: 0 0 3px rgba(0,0,0,0.2); }
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--nord-fg-dim) !important; transition: stroke 0.2s ease; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--nord-frost2) !important; }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: var(--nord-yellow) !important; stroke: var(--nord-yellow) !important; }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button']:hover svg { filter: brightness(1.1); }
                [data-ui-component="ChatInputBarContainer"] { background-color: transparent !important; border-top: none !important; padding: 5px 10px 15px 10px !important; }
                [data-ui-component="ChatInputBarInnerContainer"] { padding: 0 !important; }
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--nord-bg0) !important; border: 1px solid var(--nord-bg2) !important; border-radius: 12px !important; box-shadow: inset 0 1px 3px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.03); margin: 0 !important; padding: 2px 8px !important; transition: border-color 0.2s ease, box-shadow 0.2s ease; display: flex !important; align-items: center; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--nord-frost2) !important; box-shadow: inset 0 1px 3px rgba(0,0,0,0.2), 0 0 0 3px rgba(136, 192, 208, 0.2); }
                [data-ui-component="MessageInputTextarea"] { color: var(--nord-fg1) !important; caret-color: var(--nord-frost2); background: transparent !important; padding: 8px 5px !important; flex-grow: 1; }
                [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--nord-fg-dim) !important; opacity: 0.6; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--nord-frost4) !important; border-radius: 8px !important; margin-left: 8px !important; padding: 6px !important; transition: background-color 0.2s ease; box-shadow: 0 1px 2px var(--nord-shadow-light); display: flex; align-items: center; justify-content: center; }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--nord-frost3) !important; }
                [data-ui-component="SendButtonIcon"] { stroke: var(--nord-fg0) !important; width: 20px; height: 20px; }
            `
        },
        'cyber_grid': {
            name: '💻 Cyber Grid',
            description: 'Dark interface with readable text and classic cyan/magenta accents.',
            css: `
                :root {
                    --cg-bg: #0A0A10; --cg-panel: #14141F; --cg-element: #1F1F2E; --cg-element-alt: #2A2A3D;
                    --cg-text-main: #DADAF0; --cg-text-italic: #00ACC1; --cg-text-quote: #9575CD;
                    --cg-text-dim: #8080A5;
                    --cg-cyan: #00FFFF; --cg-magenta: #FF00FF; --cg-green: #00FF80;
                    --cg-border: rgba(0, 255, 255, 0.25); --cg-border-focus: rgba(255, 0, 255, 0.4);
                    --cg-shadow: rgba(0, 0, 0, 0.5); --cg-glow-cyan: 0 0 8px rgba(0, 255, 255, 0.6); --cg-glow-magenta: 0 0 8px rgba(255, 0, 255, 0.6);
                    --cg-grid-color: rgba(0, 255, 255, 0.08);
                }
                html.dark body { background-color: var(--cg-bg) !important; font-family: 'Consolas', 'Monaco', monospace; background-image: linear-gradient(var(--cg-grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--cg-grid-color) 1px, transparent 1px); background-size: 20px 20px; background-position: -1px -1px; background-attachment: fixed; }
                html.dark body::before { display: none !important; }
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { background-color: transparent !important; scrollbar-width: thin !important; scrollbar-color: var(--cg-cyan) transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar, [data-ui-component="SideNavBar"]::-webkit-scrollbar { width: 6px !important; height: 6px !important; background-color: transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-track, [data-ui-component="SideNavBar"]::-webkit-scrollbar-track { background: rgba(10, 10, 16, 0.5) !important; border-radius: 0 !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--cg-cyan) !important; border-radius: 0 !important; box-shadow: var(--cg-glow-cyan); }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--cg-magenta) !important; box-shadow: var(--cg-glow-magenta); }
                [data-ui-component="ChatHeaderBar"] { background: linear-gradient(to right, var(--cg-panel), var(--cg-element)) !important; border-bottom: 1px solid var(--cg-border) !important; box-shadow: 0 2px 10px var(--cg-shadow); padding: 6px 0 !important; }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: var(--cg-text-main) !important; text-shadow: 0 0 3px var(--cg-cyan); }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--cg-text-dim) !important; transition: all 0.2s ease; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--cg-cyan) !important; filter: drop-shadow(0 0 3px var(--cg-cyan)); }
                [data-ui-component="SideNavBar"] { background: var(--cg-panel) !important; border-right: 1px solid var(--cg-border) !important; box-shadow: 1px 0 8px var(--cg-shadow); }
                [data-ui-component^="SideNav"] button { color: var(--cg-text-dim) !important; transition: all 0.2s ease; border-radius: 0 !important; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--cg-element) !important; color: var(--cg-cyan) !important; text-shadow: 0 0 4px var(--cg-cyan); }
                [data-ui-component^="SideNav"] button svg { stroke: var(--cg-text-dim) !important; transition: all 0.2s ease; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: var(--cg-cyan) !important; filter: drop-shadow(0 0 3px var(--cg-cyan)); }
                [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: var(--cg-element) !important; border: 1px solid var(--cg-border) !important; border-radius: 4px !important; padding: 0.9rem 1.2rem !important; margin-bottom: 1rem !important; box-shadow: inset 0 0 8px rgba(0, 255, 255, 0.05), 0 1px 5px var(--cg-shadow); transition: all 0.2s ease; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--cg-cyan) !important; box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.1), 0 2px 8px var(--cg-shadow), var(--cg-glow-cyan); }
                [data-ui-component="BotMessageContainer"] { border-left: 3px solid var(--cg-cyan) !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--cg-panel) !important; border-color: rgba(255, 0, 255, 0.25) !important; border-left: 3px solid var(--cg-magenta) !important; }
                [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--cg-border-focus) !important; box-shadow: inset 0 0 10px rgba(255, 0, 255, 0.1), 0 2px 8px var(--cg-shadow), var(--cg-glow-magenta); }
                [data-ui-component="ChatHeroInnerContainer"] { background: linear-gradient(140deg, var(--cg-element), var(--cg-element-alt)); border-color: var(--cg-border) !important; }
                [data-ui-component="MessageSenderName"] { color: var(--cg-text-dim) !important; font-weight: normal; }
                [data-ui-component="MessageTextSpan"] { color: var(--cg-text-main) !important; line-height: inherit !important; }
                [data-ui-component="MessageTextSpan"] > em { color: var(--cg-text-italic) !important; font-style: italic !important; }
                [data-ui-component="MessageTextSpan"] > q { color: var(--cg-text-quote) !important; font-style: italic !important; opacity: 0.9; }
                [data-ui-component="MessageAvatarImage"] { border-radius: 2px !important; border: 1px solid var(--cg-border); padding: 1px; }
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--cg-text-dim) !important; transition: all 0.2s ease; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--cg-cyan) !important; filter: drop-shadow(0 0 4px var(--cg-cyan)); }
                [data-ui-component="ChatInputBarContainer"] { background-color: transparent !important; border-top: none !important; padding: 5px 10px 15px 10px !important; }
                [data-ui-component="ChatInputBarInnerContainer"] { padding: 0 !important; }
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--cg-bg) !important; border: 1px solid var(--cg-border) !important; border-radius: 4px !important; box-shadow: inset 0 1px 4px rgba(0,0,0,0.4); margin: 0 !important; padding: 2px 8px !important; transition: all 0.2s ease; display: flex !important; align-items: center; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--cg-border-focus) !important; background-color: var(--cg-panel) !important; box-shadow: inset 0 1px 4px rgba(0,0,0,0.4), 0 0 0 2px rgba(255, 0, 255, 0.3), var(--cg-glow-magenta); }
                [data-ui-component="MessageInputTextarea"] { color: var(--cg-text-main) !important; caret-color: var(--cg-magenta); background: transparent !important; padding: 8px 5px !important; flex-grow: 1; }
                [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--cg-text-dim) !important; opacity: 0.7; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--cg-cyan) !important; border-radius: 4px !important; margin-left: 8px !important; padding: 6px !important; transition: all 0.2s ease; box-shadow: var(--cg-glow-cyan); display: flex; align-items: center; justify-content: center; border: none; }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--cg-magenta) !important; box-shadow: var(--cg-glow-magenta); }
                [data-ui-component="SendButtonIcon"] { stroke: var(--cg-bg) !important; width: 20px; height: 20px; }
            `
        },
        'aged_scroll': {
            name: '📜 Aged Scroll',
            description: 'Warm sepia tones, dark readable text on a textured paper background.',
            css: `
                :root {
                    --as-bg: #F3EFE5; --as-panel: #E8DACB; --as-element: #DBCAB8; --as-element-alt: #CFC0AD;
                    --as-text-main: #4F3A25; --as-text-italic: #785F48; --as-text-quote: #96826F;
                    --as-text-header: #483A2C; --as-text-dim: #8A7A6A;
                    --as-accent: #A58A6F; --as-accent-hover: #B89E84;
                    --as-border: rgba(93, 75, 58, 0.2); --as-border-light: rgba(93, 75, 58, 0.1);
                    --as-shadow: rgba(93, 75, 58, 0.15);
                    --as-paper-texture: repeating-linear-gradient(0deg, rgba(0,0,0,0.015), rgba(0,0,0,0.015) 1px, transparent 1px, transparent 3px);
                }
                html, html.dark { color-scheme: light; }
                html.dark body, html body { background-color: var(--as-bg) !important; background-image: var(--as-paper-texture) !important; font-family: 'Merriweather', serif; color: var(--as-text-main); }
                html.dark body::before { display: none !important; }
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { background-color: transparent !important; scrollbar-width: thin !important; scrollbar-color: var(--as-element-alt) var(--as-panel) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar, [data-ui-component="SideNavBar"]::-webkit-scrollbar { width: 10px !important; height: 10px !important; background-color: transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-track, [data-ui-component="SideNavBar"]::-webkit-scrollbar-track { background: var(--as-panel) !important; border-radius: 5px !important; border: 1px solid var(--as-border-light) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--as-element-alt) !important; border-radius: 5px !important; border: 1px solid var(--as-text-dim) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--as-accent) !important; }
                [data-ui-component="ChatHeaderBar"] { background: linear-gradient(to bottom, var(--as-panel), var(--as-element)) !important; border-bottom: 1px solid var(--as-border) !important; box-shadow: 0 2px 5px var(--as-shadow); padding: 6px 0 !important; }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: var(--as-text-header) !important; font-weight: 600; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--as-text-dim) !important; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--as-accent) !important; }
                [data-ui-component="SideNavBar"] { background: var(--as-panel) !important; border-right: 1px solid var(--as-border) !important; background-image: var(--as-paper-texture) !important; box-shadow: 1px 0 4px var(--as-shadow); }
                [data-ui-component^="SideNav"] button { color: var(--as-text-dim) !important; transition: background-color 0.2s ease, color 0.2s ease; border-radius: 4px !important; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--as-element-alt) !important; color: var(--as-text-header) !important; }
                [data-ui-component^="SideNav"] button svg { stroke: var(--as-text-dim) !important; transition: stroke 0.2s ease; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: var(--as-text-header) !important; }
                [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: var(--as-panel) !important; border: 1px solid var(--as-border-light) !important; background-image: var(--as-paper-texture) !important; border-radius: 6px !important; padding: 0.9rem 1.2rem !important; margin-bottom: 1rem !important; box-shadow: 0 1px 4px var(--as-shadow), inset 0 0 10px rgba(255,255,255,0.3); transition: box-shadow 0.2s ease, border-color 0.2s ease; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--as-border) !important; box-shadow: 0 2px 6px var(--as-shadow), inset 0 0 10px rgba(255,255,255,0.2); }
                [data-ui-component="BotMessageContainer"] { border-left: 3px solid var(--as-accent) !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--as-element) !important; border-left: 3px solid var(--as-element-alt) !important; }
                [data-ui-component="ChatHeroInnerContainer"] { background: linear-gradient(140deg, var(--as-panel), var(--as-element)); border-color: var(--as-border) !important; }
                [data-ui-component="MessageSenderName"] { color: var(--as-text-header) !important; font-weight: bold; }
                [data-ui-component="MessageTextSpan"] { color: var(--as-text-main) !important; line-height: inherit !important; }
                [data-ui-component="MessageTextSpan"] > em { color: var(--as-text-italic) !important; font-style: italic !important; }
                [data-ui-component="MessageTextSpan"] > q { color: var(--as-text-quote) !important; font-style: italic !important; opacity: 0.9; }
                [data-ui-component="MessageAvatarImage"] { border-radius: 50% !important; border: 1px solid var(--as-border); padding: 1px; }
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--as-text-dim) !important; transition: stroke 0.2s ease; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--as-accent) !important; }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: var(--as-accent-hover) !important; stroke: var(--as-accent-hover) !important; }
                [data-ui-component="ChatInputBarContainer"] { background-color: transparent !important; border-top: none !important; padding: 5px 10px 15px 10px !important; }
                [data-ui-component="ChatInputBarInnerContainer"] { padding: 0 !important; }
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--as-bg) !important; border: 1px solid var(--as-border) !important; border-radius: 8px !important; box-shadow: inset 0 1px 3px rgba(0,0,0,0.08); margin: 0 !important; padding: 2px 8px !important; transition: border-color 0.2s ease, box-shadow 0.2s ease; display: flex !important; align-items: center; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--as-accent) !important; background-color: #FFFDF9 !important; box-shadow: inset 0 1px 3px rgba(0,0,0,0.08), 0 0 0 2px rgba(165, 138, 111, 0.2); }
                [data-ui-component="MessageInputTextarea"] { color: var(--as-text-main) !important; caret-color: var(--as-accent); background: transparent !important; padding: 8px 5px !important; flex-grow: 1; }
                [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--as-text-dim) !important; opacity: 0.8; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--as-accent) !important; border-radius: 6px !important; margin-left: 8px !important; padding: 6px !important; transition: background-color 0.2s ease; box-shadow: 0 1px 2px var(--as-shadow); display: flex; align-items: center; justify-content: center; border: none; }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--as-accent-hover) !important; }
                [data-ui-component="SendButtonIcon"] { stroke: var(--as-bg) !important; width: 20px; height: 20px; }
            `
        },
        'emerald_depths': {
            name: '🌲 Emerald Depths',
            description: 'Rich greens and earthy tones, with clear contrasting text.',
            css: `
                :root {
                    --ed-bg-dark: #2A3D2F; --ed-bg-medium: #385140; --ed-bg-light: #4B6E54; --ed-panel: #304638;
                     /* === Text Colors - READABILITY FIRST === */
                    --ed-text-main: #E5F5E5;   /* Brightest green/white */
                    --ed-text-italic: #FFD700; /* Gold/Yellow for italics */
                    --ed-text-quote: #A0B8A0;  /* Dimmer green/grey */
                    /* Other Colors */
                    --ed-text-bright: #E8F5E8; --ed-text-medium: #B8D8B8; --ed-text-dim: #8AA78A;
                    --ed-green-accent: #8FBC8F; --ed-green-hover: #A3D3A3;
                    --ed-brown-accent: #A07F6A;
                    --ed-border: rgba(143, 188, 143, 0.2); --ed-border-focus: rgba(143, 188, 143, 0.4);
                    --ed-shadow: rgba(0, 0, 0, 0.3);
                }
                html.dark body { background: linear-gradient(175deg, var(--ed-bg-dark), #202E24) !important; background-attachment: fixed !important; font-family: 'Lato', sans-serif; }
                html.dark body::before { display: none !important; }
                /* ... (Rest of Emerald Depths CSS remains the same) ... */
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { background-color: transparent !important; scrollbar-width: thin !important; scrollbar-color: var(--ed-bg-light) transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar, [data-ui-component="SideNavBar"]::-webkit-scrollbar { width: 9px !important; height: 9px !important; background-color: transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-track, [data-ui-component="SideNavBar"]::-webkit-scrollbar-track { background: rgba(42, 61, 47, 0.3) !important; border-radius: 5px !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--ed-bg-light) !important; border-radius: 5px !important; border: 1px solid var(--ed-bg-dark) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--ed-green-accent) !important; border-color: var(--ed-panel) !important; }
                [data-ui-component="ChatHeaderBar"] { background: linear-gradient(to right, var(--ed-panel), var(--ed-bg-medium)) !important; border-bottom: 1px solid var(--ed-border) !important; box-shadow: 0 2px 7px var(--ed-shadow); padding: 6px 0 !important; }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: var(--ed-text-bright) !important; font-weight: 500; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--ed-text-dim) !important; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--ed-green-hover) !important; }
                [data-ui-component="SideNavBar"] { background: var(--ed-panel) !important; border-right: 1px solid var(--ed-border) !important; box-shadow: 1px 0 6px var(--ed-shadow); }
                [data-ui-component^="SideNav"] button { color: var(--ed-text-dim) !important; transition: background-color 0.2s ease, color 0.2s ease; border-radius: 4px !important; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--ed-green-accent) !important; color: var(--ed-bg-dark) !important; }
                [data-ui-component^="SideNav"] button svg { stroke: var(--ed-text-dim) !important; transition: stroke 0.2s ease; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: var(--ed-bg-dark) !important; }
                [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] { border: 1px solid var(--ed-border) !important; border-radius: 8px !important; padding: 0.9rem 1.2rem !important; margin-bottom: 1rem !important; box-shadow: 0 2px 6px var(--ed-shadow), inset 0 1px 1px rgba(255, 255, 255, 0.04); transition: box-shadow 0.2s ease, border-color 0.2s ease; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--ed-border-focus) !important; box-shadow: 0 3px 9px var(--ed-shadow), inset 0 1px 1px rgba(255, 255, 255, 0.04); }
                [data-ui-component="BotMessageContainer"] { background-color: var(--ed-bg-medium) !important; border-left: 3px solid var(--ed-green-accent) !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--ed-panel) !important; border-left: 3px solid var(--ed-brown-accent) !important; }
                [data-ui-component="ChatHeroInnerContainer"] { background: linear-gradient(140deg, var(--ed-bg-medium), var(--ed-panel)); border-color: var(--ed-border) !important; }

                /* === Message Content (Text Colors REFINED for Readability) === */
                [data-ui-component="MessageSenderName"] { color: var(--ed-text-medium) !important; font-weight: 600; }
                [data-ui-component="MessageTextSpan"] { color: var(--ed-text-main) !important; line-height: inherit !important; }
                [data-ui-component="MessageTextSpan"] > em { color: var(--ed-text-italic) !important; font-style: italic !important; }
                [data-ui-component="MessageTextSpan"] > q { color: var(--ed-text-quote) !important; font-style: italic !important; opacity: 0.9; }
                [data-ui-component="MessageAvatarImage"] { border-radius: 50% !important; border: 1px solid rgba(143, 188, 143, 0.3); }

                /* Message Action Buttons */
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--ed-text-dim) !important; transition: stroke 0.2s ease; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--ed-green-accent) !important; }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: var(--ed-brown-accent) !important; stroke: var(--ed-brown-accent) !important; }

                /* Input Bar */
                [data-ui-component="ChatInputBarContainer"] { background-color: transparent !important; border-top: none !important; padding: 5px 10px 15px 10px !important; }
                [data-ui-component="ChatInputBarInnerContainer"] { padding: 0 !important; }
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--ed-panel) !important; border: 1px solid var(--ed-border) !important; border-radius: 10px !important; box-shadow: inset 0 1px 3px rgba(0,0,0,0.2); margin: 0 !important; padding: 2px 8px !important; transition: border-color 0.2s ease, box-shadow 0.2s ease; display: flex !important; align-items: center; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--ed-border-focus) !important; background-color: var(--ed-bg-medium) !important; box-shadow: inset 0 1px 3px rgba(0,0,0,0.2), 0 0 0 3px rgba(143, 188, 143, 0.2); }
                [data-ui-component="MessageInputTextarea"] { color: var(--ed-text-bright) !important; caret-color: var(--ed-green-accent); background: transparent !important; padding: 8px 5px !important; flex-grow: 1; }
                [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--ed-text-dim) !important; opacity: 0.7; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--ed-green-accent) !important; border-radius: 8px !important; margin-left: 8px !important; padding: 6px !important; transition: background-color 0.2s ease; box-shadow: 0 1px 2px var(--ed-shadow); display: flex; align-items: center; justify-content: center; border: none; }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--ed-green-hover) !important; }
                [data-ui-component="SendButtonIcon"] { stroke: var(--ed-bg-dark) !important; width: 20px; height: 20px; }
            `
         },
        'scarlet_smoke': {
             name: '🍷 Scarlet Smoke',
             description: 'Deep greys and blacks with high-contrast text and red accents.',
             css: `
                :root {
                    --ss-bg-base: #18181C; --ss-bg-panel: #202025; --ss-bg-element: #2A2A30; --ss-bg-element-alt: #35353C;
                     /* === Text Colors - READABILITY FIRST === */
                    --ss-text-main: #EDEDF0;   /* Clean, bright off-white */
                    --ss-text-italic: #F48FB1; /* Soft Pink/Rose */
                    --ss-text-quote: #A8A8B0;  /* Neutral, dimmer grey */
                    /* Other Colors */
                    --ss-text-bright: #F0F0F5; --ss-text-medium: #C0C0C8; --ss-text-dim: #888890;
                    --ss-red-accent: #D83030; --ss-red-hover: #E54040; --ss-red-dim: #A02525;
                    --ss-border: rgba(200, 200, 210, 0.12); --ss-border-focus: rgba(216, 48, 48, 0.3);
                    --ss-shadow: rgba(0, 0, 0, 0.4); --ss-shadow-light: rgba(0, 0, 0, 0.25);
                    --ss-red-glow: 0 0 7px rgba(216, 48, 48, 0.4);
                }
                html.dark body { background: linear-gradient(175deg, var(--ss-bg-base), #101012) !important; background-attachment: fixed !important; font-family: 'Inter', sans-serif; }
                html.dark body::before { display: none !important; }
                /* ... (Rest of Scarlet Smoke CSS remains the same) ... */
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { background-color: transparent !important; scrollbar-width: thin !important; scrollbar-color: var(--ss-bg-element-alt) transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar, [data-ui-component="SideNavBar"]::-webkit-scrollbar { width: 7px !important; height: 7px !important; background-color: transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-track, [data-ui-component="SideNavBar"]::-webkit-scrollbar-track { background: rgba(24, 24, 28, 0.3) !important; border-radius: 4px !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--ss-bg-element-alt) !important; border-radius: 4px !important; border: 1px solid var(--ss-bg-base) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--ss-red-dim) !important; border-color: var(--ss-bg-panel) !important; }
                [data-ui-component="ChatHeaderBar"] { background: var(--ss-bg-panel) !important; border-bottom: 1px solid var(--ss-border) !important; box-shadow: 0 3px 8px var(--ss-shadow); padding: 6px 0 !important; }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: var(--ss-text-bright) !important; font-weight: 500; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--ss-text-dim) !important; transition: stroke 0.2s ease, filter 0.2s ease; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--ss-red-accent) !important; filter: drop-shadow(var(--ss-red-glow)); }
                [data-ui-component="SideNavBar"] { background: linear-gradient(to bottom, var(--ss-bg-panel), var(--ss-bg-base)) !important; border-right: 1px solid var(--ss-border) !important; box-shadow: 1px 0 7px var(--ss-shadow); }
                [data-ui-component^="SideNav"] button { color: var(--ss-text-dim) !important; transition: background-color 0.2s ease, color 0.2s ease; border-radius: 4px !important; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--ss-red-accent) !important; color: var(--ss-text-bright) !important; }
                [data-ui-component^="SideNav"] button svg { stroke: var(--ss-text-dim) !important; transition: stroke 0.2s ease; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: var(--ss-text-bright) !important; }
                [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: var(--ss-bg-panel) !important; border: 1px solid var(--ss-border) !important; border-radius: 8px !important; padding: 1rem 1.2rem !important; margin-bottom: 1rem !important; box-shadow: 0 2px 6px var(--ss-shadow-light), inset 0 1px 0 rgba(255, 255, 255, 0.02); transition: box-shadow 0.2s ease, border-color 0.2s ease; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--ss-border-focus) !important; box-shadow: 0 3px 9px var(--ss-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.02); }
                [data-ui-component="BotMessageContainer"] { border-left: 3px solid var(--ss-red-accent) !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--ss-bg-element) !important; border-left: 3px solid var(--ss-text-dim) !important; }
                [data-ui-component="ChatHeroInnerContainer"] { background: linear-gradient(140deg, var(--ss-bg-panel), var(--ss-bg-element)); border-color: var(--ss-border) !important; }

                /* === Message Content (Text Colors REFINED for Readability) === */
                [data-ui-component="MessageSenderName"] { color: var(--ss-text-medium) !important; font-weight: 600; }
                [data-ui-component="MessageTextSpan"] { color: var(--ss-text-main) !important; line-height: inherit !important; }
                [data-ui-component="MessageTextSpan"] > em { color: var(--ss-text-italic) !important; font-style: italic !important; }
                [data-ui-component="MessageTextSpan"] > q { color: var(--ss-text-quote) !important; font-style: italic !important; opacity: 0.85; }
                [data-ui-component="MessageAvatarImage"] { border-radius: 50% !important; border: 1px solid rgba(255, 255, 255, 0.05); }

                /* Message Action Buttons */
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--ss-text-dim) !important; transition: stroke 0.2s ease, filter 0.2s ease; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--ss-red-accent) !important; filter: drop-shadow(var(--ss-red-glow)); }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: var(--ss-red-hover) !important; stroke: var(--ss-red-hover) !important; filter: drop-shadow(var(--ss-red-glow)); }

                /* Input Bar */
                [data-ui-component="ChatInputBarContainer"] { background-color: transparent !important; border-top: none !important; padding: 5px 10px 15px 10px !important; }
                [data-ui-component="ChatInputBarInnerContainer"] { padding: 0 !important; }
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--ss-bg-base) !important; border: 1px solid var(--ss-border) !important; border-radius: 8px !important; box-shadow: inset 0 1px 3px rgba(0,0,0,0.3); margin: 0 !important; padding: 2px 8px !important; transition: border-color 0.2s ease, box-shadow 0.2s ease; display: flex !important; align-items: center; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--ss-border-focus) !important; background-color: var(--ss-bg-panel) !important; box-shadow: inset 0 1px 3px rgba(0,0,0,0.3), 0 0 0 2px rgba(216, 48, 48, 0.2); }
                [data-ui-component="MessageInputTextarea"] { color: var(--ss-text-bright) !important; caret-color: var(--ss-red-accent); background: transparent !important; padding: 8px 5px !important; flex-grow: 1; }
                [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--ss-text-dim) !important; opacity: 0.6; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--ss-red-accent) !important; border-radius: 6px !important; margin-left: 8px !important; padding: 6px !important; transition: background-color 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 1px 2px var(--ss-shadow-light), var(--ss-red-glow); display: flex; align-items: center; justify-content: center; border: none; }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--ss-red-hover) !important; box-shadow: 0 1px 3px var(--ss-shadow), 0 0 10px rgba(216, 48, 48, 0.6); }
                [data-ui-component="SendButtonIcon"] { stroke: var(--ss-text-bright) !important; width: 20px; height: 20px; }
             `
         }
    };
    // --- END OF THEME DEFINITIONS ---

    // --- State Variables --- (FROM 0.7.1-alpha)
    let logoElement, popupElement, dynamicStyleElement, themeStyleElement, settingsView, themesView,
        fontSlider, fontValue, themeDisplay,
        changeThemeBtn, resetBtn, themeListContainer, backBtn;
    let currentThemeKey = DEFAULT_THEME_KEY;
    let currentFontSize = DEFAULT_FONT_SIZE;
    let isInitialized = false;

    // --- GUI Structure (HTML - Font & Theme Only) --- (FROM 0.7.1-alpha)
    const popupHTML = `
        <div id="${VIEW_SETTINGS_ID}" style="display: block;"> <div class="customizer-header">UI Customizer</div> <div class="customizer-section"> <label for="${FONT_SLIDER_ID}">Message Font Size</label> <div class="slider-container"> <input type="range" id="${FONT_SLIDER_ID}" min="8" max="32" step="1"> <span id="${FONT_VALUE_ID}"></span> </div> </div> <div class="customizer-section theme-section"> <span>Current Theme: <strong id="${THEME_DISPLAY_ID}"></strong></span> <button id="${CHANGE_THEME_BTN_ID}" class="customizer-button">Change Theme</button> </div> <div class="customizer-footer"> <button id="${RESET_BTN_ID}" class="customizer-button secondary">Reset Font</button> </div> </div>
        <div id="${VIEW_THEMES_ID}" style="display: none;"> <div class="customizer-header">Choose Theme</div> <div id="${THEME_LIST_ID}" class="theme-list"></div> <div class="customizer-footer"> <button id="${BACK_BTN_ID}" class="customizer-button secondary">Back</button> </div> </div>
    `;

    // --- GUI Styles --- (FROM 0.9.0 - Refined version)
     const guiStyles = `
        #${POPUP_ID} { display: none !important; position: fixed !important; z-index: 100005 !important; top: 15px !important; right: 15px !important; bottom: auto !important; left: auto !important; background-color: rgba(44, 48, 56, 0.9) !important; color: #d8dee9 !important; border: 1px solid rgba(216, 222, 233, 0.1) !important; border-radius: 8px !important; width: 290px !important; padding: 12px 18px !important; font-size: 13px !important; font-family: 'Inter', sans-serif !important; box-shadow: 0 6px 25px rgba(0,0,0,0.5) !important; backdrop-filter: blur(6px) !important; transition: opacity 0.2s ease, transform 0.2s ease; opacity: 0; transform: translateY(10px); }
        #${POPUP_ID}.visible { display: block !important; opacity: 1; transform: translateY(0); }
        #${POPUP_ID} .customizer-header { font-size: 16px; font-weight: 600; text-align: center; margin: -12px -18px 15px -18px; padding: 12px 18px 10px 18px; border-bottom: 1px solid rgba(216, 222, 233, 0.1); background-color: rgba(59, 66, 82, 0.5); border-radius: 8px 8px 0 0; color: #eceff4; } # ${POPUP_ID} .customizer-section { margin-bottom: 18px; } # ${POPUP_ID} label { display: block; margin-bottom: 6px; font-weight: 500; color: #d8dee9; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; } # ${POPUP_ID} .slider-container { display: flex; align-items: center; gap: 12px; } # ${POPUP_ID} input[type="range"] { flex-grow: 1; cursor: pointer; -webkit-appearance: none; appearance: none; height: 6px; background: #434c5e; border-radius: 3px; outline: none; } # ${POPUP_ID} input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; background: #88c0d0; border-radius: 50%; cursor: pointer; border: 2px solid #3b4252; transition: background-color 0.15s ease; } # ${POPUP_ID} input[type="range"]::-moz-range-thumb { width: 16px; height: 16px; background: #88c0d0; border-radius: 50%; cursor: pointer; border: 2px solid #3b4252; transition: background-color 0.15s ease; } # ${POPUP_ID} input[type="range"]:hover::-webkit-slider-thumb { background-color: #99d1e1; } # ${POPUP_ID} input[type="range"]:hover::-moz-range-thumb { background-color: #99d1e1; } # ${POPUP_ID} span[id*="-value"] { min-width: 40px; text-align: right; font-family: monospace; font-size: 14px; font-weight: bold; color: #eceff4; } # ${POPUP_ID} .theme-section { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid rgba(216, 222, 233, 0.1); margin-top: 18px; } # ${POPUP_ID} .theme-section span { color: #d8dee9; font-size: 12px; } # ${POPUP_ID} .theme-section strong { color: #eceff4; font-weight: 600; } # ${POPUP_ID} .customizer-button { background-color: #5e81ac; color: #eceff4; border: none; border-radius: 5px; padding: 7px 14px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.2); } # ${POPUP_ID} .customizer-button:hover { background-color: #81a1c1; box-shadow: 0 2px 4px rgba(0,0,0,0.3); } # ${POPUP_ID} .customizer-button.secondary { background-color: #4c566a; color: #d8dee9; } # ${POPUP_ID} .customizer-button.secondary:hover { background-color: #5e6a7e; } # ${POPUP_ID} .customizer-footer { margin-top: 0; padding-top: 15px; border-top: 1px solid rgba(216, 222, 233, 0.1); text-align: center; } # ${POPUP_ID} #${THEME_LIST_ID} { max-height: 280px; overflow-y: auto; margin: 10px 0; padding-right: 5px; } # ${POPUP_ID} .theme-item { padding: 12px 15px; margin-bottom: 6px; border-radius: 6px; cursor: pointer; border: 1px solid transparent; background-color: rgba(59, 66, 82, 0.3); transition: background-color 0.2s ease, border-color 0.2s ease; } # ${POPUP_ID} .theme-item:hover { background-color: rgba(76, 86, 106, 0.5); border-color: #5e81ac; } # ${POPUP_ID} .theme-item-name { font-weight: 600; display: block; margin-bottom: 4px; color: #eceff4; } # ${POPUP_ID} .theme-item-desc { font-size: 12px; color: #d8dee9; opacity: 0.9; } # ${LOGO_ID} { cursor: pointer !important; pointer-events: auto !important; transition: transform 0.2s ease, opacity 0.2s ease !important; opacity: 0.7 !important; } # ${LOGO_ID}:hover { transform: scale(1.1) !important; opacity: 1 !important; }
    `;

    // --- Core Logic Functions --- (FROM 0.7.1-alpha)
    function applyDynamicStyles() { if (!dynamicStyleElement) { dynamicStyleElement = document.createElement('style'); dynamicStyleElement.id = DYNAMIC_STYLE_ID; document.head.appendChild(dynamicStyleElement); } const fontSize = `${currentFontSize}px`; const lineHeight = `${Math.round(currentFontSize * 1.6)}px`; dynamicStyleElement.textContent = `:root { --dynamic-font-size: ${fontSize}; --dynamic-line-height: ${lineHeight}; } [data-ui-component="MessageTextSpan"], [data-ui-component="MessageTextSpan"] > em, [data-ui-component="MessageTextSpan"] > q { font-size: var(--dynamic-font-size) !important; } [data-ui-component="MessageTextSpan"] { line-height: var(--dynamic-line-height) !important; } [data-ui-component="MessageInputTextarea"] { font-size: var(--dynamic-font-size) !important; }`; if (fontValue) fontValue.textContent = `${currentFontSize}px`; }
    function applyTheme(themeKey) { currentThemeKey = themes[themeKey] ? themeKey : DEFAULT_THEME_KEY; const theme = themes[currentThemeKey]; console.log(`Applying theme: "${theme.name}" (Key: ${currentThemeKey})`); if (!themeStyleElement) { themeStyleElement = document.createElement('style'); themeStyleElement.id = THEME_STYLE_ID; document.head.appendChild(themeStyleElement); } themeStyleElement.textContent = theme.css; if (themeDisplay) themeDisplay.textContent = theme.name; if (popupElement) popupElement.dataset.activeTheme = currentThemeKey; }
    async function saveSettings() { try { await GM_setValue(STORAGE_FONT_SIZE_KEY, currentFontSize); } catch (e) { console.error("Error saving font size:", e); } }
    async function saveTheme() { try { await GM_setValue(STORAGE_THEME_KEY, currentThemeKey); } catch (e) { console.error("Error saving theme:", e); } }
    async function loadSettings() { try { currentThemeKey = await GM_getValue(STORAGE_THEME_KEY, DEFAULT_THEME_KEY); currentFontSize = await GM_getValue(STORAGE_FONT_SIZE_KEY, DEFAULT_FONT_SIZE); currentFontSize = Math.max(8, Math.min(32, parseInt(currentFontSize, 10) || DEFAULT_FONT_SIZE)); if (!themes[currentThemeKey]) { console.warn(`Loaded theme key "${currentThemeKey}" not found. Using default (${DEFAULT_THEME_KEY}).`); currentThemeKey = DEFAULT_THEME_KEY; } } catch (e) { console.error("Error loading settings, using defaults:", e); currentThemeKey = DEFAULT_THEME_KEY; currentFontSize = DEFAULT_FONT_SIZE; } console.log(`Loaded Settings: Theme=${currentThemeKey}, Font=${currentFontSize}px`); }
    function resetSettings() { console.log("Resetting font size to default..."); currentFontSize = DEFAULT_FONT_SIZE; if (fontSlider) fontSlider.value = currentFontSize; applyDynamicStyles(); saveSettings(); }
    function populateThemeList() { if (!themeListContainer) return; themeListContainer.innerHTML = ''; for (const key in themes) { const theme = themes[key]; const item = document.createElement('div'); item.className = 'theme-item'; item.dataset.themeKey = key; item.innerHTML = `<span class="theme-item-name">${theme.name}</span> <span class="theme-item-desc">${theme.description}</span>`; item.addEventListener('click', () => { applyTheme(key); saveTheme(); switchView('settings'); }); themeListContainer.appendChild(item); } }
    function switchView(viewName) { if (!settingsView || !themesView) return; settingsView.style.display = (viewName === 'settings') ? 'block' : 'none'; themesView.style.display = (viewName === 'themes') ? 'block' : 'none'; }
    function togglePopup() { if (!popupElement) return; const isVisible = popupElement.classList.contains('visible'); if (!isVisible) { positionPopup(); void popupElement.offsetWidth; popupElement.classList.add('visible'); console.log("Popup opened"); } else { popupElement.classList.remove('visible'); popupElement.addEventListener('transitionend', () => { /* CSS handles display:none */ }, { once: true }); console.log("Popup closed"); } }
    function positionPopup() { if (!popupElement || !logoElement) return; popupElement.style.top = '15px'; popupElement.style.right = '15px'; popupElement.style.bottom = 'auto'; popupElement.style.left = 'auto'; }

    // --- Initialization --- (FROM 0.7.1-alpha, adapted slightly)
    async function initialize() {
        if (isInitialized) { console.log("SpicyChat UI Customizer (Font & Theme): Already initialized."); return; }
        console.log("SpicyChat UI Customizer (Font & Theme): Starting initialization (0.7.1 logic)...");
        logoElement = document.getElementById(LOGO_ID);
        if (!logoElement) { console.warn("Logo element not found. Retrying in 1s..."); setTimeout(initialize, 1000); return; }
        console.log("Logo element detected.");
        isInitialized = true; // Set flag early

        await loadSettings(); // Load settings first

        // Create or update popup
        if (!document.getElementById(POPUP_ID)) { popupElement = document.createElement('div'); popupElement.id = POPUP_ID; popupElement.innerHTML = popupHTML; document.body.appendChild(popupElement); }
        else { popupElement = document.getElementById(POPUP_ID); popupElement.innerHTML = popupHTML; }

        // Get element references
        settingsView = document.getElementById(VIEW_SETTINGS_ID); themesView = document.getElementById(VIEW_THEMES_ID); fontSlider = document.getElementById(FONT_SLIDER_ID); fontValue = document.getElementById(FONT_VALUE_ID); themeDisplay = document.getElementById(THEME_DISPLAY_ID); changeThemeBtn = document.getElementById(CHANGE_THEME_BTN_ID); resetBtn = document.getElementById(RESET_BTN_ID); themeListContainer = document.getElementById(THEME_LIST_ID); backBtn = document.getElementById(BACK_BTN_ID);

        // Check elements
        if (!settingsView || !themesView || !fontSlider || !fontValue || !themeDisplay || !changeThemeBtn || !resetBtn || !themeListContainer || !backBtn || !popupElement) { console.error("Initialization failed: Could not find all GUI elements! Check IDs in popupHTML."); if (popupElement) popupElement.remove(); isInitialized = false; return; }

        GM_addStyle(guiStyles);
        populateThemeList();

        // Set initial GUI control states
        fontSlider.value = currentFontSize;

        // Apply initial styles/theme AFTER loading settings
        applyTheme(currentThemeKey);
        applyDynamicStyles();

        // Add Event Listeners (Using dataset flags)
        if (!logoElement.dataset.customizerListener) { logoElement.addEventListener('click', (e) => { e.stopPropagation(); togglePopup(); }); logoElement.dataset.customizerListener = 'true'; }
        if (!fontSlider.dataset.listenerAdded) { fontSlider.addEventListener('input', () => { currentFontSize = fontSlider.value; applyDynamicStyles(); }); fontSlider.addEventListener('change', saveSettings); fontSlider.dataset.listenerAdded = 'true'; }
        if (!resetBtn.dataset.listenerAdded) { resetBtn.addEventListener('click', resetSettings); resetBtn.dataset.listenerAdded = 'true'; }
        if (!changeThemeBtn.dataset.listenerAdded) { changeThemeBtn.addEventListener('click', () => switchView('themes')); changeThemeBtn.dataset.listenerAdded = 'true'; }
        if (!backBtn.dataset.listenerAdded) { backBtn.addEventListener('click', () => switchView('settings')); backBtn.dataset.listenerAdded = 'true'; }
        if (!document.body.dataset.customizerPopupListener) { document.addEventListener('click', (event) => { if (popupElement && popupElement.classList.contains('visible')) { if (!popupElement.contains(event.target) && event.target !== logoElement) { togglePopup(); } } }, true); document.body.dataset.customizerPopupListener = 'true'; }

        console.log("SpicyChat UI Customizer (Font & Theme): Initialization complete (0.7.1 logic).");
    }

    // --- Start with Increased Delay --- (FROM 0.7.1-alpha - KEEPING THIS DELAY METHOD)
    const INITIALIZATION_DELAY = 4500;
    console.log(`SpicyChat UI Customizer (Font & Theme): Waiting ${INITIALIZATION_DELAY}ms for Logic Core (original 0.7.1 delay)...`);
    setTimeout(initialize, INITIALIZATION_DELAY);

})();
