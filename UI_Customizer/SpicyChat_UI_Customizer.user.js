// ==UserScript==
// @name         SpicyChat UI Customizer
// @namespace    http://tampermonkey.net/
// @version      0.9.8
// @description  Customize SpicyChat font size and themes. Requires 'SpicyChat Logic Core'.
// @author       Discord: @encode_your, SpicyChat: @sophieaaa
// @match        https://spicychat.ai/chat/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_info
// @updateURL    https://github.com/RomanovaSpicy/Spicy_CustomUI/raw/refs/heads/main/UI_Customizer/SpicyChat_UI_Customizer.user.js
// @downloadURL  https://github.com/RomanovaSpicy/Spicy_CustomUI/raw/refs/heads/main/UI_Customizer/SpicyChat_UI_Customizer.user.js
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
    const DEFAULT_THEME_KEY = 'coastal_mist'; // Defaulting to a neutral dark theme

    // --- Theme Definitions (v0.9.8 - Redesigned Dark Themes) ---
    const themes = {
        'coastal_mist': { // --- УТВЕРЖДЕН ---
            name: '🌫️ Coastal Mist',
            description: 'Refined dark theme. Clear text hierarchy, comfortable blues/greys, professional feel.',
            css: `
                /* --- Coastal Mist --- */
                :root {
                    --cm-bg-0: #1A1D23; --cm-bg-1: #21252E; --cm-bg-2: #2A303C; --cm-bg-3: #384050; /* Layered dark backgrounds */
                    --cm-text-main: #E0E5F0; /* Main Text: Bright, clear */
                    --cm-text-italic: #C3A6D5; /* Italic/Actions: Distinct Lavender/Mauve */
                    --cm-text-quote: #88C0D0; /* Quote: Clear Cyan/Light Blue */
                    --cm-text-sender: #9EB0C7; /* Sender: Muted grey-blue */
                    --cm-accent: #81A1C1; --cm-accent-hover: #8FBCBB; /* Main Accent: Steel Blue -> Teal */
                    --cm-border: #3E485A; --cm-border-focus: #5E81AC;
                    --cm-shadow-heavy: rgba(0, 0, 0, 0.4); --cm-shadow-medium: rgba(0, 0, 0, 0.25); --cm-shadow-light: rgba(0, 0, 0, 0.15);
                }
                html.dark body { background: linear-gradient(170deg, var(--cm-bg-0) 0%, var(--cm-bg-1) 100%) !important; background-attachment: fixed !important; font-family: 'Inter', sans-serif; }
                html.dark body::before { display: none !important; }
                /* Scrollbar */
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { background-color: transparent !important; scrollbar-width: thin !important; scrollbar-color: var(--cm-bg-3) transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar, [data-ui-component="SideNavBar"]::-webkit-scrollbar { width: 9px !important; height: 9px !important; background-color: transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-track, [data-ui-component="SideNavBar"]::-webkit-scrollbar-track { background: rgba(33, 37, 46, 0.4) !important; border-radius: 5px !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--cm-bg-3) !important; border-radius: 5px !important; border: 1px solid var(--cm-bg-1) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--cm-accent) !important; }
                /* Header & Sidebar */
                [data-ui-component="ChatHeaderBar"] { background: var(--cm-bg-1) !important; border-bottom: 1px solid var(--cm-border) !important; box-shadow: 0 3px 8px var(--cm-shadow-medium); padding: 6px 0 !important; }
                [data-ui-component="SideNavBar"] { background: var(--cm-bg-1) !important; border-right: 1px solid var(--cm-border) !important; box-shadow: 2px 0 7px var(--cm-shadow-medium); }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: #C0CADB !important; font-weight: 500; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--cm-text-sender) !important; transition: stroke 0.2s ease; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--cm-accent-hover) !important; }
                [data-ui-component^="SideNav"] button { color: var(--cm-text-sender) !important; transition: background-color 0.2s ease, color 0.2s ease, border-left-color 0.2s ease; border-radius: 0 5px 5px 0 !important; padding: 8px 12px 8px 15px; border-left: 3px solid transparent; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--cm-accent) !important; color: var(--cm-bg-0) !important; border-left-color: var(--cm-accent-hover) !important; }
                [data-ui-component^="SideNav"] button svg { stroke: var(--cm-text-sender) !important; transition: stroke 0.2s ease; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: var(--cm-bg-0) !important; }
                /* Messages - Clear bg difference */
                [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: var(--cm-bg-2) !important; } /* Slightly lighter bot messages */
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--cm-bg-1) !important; } /* Darker user messages */
                [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] { border: 1px solid var(--cm-border) !important; border-radius: 8px !important; padding: 1rem 1.3rem !important; margin-bottom: 1.1rem !important; box-shadow: 0 3px 8px var(--cm-shadow-light); transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.1s ease; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--cm-border-focus) !important; box-shadow: 0 5px 12px var(--cm-shadow-medium); transform: translateY(-1px); }
                [data-ui-component="BotMessageContainer"] { border-left: 3px solid var(--cm-accent) !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { border-left: 3px solid var(--cm-bg-3) !important; }
                [data-ui-component="ChatHeroInnerContainer"] { background: linear-gradient(145deg, var(--cm-bg-2), var(--cm-bg-1)); border-color: var(--cm-border) !important; box-shadow: 0 4px 10px var(--cm-shadow-medium); }
                /* --- TEXT STYLES - RADICAL SEPARATION --- */
                [data-ui-component="MessageSenderName"] { color: var(--cm-text-sender) !important; font-weight: 600; margin-bottom: 5px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.5px;}
                [data-ui-component="MessageTextSpan"] { color: var(--cm-text-main) !important; line-height: inherit !important; } /* MAIN TEXT */
                [data-ui-component="MessageTextSpan"] > em { color: var(--cm-text-italic) !important; font-style: italic !important; font-weight: 500; } /* ITALIC/ACTIONS */
                [data-ui-component="MessageTextSpan"] > q { color: var(--cm-text-quote) !important; font-style: italic !important; opacity: 1; background-color: rgba(136, 192, 208, 0.08); border-left: 3px solid rgba(136, 192, 208, 0.5); padding: 0.1em 0.6em; display: inline-block; margin: 0.15em 0; border-radius: 0 4px 4px 0; } /* QUOTES */
                [data-ui-component="MessageAvatarImage"] { border-radius: 50% !important; border: 2px solid var(--cm-bg-3); filter: saturate(0.9); }
                /* Actions */
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--cm-text-sender) !important; transition: stroke 0.2s ease; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--cm-accent-hover) !important; }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: #EBCB8B !important; stroke: #EBCB8B !important; }
                /* Input Area */
                [data-ui-component="ChatInputBarContainer"] { background-color: transparent !important; border-top: none !important; padding: 5px 10px 15px 10px !important; } /* Keep this */
                [data-ui-component="ChatInputBarInnerContainer"] { padding: 0 !important; } /* Keep this */
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--cm-bg-1) !important; border: 1px solid var(--cm-border) !important; border-radius: 8px !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); margin: 0 !important; padding: 4px 10px !important; transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; display: flex !important; align-items: center; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--cm-border-focus) !important; background-color: var(--cm-bg-2) !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 0 0 3px rgba(94, 129, 172, 0.2); }
                [data-ui-component="MessageInputTextarea"] { color: var(--cm-text-main) !important; caret-color: var(--cm-accent); background: transparent !important; padding: 11px 8px !important; flex-grow: 1; font-size: inherit; line-height: 1.6 !important; }
                [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--cm-text-sender) !important; opacity: 0.6; font-style: italic; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--cm-accent) !important; border-radius: 7px !important; margin-left: 10px !important; padding: 9px !important; transition: background-color 0.2s ease, transform 0.1s ease; box-shadow: 0 2px 4px var(--cm-shadow-medium); display: flex; align-items: center; justify-content: center; border: none; }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--cm-accent-hover) !important; transform: scale(1.05); }
                [data-ui-component="SendButtonIcon"] { stroke: var(--cm-bg-0) !important; width: 22px; height: 22px; }
            `
        },
        'librarium_dusk_dark': { // --- ПЕРЕРАБОТАН В ТЁМНЫЙ ---
            name: '📚 Librarium Dusk (Dark)',
            description: 'Dark & cozy library feel. Creamy text on deep browns, warm amber/gold accents, serif font.',
            css: `
                /* --- Librarium Dusk (Dark) --- */
                :root {
                    --ldd-bg-0: #261F1A; /* Deepest brown/wood */
                    --ldd-bg-1: #3A2D25; /* Panel/User Message: Dark leather */
                    --ldd-bg-2: #4A3C31; /* Bot Message: Slightly lighter warm brown */
                    --ldd-bg-3: #5C4E44; /* Scrollbar/borders */
                    --ldd-text-main: #EAE0D5; /* Main Text: Creamy white */
                    --ldd-text-italic: #E8B878; /* Italic/Actions: Warm Amber/Gold */
                    --ldd-text-quote: #A0B8A8; /* Quote: Desaturated Sage Green */
                    --ldd-text-sender: #A89888; /* Sender: Muted beige */
                    --ldd-accent: #C5A06A; --ldd-accent-hover: #D8B884; /* Accent: Antique Gold */
                    --ldd-border: #5C4E44; --ldd-border-focus: #C5A06A;
                    --ldd-shadow-heavy: rgba(0, 0, 0, 0.5); --ldd-shadow-medium: rgba(0, 0, 0, 0.3); --ldd-shadow-light: rgba(0, 0, 0, 0.2);
                    --ldd-texture: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE1ODgzNEFGMjkyMTExRUE5OEI3RDI2NzQ2Rjg3QUU3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE1ODgzNEIwMjkyMTExRUE5OEI3RDI2NzQ2Rjg3QUU3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTU4ODM0QUQyOTIxMTFFQTk4QjdEMjY3NDZGODdBRTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTU4ODM0QUUyOTIxMTFFQTk4QjdEMjY3NDZGODdBRTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6aNps0AAAAWUlEQVR42uzMMQEAAAgDINcP9qUQ+6cBQa4caCp48uTJkydPnjx58uTJkydPnjx58uTJkydPnjx58uTJkydPnjx58uTJkydPnjx58uTJkydPnjx58uTJkyc/LoAAMAQ9r6gAUUB40AAAAASUVORK5CYII='); /* Subtle noise texture */
                }
                html.dark body { background: var(--ldd-bg-0) !important; background-image: var(--ldd-texture), linear-gradient(170deg, var(--ldd-bg-0) 0%, #1c1612 100%) !important; background-blend-mode: overlay; background-attachment: fixed !important; font-family: 'Merriweather', serif; color: var(--ldd-text-main); }
                html.dark body::before { display: none !important; }
                 /* Scrollbar */
                 [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { background-color: transparent !important; scrollbar-width: thin !important; scrollbar-color: var(--ldd-bg-3) transparent !important; }
                 [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar, [data-ui-component="SideNavBar"]::-webkit-scrollbar { width: 10px !important; height: 10px !important; background-color: transparent !important; }
                 [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-track, [data-ui-component="SideNavBar"]::-webkit-scrollbar-track { background: rgba(58, 45, 37, 0.4) !important; border-radius: 5px !important; }
                 [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--ldd-bg-3) !important; border-radius: 5px !important; border: 1px solid var(--ldd-bg-1) !important; }
                 [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--ldd-accent) !important; }
                /* Header & Sidebar */
                [data-ui-component="ChatHeaderBar"] { background: var(--ldd-bg-1) !important; background-image: var(--ldd-texture) !important; background-blend-mode: overlay; border-bottom: 1px solid var(--ldd-border) !important; box-shadow: 0 2px 7px var(--ldd-shadow-medium); padding: 6px 0 !important; }
                [data-ui-component="SideNavBar"] { background: var(--ldd-bg-1) !important; background-image: var(--ldd-texture) !important; background-blend-mode: overlay; border-right: 1px solid var(--ldd-border) !important; box-shadow: 2px 0 6px var(--ldd-shadow-medium); }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: #D4C8BC !important; font-weight: 500; font-family: 'Inter', sans-serif; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--ldd-text-sender) !important; transition: stroke 0.2s ease; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--ldd-accent-hover) !important; }
                [data-ui-component^="SideNav"] button { color: var(--ldd-text-sender) !important; transition: background-color 0.2s ease, color 0.2s ease; border-radius: 5px !important; font-family: 'Inter', sans-serif; padding: 8px 12px; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--ldd-accent) !important; color: var(--ldd-bg-0) !important; }
                [data-ui-component^="SideNav"] button svg { stroke: var(--ldd-text-sender) !important; transition: stroke 0.2s ease; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: var(--ldd-bg-0) !important; }
                 /* Messages */
                [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: var(--ldd-bg-2) !important; } /* Lighter warm brown bot msg */
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--ldd-bg-1) !important; } /* Darker leather user msg */
                [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] { border: 1px solid var(--ldd-border) !important; background-image: var(--ldd-texture) !important; background-blend-mode: overlay; border-radius: 6px !important; padding: 1rem 1.3rem !important; margin-bottom: 1.1rem !important; box-shadow: 0 3px 8px var(--ldd-shadow-light); transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.1s ease; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--ldd-border-focus) !important; box-shadow: 0 5px 12px var(--ldd-shadow-medium); transform: translateY(-1px); }
                [data-ui-component="BotMessageContainer"] { border-left: 3px solid var(--ldd-accent) !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { border-left: 3px solid var(--ldd-bg-3) !important; }
                [data-ui-component="ChatHeroInnerContainer"] { background: linear-gradient(145deg, var(--ldd-bg-2), var(--ldd-bg-1)); border-color: var(--ldd-border) !important; box-shadow: 0 4px 10px var(--ldd-shadow-medium); }
                 /* --- TEXT STYLES - RADICAL SEPARATION --- */
                [data-ui-component="MessageSenderName"] { color: var(--ldd-text-sender) !important; font-weight: 600; font-family: 'Inter', sans-serif; margin-bottom: 5px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.5px; }
                [data-ui-component="MessageTextSpan"] { color: var(--ldd-text-main) !important; line-height: inherit !important; } /* MAIN TEXT */
                [data-ui-component="MessageTextSpan"] > em { color: var(--ldd-text-italic) !important; font-style: italic !important; font-weight: 500; } /* ITALIC/ACTIONS - Amber/Gold */
                [data-ui-component="MessageTextSpan"] > q { color: var(--ldd-text-quote) !important; font-style: italic !important; opacity: 1; background-color: rgba(160, 184, 168, 0.1); border-left: 3px solid rgba(160, 184, 168, 0.5); padding: 0.1em 0.6em; display: inline-block; margin: 0.15em 0; border-radius: 0 4px 4px 0; } /* QUOTES - Sage Green */
                [data-ui-component="MessageAvatarImage"] { border-radius: 3px !important; border: 2px solid var(--ldd-bg-3); filter: sepia(0.1) brightness(0.95); }
                 /* Actions */
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--ldd-text-sender) !important; transition: stroke 0.2s ease; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--ldd-accent-hover) !important; }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: #E8B878 !important; stroke: #D4A06A !important; } /* Gold star */
                 /* Input Area */
                [data-ui-component="ChatInputBarContainer"] { background-color: transparent !important; border-top: none !important; padding: 5px 10px 15px 10px !important; }
                [data-ui-component="ChatInputBarInnerContainer"] { padding: 0 !important; }
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--ldd-bg-1) !important; background-image: var(--ldd-texture) !important; background-blend-mode: overlay; border: 1px solid var(--ldd-border) !important; border-radius: 6px !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); margin: 0 !important; padding: 4px 10px !important; transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; display: flex !important; align-items: center; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--ldd-border-focus) !important; background-color: var(--ldd-bg-2) !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3), 0 0 0 3px rgba(197, 160, 106, 0.25); }
                [data-ui-component="MessageInputTextarea"] { color: var(--ldd-text-main) !important; caret-color: var(--ldd-accent); background: transparent !important; padding: 11px 8px !important; flex-grow: 1; font-size: inherit; line-height: 1.6 !important; font-family: 'Merriweather', serif; }
                [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--ldd-text-sender) !important; opacity: 0.6; font-style: italic; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--ldd-accent) !important; border-radius: 5px !important; margin-left: 10px !important; padding: 9px !important; transition: background-color 0.2s ease, transform 0.1s ease; box-shadow: 0 2px 4px var(--ldd-shadow-medium); display: flex; align-items: center; justify-content: center; border: none; }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--ldd-accent-hover) !important; transform: scale(1.05); }
                [data-ui-component="SendButtonIcon"] { stroke: var(--ldd-bg-0) !important; width: 22px; height: 22px; }
            `
        },
        'sakura_dreams_night': { // --- ПЕРЕРАБОТАН В ТЁМНЫЙ ---
            name: '🌙 Sakura Dreams (Night)',
            description: 'Moonlit pastels. Soft lavender text on deep indigo, pink/mint accents.',
            css: `
                /* --- Sakura Dreams (Night) --- */
                :root {
                    --sdn-bg-0: #1E1C2B; /* Deep Indigo/Violet */
                    --sdn-bg-1: #2A283A; /* Panel/User Message: Dark Lavender */
                    --sdn-bg-2: #353248; /* Bot Message: Slightly Lighter Violet */
                    --sdn-bg-3: #45415A; /* Scrollbar/borders */
                    --sdn-text-main: #EAE6F5; /* Main Text: Soft Lavender White */
                    --sdn-text-italic: #F8A0C4; /* Italic/Actions: Clear Cherry Blossom Pink */
                    --sdn-text-quote: #A0D8C0; /* Quote: Soft Mint Green */
                    --sdn-text-sender: #A8A0B8; /* Sender: Muted Lavender Grey */
                    --sdn-accent-pink: #E888AE; --sdn-accent-pink-hover: #F0A0C0; /* Accent: Brighter Pink */
                    --sdn-accent-green: #8FBC8F; /* Accent: Soft Green */
                    --sdn-border: #45415A; --sdn-border-focus: #E888AE;
                    --sdn-shadow-heavy: rgba(0, 0, 0, 0.5); --sdn-shadow-medium: rgba(0, 0, 0, 0.3); --sdn-shadow-light: rgba(0, 0, 0, 0.2);
                    --sdn-texture: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M50 0 C 50 0, 0 50, 50 100 C 100 50, 50 0, 50 0 Z" fill="%23${'EAE6F5'.substring(1)}" opacity="0.02" transform="rotate(45 50 50) scale(1.5)" /></svg>'); /* Very faint petal bg */
                }
                html.dark body { background: var(--sdn-bg-0) !important; background-image: var(--sdn-texture), linear-gradient(170deg, var(--sdn-bg-0) 0%, #151320 100%) !important; background-blend-mode: overlay; background-attachment: fixed !important; font-family: 'Inter', sans-serif; color: var(--sdn-text-main); }
                html.dark body::before { display: none !important; }
                 /* Scrollbar */
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { background-color: transparent !important; scrollbar-width: thin !important; scrollbar-color: var(--sdn-bg-3) transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar, [data-ui-component="SideNavBar"]::-webkit-scrollbar { width: 9px !important; height: 9px !important; background-color: transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-track, [data-ui-component="SideNavBar"]::-webkit-scrollbar-track { background: rgba(42, 40, 58, 0.4) !important; border-radius: 5px !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--sdn-bg-3) !important; border-radius: 5px !important; border: 1px solid var(--sdn-bg-1) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--sdn-accent-pink) !important; }
                /* Header & Sidebar */
                [data-ui-component="ChatHeaderBar"] { background: var(--sdn-bg-1) !important; border-bottom: 1px solid var(--sdn-border) !important; box-shadow: 0 2px 7px var(--sdn-shadow-medium); padding: 6px 0 !important; }
                [data-ui-component="SideNavBar"] { background: var(--sdn-bg-1) !important; border-right: 1px solid var(--sdn-border) !important; box-shadow: 1px 0 6px var(--sdn-shadow-medium); }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: #D0C8E0 !important; font-weight: 500; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--sdn-text-sender) !important; transition: stroke 0.2s ease; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--sdn-accent-pink-hover) !important; }
                [data-ui-component^="SideNav"] button { color: var(--sdn-text-sender) !important; transition: background-color 0.2s ease, color 0.2s ease, border-left-color 0.2s ease; border-radius: 0 6px 6px 0 !important; padding: 8px 12px 8px 15px; border-left: 3px solid transparent; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--sdn-accent-pink) !important; color: #FFFFFF !important; border-left-color: var(--sdn-accent-pink-hover) !important; }
                [data-ui-component^="SideNav"] button svg { stroke: var(--sdn-text-sender) !important; transition: stroke 0.2s ease; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: #FFFFFF !important; }
                /* Messages */
                [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: var(--sdn-bg-2) !important; } /* Lighter violet bot msg */
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--sdn-bg-1) !important; } /* Darker lavender user msg */
                [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] { border: 1px solid var(--sdn-border) !important; border-radius: 10px !important; padding: 1rem 1.3rem !important; margin-bottom: 1rem !important; box-shadow: 0 3px 8px var(--sdn-shadow-light); transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.1s ease; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--sdn-border-focus) !important; box-shadow: 0 5px 12px var(--sdn-shadow-medium); transform: translateY(-1px); }
                [data-ui-component="BotMessageContainer"] { border-left: 3px solid var(--sdn-accent-pink) !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { border-left: 3px solid var(--sdn-accent-green) !important; }
                [data-ui-component="ChatHeroInnerContainer"] { background: linear-gradient(145deg, var(--sdn-bg-2), var(--sdn-bg-1)); border-color: var(--sdn-border) !important; box-shadow: 0 4px 10px var(--sdn-shadow-medium); }
                /* --- TEXT STYLES - RADICAL SEPARATION --- */
                [data-ui-component="MessageSenderName"] { color: var(--sdn-text-sender) !important; font-weight: 600; margin-bottom: 5px; font-size: 0.9em; }
                [data-ui-component="MessageTextSpan"] { color: var(--sdn-text-main) !important; line-height: inherit !important; } /* MAIN TEXT */
                [data-ui-component="MessageTextSpan"] > em { color: var(--sdn-text-italic) !important; font-style: italic !important; font-weight: 500; } /* ITALIC/ACTIONS - Pink */
                [data-ui-component="MessageTextSpan"] > q { color: var(--sdn-text-quote) !important; font-style: italic !important; opacity: 1; background-color: rgba(160, 216, 192, 0.1); border-left: 3px solid rgba(160, 216, 192, 0.5); padding: 0.1em 0.6em; display: inline-block; margin: 0.15em 0; border-radius: 0 4px 4px 0; } /* QUOTES - Mint Green */
                [data-ui-component="MessageAvatarImage"] { border-radius: 50% !important; border: 2px solid var(--sdn-bg-3); filter: saturate(0.9) brightness(0.95); }
                /* Actions */
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--sdn-text-sender) !important; transition: stroke 0.2s ease; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--sdn-accent-pink-hover) !important; }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: #FFD700 !important; stroke: #DAA520 !important; } /* Gold star */
                 /* Input Area */
                 [data-ui-component="ChatInputBarContainer"] { background-color: transparent !important; border-top: none !important; padding: 5px 10px 15px 10px !important; }
                 [data-ui-component="ChatInputBarInnerContainer"] { padding: 0 !important; }
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--sdn-bg-1) !important; border: 1px solid var(--sdn-border) !important; border-radius: 10px !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.25); margin: 0 !important; padding: 4px 10px !important; transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; display: flex !important; align-items: center; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--sdn-border-focus) !important; background-color: var(--sdn-bg-2) !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.25), 0 0 0 3px rgba(232, 136, 174, 0.2); }
                [data-ui-component="MessageInputTextarea"] { color: var(--sdn-text-main) !important; caret-color: var(--sdn-accent-pink); background: transparent !important; padding: 11px 8px !important; flex-grow: 1; font-size: inherit; line-height: 1.6 !important; }
                [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--sdn-text-sender) !important; opacity: 0.6; font-style: italic; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--sdn-accent-pink) !important; border-radius: 8px !important; margin-left: 10px !important; padding: 9px !important; transition: background-color 0.2s ease, transform 0.1s ease; box-shadow: 0 2px 4px var(--sdn-shadow-medium); display: flex; align-items: center; justify-content: center; border: none; }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--sdn-accent-pink-hover) !important; transform: scale(1.05); }
                [data-ui-component="SendButtonIcon"] { stroke: #FFFFFF !important; width: 22px; height: 22px; }
            `
        },
        'golden_sands_twilight': { // --- ПЕРЕРАБОТАН В ТЁМНЫЙ ---
            name: '🏜️ Golden Sands (Twilight)',
            description: 'Warm desert night theme. Sandy text on dark bronze, rich gold/copper accents.',
            css: `
                /* --- Golden Sands (Twilight) --- */
                :root {
                    --gst-bg-0: #201C18; /* Deepest warm brown/bronze */
                    --gst-bg-1: #332A22; /* Panel/User Message: Dark sand */
                    --gst-bg-2: #453A2F; /* Bot Message: Slightly lighter */
                    --gst-bg-3: #5A4D3F; /* Scrollbar/borders */
                    --gst-text-main: #F5EFE5; /* Main Text: Warm off-white */
                    --gst-text-italic: #E89868; /* Italic/Actions: Rich Copper/Terracotta */
                    --gst-text-quote: #88B0A8; /* Quote: Muted Desert Teal */
                    --gst-text-sender: #B0A08C; /* Sender: Muted sandstone */
                    --gst-accent-gold: #D8B884; --gst-accent-gold-hover: #E8C898; /* Accent: Brighter Gold */
                    --gst-accent-copper: #C88462; /* Accent 2: Copper */
                    --gst-border: #5A4D3F; --gst-border-focus: #D8B884;
                    --gst-shadow-heavy: rgba(0, 0, 0, 0.5); --gst-shadow-medium: rgba(0, 0, 0, 0.3); --gst-shadow-light: rgba(0, 0, 0, 0.2);
                    --gst-texture: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAQKADAAQAAAABAAAAQAAAAABGUUKwAAAAYElEQVR4Ae3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAPgZAADSDAABI5o46AAAAABJRU5ErkJggg=='); /* Extremely subtle grain */
                }
                html.dark body { background: var(--gst-bg-0) !important; background-image: var(--gst-texture), linear-gradient(170deg, var(--gst-bg-0) 0%, #181411 100%) !important; background-blend-mode: overlay; background-attachment: fixed !important; font-family: 'Inter', sans-serif; color: var(--gst-text-main); }
                html.dark body::before { display: none !important; }
                 /* Scrollbar */
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { background-color: transparent !important; scrollbar-width: thin !important; scrollbar-color: var(--gst-bg-3) transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar, [data-ui-component="SideNavBar"]::-webkit-scrollbar { width: 10px !important; height: 10px !important; background-color: transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-track, [data-ui-component="SideNavBar"]::-webkit-scrollbar-track { background: rgba(51, 42, 34, 0.4) !important; border-radius: 5px !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--gst-bg-3) !important; border-radius: 5px !important; border: 1px solid var(--gst-bg-1) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--gst-accent-gold) !important; }
                /* Header & Sidebar */
                [data-ui-component="ChatHeaderBar"] { background: var(--gst-bg-1) !important; border-bottom: 1px solid var(--gst-border) !important; box-shadow: 0 2px 7px var(--gst-shadow-medium); padding: 6px 0 !important; }
                [data-ui-component="SideNavBar"] { background: var(--gst-bg-1) !important; border-right: 1px solid var(--gst-border) !important; box-shadow: 1px 0 6px var(--gst-shadow-medium); }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: #D8C8B4 !important; font-weight: 500; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--gst-text-sender) !important; transition: stroke 0.2s ease; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--gst-accent-gold-hover) !important; }
                [data-ui-component^="SideNav"] button { color: var(--gst-text-sender) !important; transition: background-color 0.2s ease, color 0.2s ease; border-radius: 6px !important; padding: 8px 12px; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--gst-accent-gold) !important; color: var(--gst-bg-0) !important; }
                [data-ui-component^="SideNav"] button svg { stroke: var(--gst-text-sender) !important; transition: stroke 0.2s ease; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: var(--gst-bg-0) !important; }
                /* Messages */
                [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: var(--gst-bg-2) !important; } /* Slightly lighter bot message */
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--gst-bg-1) !important; } /* Dark sand user message */
                [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] { border: 1px solid var(--gst-border) !important; background-image: var(--gst-texture) !important; background-blend-mode: overlay; border-radius: 8px !important; padding: 1rem 1.3rem !important; margin-bottom: 1rem !important; box-shadow: 0 3px 8px var(--gst-shadow-light); transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.1s ease; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--gst-border-focus) !important; box-shadow: 0 5px 12px var(--gst-shadow-medium); transform: translateY(-1px); }
                [data-ui-component="BotMessageContainer"] { border-left: 3px solid var(--gst-accent-gold) !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { border-left: 3px solid var(--gst-accent-copper) !important; }
                [data-ui-component="ChatHeroInnerContainer"] { background: linear-gradient(145deg, var(--gst-bg-2), var(--gst-bg-1)); border-color: var(--gst-border) !important; box-shadow: 0 4px 10px var(--gst-shadow-medium); }
                 /* --- TEXT STYLES - RADICAL SEPARATION --- */
                 [data-ui-component="MessageSenderName"] { color: var(--gst-text-sender) !important; font-weight: 600; margin-bottom: 5px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.5px; }
                 [data-ui-component="MessageTextSpan"] { color: var(--gst-text-main) !important; line-height: inherit !important; } /* MAIN TEXT */
                 [data-ui-component="MessageTextSpan"] > em { color: var(--gst-text-italic) !important; font-style: italic !important; font-weight: 500; } /* ITALIC/ACTIONS - Copper */
                 [data-ui-component="MessageTextSpan"] > q { color: var(--gst-text-quote) !important; font-style: italic !important; opacity: 1; background-color: rgba(136, 176, 168, 0.1); border-left: 3px solid rgba(136, 176, 168, 0.5); padding: 0.1em 0.6em; display: inline-block; margin: 0.15em 0; border-radius: 0 4px 4px 0; } /* QUOTES - Teal */
                 [data-ui-component="MessageAvatarImage"] { border-radius: 50% !important; border: 2px solid var(--gst-bg-3); filter: saturate(0.8) brightness(0.95); }
                 /* Actions */
                 [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--gst-text-sender) !important; transition: stroke 0.2s ease; }
                 [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--gst-accent-gold-hover) !important; }
                 [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: var(--gst-accent-copper) !important; stroke: #A86442 !important; } /* Copper star */
                 /* Input Area */
                 [data-ui-component="ChatInputBarContainer"] { background-color: transparent !important; border-top: none !important; padding: 5px 10px 15px 10px !important; }
                 [data-ui-component="ChatInputBarInnerContainer"] { padding: 0 !important; }
                 [data-ui-component="TextInputAreaWrapper"] { background-color: var(--gst-bg-1) !important; background-image: var(--gst-texture) !important; background-blend-mode: overlay; border: 1px solid var(--gst-border) !important; border-radius: 8px !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); margin: 0 !important; padding: 4px 10px !important; transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; display: flex !important; align-items: center; }
                 [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--gst-border-focus) !important; background-color: var(--gst-bg-2) !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3), 0 0 0 3px rgba(216, 184, 132, 0.25); }
                 [data-ui-component="MessageInputTextarea"] { color: var(--gst-text-main) !important; caret-color: var(--gst-accent-gold); background: transparent !important; padding: 11px 8px !important; flex-grow: 1; font-size: inherit; line-height: 1.6 !important; }
                 [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--gst-text-sender) !important; opacity: 0.6; font-style: italic; }
                 [data-ui-component="SendButtonContainer"] { background-color: var(--gst-accent-gold) !important; border-radius: 7px !important; margin-left: 10px !important; padding: 9px !important; transition: background-color 0.2s ease, transform 0.1s ease; box-shadow: 0 2px 4px var(--gst-shadow-medium); display: flex; align-items: center; justify-content: center; border: none; }
                 [data-ui-component="SendButtonContainer"]:hover { background-color: var(--gst-accent-gold-hover) !important; transform: scale(1.05); }
                 [data-ui-component="SendButtonIcon"] { stroke: var(--gst-bg-0) !important; width: 22px; height: 22px; }
            `
        },
        'ronin_red': { // --- УТВЕРЖДЕН ---
            name: '🏮 Ronin Red',
            description: 'High-tech dark theme. Extreme contrast, sharp red accents, clear text hierarchy.',
            css: `
                /* --- Ronin Red --- */
                :root {
                    --rr-bg-0: #0A0A0C; --rr-bg-1: #121317; --rr-bg-2: #1C1E22; --rr-bg-3: #282A30; /* Deep blacks/greys */
                    --rr-text-main: #F8F9FA; /* Main Text: Near white */
                    --rr-text-italic: #FF87A7; /* Italic/Actions: Vivid Pink/Rose */
                    --rr-text-quote: #87CEFA; /* Quote: Bright Light Sky Blue */
                    --rr-text-sender: #9098A8; /* Sender: Cool grey */
                    --rr-accent-red: #F03E3E; --rr-accent-red-hover: #FF5C5C; --rr-accent-red-active: #D93434; /* Accent: Bright Red */
                    --rr-border: #34363B; --rr-border-focus: #F03E3E;
                    --rr-shadow-heavy: rgba(0, 0, 0, 0.6); --rr-shadow-medium: rgba(0, 0, 0, 0.4); --rr-shadow-light: rgba(0, 0, 0, 0.25);
                    --rr-red-glow: 0 0 10px rgba(240, 62, 62, 0.5);
                }
                html.dark body { background: var(--rr-bg-0) !important; font-family: 'Inter', sans-serif; }
                html.dark body::before { display: none !important; }
                /* Scrollbar */
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { background-color: transparent !important; scrollbar-width: thin !important; scrollbar-color: var(--rr-bg-3) transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar, [data-ui-component="SideNavBar"]::-webkit-scrollbar { width: 8px !important; height: 8px !important; background-color: transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-track, [data-ui-component="SideNavBar"]::-webkit-scrollbar-track { background: rgba(18, 19, 23, 0.5) !important; border-radius: 4px !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--rr-bg-3) !important; border-radius: 4px !important; border: 1px solid var(--rr-bg-1) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--rr-accent-red-active) !important; }
                /* Header & Sidebar */
                [data-ui-component="ChatHeaderBar"] { background: var(--rr-bg-1) !important; border-bottom: 1px solid var(--rr-border) !important; box-shadow: 0 3px 8px var(--rr-shadow-medium); padding: 6px 0 !important; }
                [data-ui-component="SideNavBar"] { background: var(--rr-bg-1) !important; border-right: 1px solid var(--rr-border) !important; box-shadow: 2px 0 7px var(--rr-shadow-medium); }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: #D8DCE0 !important; font-weight: 500; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--rr-text-sender) !important; transition: stroke 0.2s ease, filter 0.2s ease; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--rr-accent-red-hover) !important; filter: drop-shadow(var(--rr-red-glow)); }
                [data-ui-component^="SideNav"] button { color: var(--rr-text-sender) !important; transition: background-color 0.15s ease, color 0.15s ease, border-left-color 0.15s ease; border-radius: 0 4px 4px 0 !important; padding: 8px 12px 8px 15px; border-left: 3px solid transparent; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--rr-accent-red) !important; color: #FFFFFF !important; border-left-color: var(--rr-accent-red-hover); }
                [data-ui-component^="SideNav"] button svg { stroke: var(--rr-text-sender) !important; transition: stroke 0.15s ease; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: #FFFFFF !important; }
                /* Messages - Stark difference */
                [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: var(--rr-bg-2) !important; } /* Grey bot message */
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--rr-bg-1) !important; } /* Darker user message */
                [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] { border: 1px solid var(--rr-border) !important; border-radius: 4px !important; /* Sharper corners */ padding: 1rem 1.3rem !important; margin-bottom: 1rem !important; box-shadow: 0 2px 5px var(--rr-shadow-light); transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.1s ease; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--rr-border-focus) !important; box-shadow: 0 4px 8px var(--rr-shadow-medium); transform: translateY(-1px); }
                [data-ui-component="BotMessageContainer"] { border-left: 3px solid var(--rr-accent-red) !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { border-left: 3px solid var(--rr-bg-3) !important; }
                [data-ui-component="ChatHeroInnerContainer"] { background: var(--rr-bg-2) !important; border: 1px solid var(--rr-border) !important; box-shadow: 0 3px 8px var(--rr-shadow-medium); }
                /* --- TEXT STYLES - RADICAL SEPARATION --- */
                [data-ui-component="MessageSenderName"] { color: var(--rr-text-sender) !important; font-weight: 600; margin-bottom: 5px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.5px; }
                [data-ui-component="MessageTextSpan"] { color: var(--rr-text-main) !important; line-height: inherit !important; } /* MAIN TEXT */
                [data-ui-component="MessageTextSpan"] > em { color: var(--rr-text-italic) !important; font-style: italic !important; font-weight: 500; } /* ITALIC/ACTIONS */
                [data-ui-component="MessageTextSpan"] > q { color: var(--rr-text-quote) !important; font-style: italic !important; opacity: 1; background-color: rgba(135, 206, 250, 0.1); border-left: 3px solid rgba(135, 206, 250, 0.5); padding: 0.1em 0.6em; display: inline-block; margin: 0.15em 0; border-radius: 0 4px 4px 0; } /* QUOTES */
                [data-ui-component="MessageAvatarImage"] { border-radius: 3px !important; border: 1px solid var(--rr-border); }
                /* Actions */
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--rr-text-sender) !important; transition: stroke 0.2s ease, filter 0.2s ease; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--rr-accent-red-hover) !important; filter: drop-shadow(var(--rr-red-glow)); }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: var(--rr-accent-red) !important; stroke: var(--rr-accent-red) !important; filter: drop-shadow(var(--rr-red-glow)); }
                /* Input Area */
                 [data-ui-component="ChatInputBarContainer"] { background-color: transparent !important; border-top: none !important; padding: 5px 10px 15px 10px !important; }
                 [data-ui-component="ChatInputBarInnerContainer"] { padding: 0 !important; }
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--rr-bg-1) !important; border: 1px solid var(--rr-border) !important; border-radius: 4px !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); margin: 0 !important; padding: 4px 10px !important; transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; display: flex !important; align-items: center; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--rr-border-focus) !important; background-color: var(--rr-bg-2) !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3), 0 0 0 3px rgba(240, 62, 62, 0.25); }
                [data-ui-component="MessageInputTextarea"] { color: var(--rr-text-main) !important; caret-color: var(--rr-accent-red); background: transparent !important; padding: 11px 8px !important; flex-grow: 1; font-size: inherit; line-height: 1.6 !important; }
                [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--rr-text-sender) !important; opacity: 0.5; font-style: italic; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--rr-accent-red) !important; border-radius: 4px !important; margin-left: 10px !important; padding: 9px !important; transition: background-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease; box-shadow: 0 2px 5px var(--rr-shadow-medium), var(--rr-red-glow); display: flex; align-items: center; justify-content: center; border: none; }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--rr-accent-red-hover) !important; box-shadow: 0 3px 7px var(--rr-shadow-heavy), 0 0 12px rgba(255, 92, 92, 0.7); transform: scale(1.05); }
                [data-ui-component="SendButtonIcon"] { stroke: #FFFFFF !important; width: 22px; height: 22px; }
            `
        }
    };
    // --- END OF THEME DEFINITIONS ---

    // --- State Variables --- (Unchanged)
    let logoElement, popupElement, dynamicStyleElement, themeStyleElement, settingsView, themesView,
        fontSlider, fontValue, themeDisplay,
        changeThemeBtn, resetBtn, themeListContainer, backBtn;
    let currentThemeKey = DEFAULT_THEME_KEY;
    let currentFontSize = DEFAULT_FONT_SIZE;
    let isInitialized = false;

    // --- GUI Structure (HTML - Font & Theme Only) --- (Added version number)
    const popupHTML = `
        <div id="${VIEW_SETTINGS_ID}" style="display: block;"> <div class="customizer-header">UI Customizer v${GM_info.script.version}</div> <div class="customizer-section"> <label for="${FONT_SLIDER_ID}">Message Font Size</label> <div class="slider-container"> <input type="range" id="${FONT_SLIDER_ID}" min="8" max="32" step="1"> <span id="${FONT_VALUE_ID}"></span> </div> </div> <div class="customizer-section theme-section"> <span>Current Theme: <strong id="${THEME_DISPLAY_ID}"></strong></span> <button id="${CHANGE_THEME_BTN_ID}" class="customizer-button">Change Theme</button> </div> <div class="customizer-footer"> <button id="${RESET_BTN_ID}" class="customizer-button secondary">Reset Font</button> </div> </div>
        <div id="${VIEW_THEMES_ID}" style="display: none;"> <div class="customizer-header">Choose Theme</div> <div id="${THEME_LIST_ID}" class="theme-list"></div> <div class="customizer-footer"> <button id="${BACK_BTN_ID}" class="customizer-button secondary">Back</button> </div> </div>
    `;

    // --- GUI Styles --- (Unchanged from 0.9.7)
     const guiStyles = `
        #${POPUP_ID} { display: none !important; position: fixed !important; z-index: 100005 !important; top: 15px !important; right: 15px !important; bottom: auto !important; left: auto !important; background-color: rgba(44, 48, 56, 0.92) !important; /* Slightly more opaque */ color: #d8dee9 !important; border: 1px solid rgba(216, 222, 233, 0.15) !important; border-radius: 8px !important; width: 300px !important; /* Slightly wider */ padding: 0px !important; /* Remove padding, handle by inner elements */ font-size: 13px !important; font-family: 'Inter', sans-serif !important; box-shadow: 0 6px 25px rgba(0,0,0,0.5) !important; backdrop-filter: blur(7px) !important; transition: opacity 0.2s ease, transform 0.2s ease; opacity: 0; transform: translateY(10px) scale(0.98); }
        #${POPUP_ID}.visible { display: block !important; opacity: 1; transform: translateY(0) scale(1); }
        #${POPUP_ID} .customizer-header { font-size: 15px; font-weight: 600; text-align: center; margin: 0; padding: 12px 18px 10px 18px; border-bottom: 1px solid rgba(216, 222, 233, 0.1); background-color: rgba(59, 66, 82, 0.6); border-radius: 8px 8px 0 0; color: #eceff4; }
        #${POPUP_ID} .customizer-section { margin-bottom: 18px; padding: 0 18px; /* Padding inside sections */ }
        #${POPUP_ID} .customizer-section:first-of-type { margin-top: 18px; } /* Add top margin to first section */
        #${POPUP_ID} label { display: block; margin-bottom: 6px; font-weight: 500; color: #d8dee9; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; }
        #${POPUP_ID} .slider-container { display: flex; align-items: center; gap: 12px; }
        #${POPUP_ID} input[type="range"] { flex-grow: 1; cursor: pointer; -webkit-appearance: none; appearance: none; height: 6px; background: #434c5e; border-radius: 3px; outline: none; transition: background-color 0.15s ease; }
        #${POPUP_ID} input[type="range"]:hover { background: #4c566a; }
        #${POPUP_ID} input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; background: #88c0d0; border-radius: 50%; cursor: pointer; border: 2px solid #3b4252; transition: background-color 0.15s ease, transform 0.1s ease; }
        #${POPUP_ID} input[type="range"]::-moz-range-thumb { width: 16px; height: 16px; background: #88c0d0; border-radius: 50%; cursor: pointer; border: 2px solid #3b4252; transition: background-color 0.15s ease, transform 0.1s ease; }
        #${POPUP_ID} input[type="range"]:hover::-webkit-slider-thumb { background-color: #99d1e1; }
        #${POPUP_ID} input[type="range"]:hover::-moz-range-thumb { background-color: #99d1e1; }
        #${POPUP_ID} input[type="range"]:active::-webkit-slider-thumb { transform: scale(1.1); }
        #${POPUP_ID} input[type="range"]:active::-moz-range-thumb { transform: scale(1.1); }
        #${POPUP_ID} span[id*="-value"] { min-width: 40px; text-align: right; font-family: monospace; font-size: 14px; font-weight: bold; color: #eceff4; background: rgba(59, 66, 82, 0.4); padding: 2px 5px; border-radius: 4px; }
        #${POPUP_ID} .theme-section { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding-top: 15px; border-top: 1px solid rgba(216, 222, 233, 0.1); margin-top: 18px; }
        #${POPUP_ID} .theme-section span { color: #d8dee9; font-size: 12px; }
        #${POPUP_ID} .theme-section strong { color: #eceff4; font-weight: 600; }
        #${POPUP_ID} .customizer-button { background-color: #5e81ac; color: #eceff4; border: none; border-radius: 5px; padding: 8px 15px; /* Slightly larger padding */ font-size: 13px; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.2); width: 100%; /* Make theme button full width */ text-align: center; }
        #${POPUP_ID} .customizer-button:hover { background-color: #81a1c1; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        #${POPUP_ID} .customizer-button:active { transform: translateY(1px); }
        #${POPUP_ID} .customizer-button.secondary { background-color: #4c566a; color: #d8dee9; }
        #${POPUP_ID} .customizer-button.secondary:hover { background-color: #5e6a7e; }
        #${POPUP_ID} .customizer-footer { margin-top: 0; padding: 15px 18px; border-top: 1px solid rgba(216, 222, 233, 0.1); }
        #${POPUP_ID} #${THEME_LIST_ID} { max-height: 280px; overflow-y: auto; margin: 10px 0; padding: 0 18px 10px 18px; /* Padding inside list container */ }
        #${POPUP_ID} .theme-item { padding: 10px 12px; margin-bottom: 8px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(76, 86, 106, 0.5); background-color: rgba(59, 66, 82, 0.4); transition: background-color 0.2s ease, border-color 0.2s ease; }
        #${POPUP_ID} .theme-item:hover { background-color: rgba(76, 86, 106, 0.7); border-color: #5e81ac; }
        #${POPUP_ID} .theme-item-name { font-weight: 600; display: block; margin-bottom: 4px; color: #eceff4; font-size: 14px; }
        #${POPUP_ID} .theme-item-desc { font-size: 12px; color: #d8dee9; opacity: 0.8; line-height: 1.4; }
        #${LOGO_ID} { cursor: pointer !important; pointer-events: auto !important; transition: transform 0.2s ease, opacity 0.2s ease !important; opacity: 0.7 !important; }
        #${LOGO_ID}:hover { transform: scale(1.1) !important; opacity: 1 !important; }
    `;

    // --- Core Logic Functions --- (Minor change in applyTheme for light/dark detection)
    function applyDynamicStyles() { // Unchanged
        if (!dynamicStyleElement) {
            dynamicStyleElement = document.createElement('style');
            dynamicStyleElement.id = DYNAMIC_STYLE_ID;
            document.head.appendChild(dynamicStyleElement);
        }
        const fontSize = `${currentFontSize}px`;
        const lineHeight = `${Math.round(currentFontSize * 1.6)}px`;
        dynamicStyleElement.textContent = `
            :root {
                --dynamic-font-size: ${fontSize};
                --dynamic-line-height: ${lineHeight};
            }
            [data-ui-component="MessageTextSpan"],
            [data-ui-component="MessageTextSpan"] > em,
            [data-ui-component="MessageTextSpan"] > q {
                font-size: var(--dynamic-font-size) !important;
            }
             [data-ui-component="MessageContentContainer"] {
                 line-height: var(--dynamic-line-height) !important;
             }
            [data-ui-component="MessageInputTextarea"] {
                 font-size: var(--dynamic-font-size) !important;
                 line-height: 1.5 !important;
            }
        `;
        if (fontValue) fontValue.textContent = `${currentFontSize}px`;
    }
     function applyTheme(themeKey) { // Adjusted light theme check
         currentThemeKey = themes[themeKey] ? themeKey : DEFAULT_THEME_KEY;
         const theme = themes[currentThemeKey];
         console.log(`Applying theme: "${theme.name}" (Key: ${currentThemeKey})`);
         if (!themeStyleElement) {
             themeStyleElement = document.createElement('style');
             themeStyleElement.id = THEME_STYLE_ID;
             document.head.appendChild(themeStyleElement);
         }
         document.documentElement.className = document.documentElement.className.replace(/ theme-\S+/g, '');
         document.documentElement.classList.add(`theme-${currentThemeKey}`);
         themeStyleElement.textContent = theme.css;
         if (themeDisplay) themeDisplay.textContent = theme.name;
         if (popupElement) popupElement.dataset.activeTheme = currentThemeKey;

         // Detect if the *currently applied* theme is conceptually light, even if background is dark
         // No light themes remain in this version, but keeping logic flexible
         const isConceptuallyLight = false; // None of the active themes are light anymore

          if (isConceptuallyLight) { // This block will likely not run with current themes
              document.documentElement.classList.remove('dark');
              document.documentElement.style.colorScheme = 'light';
          } else {
              document.documentElement.classList.add('dark'); // Assume dark unless explicitly light
              document.documentElement.style.colorScheme = 'dark';
          }
     }
     async function saveSettings() { /* Unchanged */ try { await GM_setValue(STORAGE_FONT_SIZE_KEY, currentFontSize); console.log(`Saved FontSize: ${currentFontSize}`); } catch (e) { console.error("Error saving font size:", e); } }
     async function saveTheme() { /* Unchanged */ try { await GM_setValue(STORAGE_THEME_KEY, currentThemeKey); console.log(`Saved Theme: ${currentThemeKey}`); } catch (e) { console.error("Error saving theme:", e); } }
     async function loadSettings() { /* Unchanged */ try { currentThemeKey = await GM_getValue(STORAGE_THEME_KEY, DEFAULT_THEME_KEY); currentFontSize = await GM_getValue(STORAGE_FONT_SIZE_KEY, DEFAULT_FONT_SIZE); currentFontSize = Math.max(8, Math.min(32, parseInt(currentFontSize, 10) || DEFAULT_FONT_SIZE)); if (!themes[currentThemeKey]) { console.warn(`Loaded theme key "${currentThemeKey}" not found or removed. Using default (${DEFAULT_THEME_KEY}).`); currentThemeKey = DEFAULT_THEME_KEY; await saveTheme(); } } catch (e) { console.error("Error loading settings:", e); currentThemeKey = DEFAULT_THEME_KEY; currentFontSize = DEFAULT_FONT_SIZE; } console.log(`Loaded Settings: Theme=${currentThemeKey}, Font=${currentFontSize}px`); }
     function resetSettings() { /* Unchanged */ console.log("Resetting font size to default..."); currentFontSize = DEFAULT_FONT_SIZE; if (fontSlider) fontSlider.value = currentFontSize; applyDynamicStyles(); saveSettings(); }
     function populateThemeList() { /* Unchanged */ if (!themeListContainer) return; themeListContainer.innerHTML = ''; for (const key in themes) { const theme = themes[key]; const item = document.createElement('div'); item.className = 'theme-item'; item.dataset.themeKey = key; item.innerHTML = `<span class="theme-item-name">${theme.name}</span> <span class="theme-item-desc">${theme.description}</span>`; item.addEventListener('click', () => { applyTheme(key); saveTheme(); switchView('settings'); }); themeListContainer.appendChild(item); } }
     function switchView(viewName) { /* Unchanged */ if (!settingsView || !themesView || !popupElement) return; settingsView.style.display = (viewName === 'settings') ? 'block' : 'none'; themesView.style.display = (viewName === 'themes') ? 'block' : 'none'; }
     function togglePopup() { /* Unchanged */ if (!popupElement) return; const isVisible = popupElement.classList.contains('visible'); if (!isVisible) { positionPopup(); void popupElement.offsetWidth; popupElement.classList.add('visible'); console.log("Popup opened"); } else { popupElement.classList.remove('visible'); console.log("Popup closed"); } }
     function positionPopup() { /* Unchanged */ if (!popupElement) return; popupElement.style.top = '15px'; popupElement.style.right = '15px'; popupElement.style.bottom = 'auto'; popupElement.style.left = 'auto'; }

    // --- Initialization --- (Unchanged)
    async function initialize() {
        if (isInitialized) {
            console.log(`SpicyChat UI Customizer v${GM_info.script.version}: Already initialized.`);
            return;
        }
        console.log(`SpicyChat UI Customizer v${GM_info.script.version}: Starting initialization...`);

        logoElement = document.getElementById(LOGO_ID);
        if (!logoElement) {
            console.warn("Logic Core's logo element not found. Retrying in 1.5s...");
            setTimeout(initialize, 1500);
            return;
        }
        console.log("Logic Core's logo element detected.");

        isInitialized = true;

        await loadSettings();

        if (!document.getElementById(POPUP_ID)) {
             popupElement = document.createElement('div');
             popupElement.id = POPUP_ID;
             document.body.appendChild(popupElement);
             console.log("Popup element created.");
        } else {
             popupElement = document.getElementById(POPUP_ID);
             console.log("Popup element found, will be updated.");
        }
        // Inject latest HTML including version number
        popupElement.innerHTML = popupHTML;

        settingsView = document.getElementById(VIEW_SETTINGS_ID);
        themesView = document.getElementById(VIEW_THEMES_ID);
        fontSlider = document.getElementById(FONT_SLIDER_ID);
        fontValue = document.getElementById(FONT_VALUE_ID);
        themeDisplay = document.getElementById(THEME_DISPLAY_ID);
        changeThemeBtn = document.getElementById(CHANGE_THEME_BTN_ID);
        resetBtn = document.getElementById(RESET_BTN_ID);
        themeListContainer = document.getElementById(THEME_LIST_ID);
        backBtn = document.getElementById(BACK_BTN_ID);

        if (!settingsView || !themesView || !fontSlider || !fontValue || !themeDisplay || !changeThemeBtn || !resetBtn || !themeListContainer || !backBtn) {
            console.error("Initialization failed: Could not find all essential GUI elements after creation! Check IDs in popupHTML.");
            if (popupElement) popupElement.remove();
            isInitialized = false;
            return;
        }
        console.log("GUI elements successfully referenced.");

        GM_addStyle(guiStyles);
        populateThemeList();
        fontSlider.value = currentFontSize;
        applyTheme(currentThemeKey); // Apply theme first
        applyDynamicStyles(); // Apply font size after

        // --- Add Event Listeners (Idempotent checks) --- (Unchanged)
        if (!logoElement.dataset.customizerListener) { logoElement.addEventListener('click', (e) => { e.stopPropagation(); togglePopup(); }); logoElement.dataset.customizerListener = 'true'; console.log("Logo click listener added."); }
        if (!fontSlider.dataset.listenerAdded) { fontSlider.addEventListener('input', () => { currentFontSize = fontSlider.value; applyDynamicStyles(); }); fontSlider.addEventListener('change', saveSettings); fontSlider.dataset.listenerAdded = 'true'; console.log("Font slider listeners added."); }
        if (!resetBtn.dataset.listenerAdded) { resetBtn.addEventListener('click', resetSettings); resetBtn.dataset.listenerAdded = 'true'; console.log("Reset button listener added."); }
        if (!changeThemeBtn.dataset.listenerAdded) { changeThemeBtn.addEventListener('click', () => switchView('themes')); changeThemeBtn.dataset.listenerAdded = 'true'; console.log("Change theme button listener added."); }
        if (!backBtn.dataset.listenerAdded) { backBtn.addEventListener('click', () => switchView('settings')); backBtn.dataset.listenerAdded = 'true'; console.log("Back button listener added."); }
        if (!document.body.dataset.customizerPopupListener) { document.addEventListener('click', (event) => { if (popupElement && popupElement.classList.contains('visible')) { if (!popupElement.contains(event.target) && !logoElement.contains(event.target)) { togglePopup(); } } }, true); document.body.dataset.customizerPopupListener = 'true'; console.log("Document click listener for popup closure added."); }

        console.log(`SpicyChat UI Customizer v${GM_info.script.version}: Initialization complete.`);
    }

    // --- Start Initialization --- (Keep delay)
    const INITIALIZATION_DELAY = 4500;
    console.log(`SpicyChat UI Customizer v${GM_info.script.version}: Waiting ${INITIALIZATION_DELAY}ms for Logic Core...`);
    setTimeout(initialize, INITIALIZATION_DELAY);

})();
