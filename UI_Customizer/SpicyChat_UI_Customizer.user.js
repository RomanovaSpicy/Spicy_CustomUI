// ==UserScript==
// @name         SpicyChat UI Customizer
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  Customize SpicyChat UI. Requires 'SpicyChat Logic Core'.
// @author       Discord: @encode_your, SpicyChat: @sophieaaa
// @match        https://spicychat.ai/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spicychat.ai
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

    GM_addStyle(':root { --message-bg-opacity: 1.0; }');

    const LOGO_ID = 'sc-persistent-logo';
    const POPUP_ID = 'sc-ui-customizer-popup';
    const DYNAMIC_STYLE_ID = 'sc-dynamic-customizer-style';
    const THEME_STYLE_ID = 'sc-current-theme-style';
    const BACKGROUND_STYLE_ID = 'sc-custom-background-style';
    const VIEW_SETTINGS_ID = 'sc-view-settings';
    const VIEW_THEMES_ID = 'sc-view-themes';

    const FONT_SLIDER_ID = 'sc-fontsize-slider';
    const FONT_VALUE_ID = 'sc-fontsize-value';
    const WIDTH_SLIDER_ID = 'sc-width-slider';
    const WIDTH_VALUE_ID = 'sc-width-value';
    const OPACITY_SLIDER_ID = 'sc-opacity-slider';
    const OPACITY_VALUE_ID = 'sc-opacity-value';
    const AVATAR_SIZE_SLIDER_ID = 'sc-avatarsize-slider';
    const AVATAR_SIZE_VALUE_ID = 'sc-avatarsize-value';

    const THEME_DISPLAY_ID = 'sc-current-theme-name';
    const CHANGE_THEME_BTN_ID = 'sc-change-theme-btn';
    const RESET_BTN_ID = 'sc-reset-settings-btn';
    const THEME_LIST_ID = 'sc-theme-list-container';
    const BACK_BTN_ID = 'sc-back-to-settings-btn';
    const BACKGROUND_URL_INPUT_ID = 'sc-background-url-input';
    const APPLY_BG_BTN_ID = 'sc-apply-bg-btn';
    const RESET_BG_BTN_ID = 'sc-reset-bg-btn';
    const WIDTH_STYLE_ID = 'sc-dynamic-width-style';
    const BUTTON_ORDER_SELECT_ID = 'sc-button-order-select';

    const STORAGE_THEME_KEY = 'scUICustomizer_Theme_v1';
    const STORAGE_FONT_SIZE_KEY = 'scUICustomizer_FontSize_v1';
    const STORAGE_WIDTH_KEY = 'scUICustomizer_Width_v1';
    const STORAGE_BACKGROUND_URL_KEY = 'scUICustomizer_BackgroundURL_v1';
    const STORAGE_OPACITY_KEY = 'scUICustomizer_Opacity_v1';
    const STORAGE_AVATAR_SIZE_KEY = 'scUICustomizer_AvatarSize_v1';
    const STORAGE_BUTTON_ORDER_KEY = 'scUICustomizer_ButtonOrder_v1';

    const SHARED_CHAT_CONTAINER_SELECTOR = 'div.grow.flex.flex-col.w-full.left-0.items-center.absolute.h-full.overflow-auto';
    const BACKGROUND_TARGET_SELECTOR = SHARED_CHAT_CONTAINER_SELECTOR;
    const CHAT_MESSAGES_CONTAINER_SELECTOR = SHARED_CHAT_CONTAINER_SELECTOR;

    const DEFAULT_FONT_SIZE = 14;
    const DEFAULT_THEME_KEY = 'coastal_mist';
    const DEFAULT_BACKGROUND_URL = null;
    const DEFAULT_OPACITY = 1.0;
    const MIN_WIDTH_SLIDER = 40;
    const MAX_WIDTH_SLIDER = 100;
    const DEFAULT_WIDTH_SLIDER = 50;

    const MIN_AVATAR_SIZE = 45;
    const MAX_AVATAR_SIZE = 150;
    const DEFAULT_AVATAR_SIZE = 45;
    const DEFAULT_BUTTON_ORDER = 'default';

    const messageContainerSelector_SLIDER = ".py-lg > .gap-md[style*='max-width:']";
    const AVATAR_BUTTON_SELECTOR_USER = '[data-ui-component="UserMessageAvatarButton"]';
    const AVATAR_BUTTON_SELECTOR_BOT = '[data-ui-component="BotMessageAvatarButton"]';
    const ALL_AVATAR_BUTTON_SELECTORS = `${AVATAR_BUTTON_SELECTOR_USER}, ${AVATAR_BUTTON_SELECTOR_BOT}`;

    const MESSAGE_ACTIONS_CONTAINER_SELECTOR = 'div[data-ui-component="BotMessageActionsContainer"]';
    const BUTTON_SELECTOR_STAR = 'button[data-ui-component="BotMessageRateButton"]';
    const BUTTON_SELECTOR_TTS = 'button[data-ui-component="BotMessageReadAloudButton"]';
    const BUTTON_SELECTOR_REGENERATE = 'button[data-ui-component="BotMessageRegenerateButton"]';
    const BUTTON_SELECTOR_EDIT = 'button[data-ui-component="BotMessageAddVariantButton"]';

    const themes = {
        'coastal_mist': {
            name: '🌫️ Coastal Mist',
            description: 'Refined dark theme. Clear text hierarchy, comfortable blues/greys, professional feel.',
            css: `:root { --cm-bg-0: #1A1D23; --cm-bg-1: #21252E; --cm-bg-2: #2A303C; --cm-bg-3: #384050; --cm-text-main: #E0E5F0; --cm-text-italic: #C3A6D5; --cm-text-quote: #88C0D0; --cm-text-sender: #9EB0C7; --cm-accent: #81A1C1; --cm-accent-hover: #8FBCBB; --cm-border: #3E485A; --cm-border-focus: #5E81AC; --cm-shadow-heavy: rgba(0, 0, 0, 0.4); --cm-shadow-medium: rgba(0, 0, 0, 0.25); --cm-shadow-light: rgba(0, 0, 0, 0.15); --cm-user-message-bg: var(--cm-bg-1); --cm-bot-message-bg: var(--cm-bg-2); } html.dark body { background: linear-gradient(170deg, var(--cm-bg-0) 0%, var(--cm-bg-1) 100%) !important; background-attachment: fixed !important; font-family: 'Inter', sans-serif; } html.dark body::before { display: none !important; } [data-ui-component="SideNavBar"], ${SHARED_CHAT_CONTAINER_SELECTOR} { background-color: transparent !important; scrollbar-width: thin !important; scrollbar-color: var(--cm-bg-3) transparent !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar { width: 9px !important; height: 9px !important; background-color: transparent !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar-track, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar-track { background: rgba(33, 37, 46, 0.4) !important; border-radius: 5px !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar-thumb { background-color: var(--cm-bg-3) !important; border-radius: 5px !important; border: 1px solid var(--cm-bg-1) !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar-thumb:hover { background-color: var(--cm-accent) !important; } [data-ui-component="ChatHeaderBar"] { background: var(--cm-bg-1) !important; border-bottom: 1px solid var(--cm-border) !important; box-shadow: 0 3px 8px var(--cm-shadow-medium); padding: 6px 0 !important; } [data-ui-component="SideNavBar"] { background: var(--cm-bg-1) !important; border-right: 1px solid var(--cm-border) !important; box-shadow: 2px 0 7px var(--cm-shadow-medium); } [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: #C0CADB !important; font-weight: 500; } [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--cm-text-sender) !important; transition: stroke 0.2s ease; } [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--cm-accent-hover) !important; } [data-ui-component^="SideNav"] button { color: var(--cm-text-sender) !important; transition: background-color 0.2s ease, color 0.2s ease, border-left-color 0.2s ease; border-radius: 0 5px 5px 0 !important; padding: 8px 12px 8px 15px; border-left: 3px solid transparent; } [data-ui-component^="SideNav"] button:hover { background-color: var(--cm-accent) !important; color: var(--cm-bg-0) !important; border-left-color: var(--cm-accent-hover) !important; } [data-ui-component^="SideNav"] button svg { stroke: var(--cm-text-sender) !important; transition: stroke 0.2s ease; } [data-ui-component^="SideNav"] button:hover svg { stroke: var(--cm-bg-0) !important; } [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: color-mix(in srgb, transparent, var(--cm-bot-message-bg) calc(var(--message-bg-opacity) * 100%)) !important; } [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatMessageWrapper"].bg-gray-4 { background-color: color-mix(in srgb, transparent, var(--cm-user-message-bg) calc(var(--message-bg-opacity) * 100%)) !important; } [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] { border: 1px solid var(--cm-border) !important; border-radius: 8px !important; padding: 1rem 1.3rem !important; margin-bottom: 1.1rem !important; box-shadow: 0 3px 8px var(--cm-shadow-light); transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.1s ease, width 0.1s ease-out, background-color 0.2s ease; } [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--cm-border-focus) !important; box-shadow: 0 5px 12px var(--cm-shadow-medium); transform: translateY(-1px); } [data-ui-component="BotMessageContainer"] { border-left: 3px solid var(--cm-accent) !important; } [data-ui-component="UserMessageBackgroundContainer"] { border-left: 3px solid var(--cm-bg-3) !important; } [data-ui-component="ChatHeroInnerContainer"] { background: linear-gradient(145deg, var(--cm-bg-2), var(--cm-bg-1)); border-color: var(--cm-border) !important; box-shadow: 0 4px 10px var(--cm-shadow-medium); } [data-ui-component="MessageSenderName"] { color: var(--cm-text-sender) !important; font-weight: 600; margin-bottom: 5px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.5px;} [data-ui-component="MessageTextSpan"] { color: var(--cm-text-main) !important; line-height: inherit !important; } [data-ui-component="MessageTextSpan"] > em { color: var(--cm-text-italic) !important; font-style: italic !important; font-weight: 500; } [data-ui-component="MessageTextSpan"] > q { color: var(--cm-text-quote) !important; font-style: italic !important; opacity: 1; background-color: rgba(136, 192, 208, 0.08); border-left: 3px solid rgba(136, 192, 208, 0.5); padding: 0.1em 0.6em; display: inline-block; margin: 0.15em 0; border-radius: 0 4px 4px 0; } [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--cm-text-sender) !important; transition: stroke 0.2s ease; } [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--cm-accent-hover) !important; } [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: #EBCB8B !important; stroke: #EBCB8B !important; } [data-ui-component="ChatInputBarContainer"] { background-color: transparent !important; border-top: none !important; padding: 5px 10px 15px 10px !important; } [data-ui-component="ChatInputBarInnerContainer"] { padding: 0 !important; } [data-ui-component="TextInputAreaWrapper"] { background-color: var(--cm-bg-1) !important; border: 1px solid var(--cm-border) !important; border-radius: 8px !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); margin: 0 !important; padding: 4px 10px !important; transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; display: flex !important; align-items: center; } [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--cm-border-focus) !important; background-color: var(--cm-bg-2) !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 0 0 3px rgba(94, 129, 172, 0.2); } [data-ui-component="MessageInputTextarea"] { color: var(--cm-text-main) !important; caret-color: var(--cm-accent); background: transparent !important; padding: 11px 8px !important; flex-grow: 1; font-size: inherit; line-height: 1.6 !important; } [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--cm-text-sender) !important; opacity: 0.6; font-style: italic; } [data-ui-component="SendButtonContainer"] { background-color: var(--cm-accent) !important; border-radius: 7px !important; margin-left: 10px !important; padding: 9px !important; transition: background-color 0.2s ease, transform 0.1s ease; box-shadow: 0 2px 4px var(--cm-shadow-medium); display: flex; align-items: center; justify-content: center; border: none; } [data-ui-component="SendButtonContainer"]:hover { background-color: var(--cm-accent-hover) !important; transform: scale(1.05); } [data-ui-component="SendButtonIcon"] { stroke: var(--cm-bg-0) !important; width: 22px; height: 22px; }`
        },
        'librarium_dusk_dark': {
            name: '📚 Librarium Dusk (Dark)',
            description: 'Dark & cozy library feel. Creamy text on deep browns, warm amber/gold accents, serif font.',
            css: `:root { --ldd-bg-0: #261F1A; --ldd-bg-1: #3A2D25; --ldd-bg-2: #4A3C31; --ldd-bg-3: #5C4E44; --ldd-text-main: #EAE0D5; --ldd-text-italic: #E8B878; --ldd-text-quote: #A0B8A8; --ldd-text-sender: #A89888; --ldd-accent: #C5A06A; --ldd-accent-hover: #D8B884; --ldd-border: #5C4E44; --ldd-border-focus: #C5A06A; --ldd-shadow-heavy: rgba(0, 0, 0, 0.5); --ldd-shadow-medium: rgba(0, 0, 0, 0.3); --ldd-shadow-light: rgba(0, 0, 0, 0.2); --ldd-texture: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE1ODgzNEFGMjkyMTExRUE5OEI3RDI2NzQ2Rjg3QUU3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE1ODgzNEIwMjkyMTExRUE5OEI3RDI2NzQ2Rjg3QUU3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTU4ODM0QUQyOTIxMTFFQTk4QjdEMjY3NDZGODdBRTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTU4ODM0QUUyOTIxMTFFQTk4QjdEMjY3NDZGODdBRTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6aNps0AAAAWUlEQVR42uzMMQEAAAgDINcP9qUQ+6cBQa4caCp48uTJkydPnjx58uTJkydPnjx58uTJkydPnjx58uTJkydPnjx58uTJkydPnjx58uTJkydPnjx58uTJkyc/LoAAMAQ9r6gAUUB40AAAAASUVORK5CYII='); --ldd-user-message-bg: var(--ldd-bg-1); --ldd-bot-message-bg: var(--ldd-bg-2); } html.dark body { background: var(--ldd-bg-0) !important; background-image: var(--ldd-texture), linear-gradient(170deg, var(--ldd-bg-0) 0%, #1c1612 100%) !important; background-blend-mode: overlay; background-attachment: fixed !important; font-family: 'Merriweather', serif; color: var(--ldd-text-main); } html.dark body::before { display: none !important; } [data-ui-component="SideNavBar"], ${SHARED_CHAT_CONTAINER_SELECTOR} { background-color: transparent !important; scrollbar-width: thin !important; scrollbar-color: var(--ldd-bg-3) transparent !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar { width: 10px !important; height: 10px !important; background-color: transparent !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar-track, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar-track { background: rgba(58, 45, 37, 0.4) !important; border-radius: 5px !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar-thumb { background-color: var(--ldd-bg-3) !important; border-radius: 5px !important; border: 1px solid var(--ldd-bg-1) !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar-thumb:hover { background-color: var(--ldd-accent) !important; } [data-ui-component="ChatHeaderBar"] { background: var(--ldd-bg-1) !important; background-image: var(--ldd-texture) !important; background-blend-mode: overlay; border-bottom: 1px solid var(--ldd-border) !important; box-shadow: 0 2px 7px var(--ldd-shadow-medium); padding: 6px 0 !important; } [data-ui-component="SideNavBar"] { background: var(--ldd-bg-1) !important; background-image: var(--ldd-texture) !important; background-blend-mode: overlay; border-right: 1px solid var(--ldd-border) !important; box-shadow: 2px 0 6px var(--ldd-shadow-medium); } [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: #D4C8BC !important; font-weight: 500; font-family: 'Inter', sans-serif; } [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--ldd-text-sender) !important; transition: stroke 0.2s ease; } [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--ldd-accent-hover) !important; } [data-ui-component^="SideNav"] button { color: var(--ldd-text-sender) !important; transition: background-color 0.2s ease, color 0.2s ease; border-radius: 5px !important; font-family: 'Inter', sans-serif; padding: 8px 12px; } [data-ui-component^="SideNav"] button:hover { background-color: var(--ldd-accent) !important; color: var(--ldd-bg-0) !important; } [data-ui-component^="SideNav"] button svg { stroke: var(--ldd-text-sender) !important; transition: stroke 0.2s ease; } [data-ui-component^="SideNav"] button:hover svg { stroke: var(--ldd-bg-0) !important; } [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: color-mix(in srgb, transparent, var(--ldd-bot-message-bg) calc(var(--message-bg-opacity) * 100%)) !important; } [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatMessageWrapper"].bg-gray-4 { background-color: color-mix(in srgb, transparent, var(--ldd-user-message-bg) calc(var(--message-bg-opacity) * 100%)) !important; } [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] { border: 1px solid var(--ldd-border) !important; background-image: var(--ldd-texture) !important; background-blend-mode: overlay; border-radius: 6px !important; padding: 1rem 1.3rem !important; margin-bottom: 1.1rem !important; box-shadow: 0 3px 8px var(--ldd-shadow-light); transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.1s ease, width 0.1s ease-out, background-color 0.2s ease; } [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--ldd-border-focus) !important; box-shadow: 0 5px 12px var(--ldd-shadow-medium); transform: translateY(-1px); } [data-ui-component="BotMessageContainer"] { border-left: 3px solid var(--ldd-accent) !important; } [data-ui-component="UserMessageBackgroundContainer"] { border-left: 3px solid var(--ldd-bg-3) !important; } [data-ui-component="ChatHeroInnerContainer"] { background: linear-gradient(145deg, var(--ldd-bg-2), var(--ldd-bg-1)); border-color: var(--ldd-border) !important; box-shadow: 0 4px 10px var(--ldd-shadow-medium); } [data-ui-component="MessageSenderName"] { color: var(--ldd-text-sender) !important; font-weight: 600; font-family: 'Inter', sans-serif; margin-bottom: 5px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.5px; } [data-ui-component="MessageTextSpan"] { color: var(--ldd-text-main) !important; line-height: inherit !important; } [data-ui-component="MessageTextSpan"] > em { color: var(--ldd-text-italic) !important; font-style: italic !important; font-weight: 500; } [data-ui-component="MessageTextSpan"] > q { color: var(--ldd-text-quote) !important; font-style: italic !important; opacity: 1; background-color: rgba(160, 184, 168, 0.1); border-left: 3px solid rgba(160, 184, 168, 0.5); padding: 0.1em 0.6em; display: inline-block; margin: 0.15em 0; border-radius: 0 4px 4px 0; } [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--ldd-text-sender) !important; transition: stroke 0.2s ease; } [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--ldd-accent-hover) !important; } [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: #E8B878 !important; stroke: #D4A06A !important; } [data-ui-component="ChatInputBarContainer"] { background-color: transparent !important; border-top: none !important; padding: 5px 10px 15px 10px !important; } [data-ui-component="ChatInputBarInnerContainer"] { padding: 0 !important; } [data-ui-component="TextInputAreaWrapper"] { background-color: var(--ldd-bg-1) !important; background-image: var(--ldd-texture) !important; background-blend-mode: overlay; border: 1px solid var(--ldd-border) !important; border-radius: 6px !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); margin: 0 !important; padding: 4px 10px !important; transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; display: flex !important; align-items: center; } [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--ldd-border-focus) !important; background-color: var(--ldd-bg-2) !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3), 0 0 0 3px rgba(197, 160, 106, 0.25); } [data-ui-component="MessageInputTextarea"] { color: var(--ldd-text-main) !important; caret-color: var(--ldd-accent); background: transparent !important; padding: 11px 8px !important; flex-grow: 1; font-size: inherit; line-height: 1.6 !important; font-family: 'Merriweather', serif; } [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--ldd-text-sender) !important; opacity: 0.6; font-style: italic; } [data-ui-component="SendButtonContainer"] { background-color: var(--ldd-accent) !important; border-radius: 5px !important; margin-left: 10px !important; padding: 9px !important; transition: background-color 0.2s ease, transform 0.1s ease; box-shadow: 0 2px 4px var(--ldd-shadow-medium); display: flex; align-items: center; justify-content: center; border: none; } [data-ui-component="SendButtonContainer"]:hover { background-color: var(--ldd-accent-hover) !important; transform: scale(1.05); } [data-ui-component="SendButtonIcon"] { stroke: var(--ldd-bg-0) !important; width: 22px; height: 22px; }`
        },
        'sakura_dreams_night': {
            name: '🌙 Sakura Dreams (Night)',
            description: 'Moonlit pastels. Soft lavender text on deep indigo, pink/mint accents.',
            css: `:root { --sdn-bg-0: #1E1C2B; --sdn-bg-1: #2A283A; --sdn-bg-2: #353248; --sdn-bg-3: #45415A; --sdn-text-main: #EAE6F5; --sdn-text-italic: #F8A0C4; --sdn-text-quote: #A0D8C0; --sdn-text-sender: #A8A0B8; --sdn-accent-pink: #E888AE; --sdn-accent-pink-hover: #F0A0C0; --sdn-accent-green: #8FBC8F; --sdn-border: #45415A; --sdn-border-focus: #E888AE; --sdn-shadow-heavy: rgba(0, 0, 0, 0.5); --sdn-shadow-medium: rgba(0, 0, 0, 0.3); --sdn-shadow-light: rgba(0, 0, 0, 0.2); --sdn-texture: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M50 0 C 50 0, 0 50, 50 100 C 100 50, 50 0, 50 0 Z" fill="%23${'EAE6F5'.substring(1)}" opacity="0.02" transform="rotate(45 50 50) scale(1.5)" /></svg>'); --sdn-user-message-bg: var(--sdn-bg-1); --sdn-bot-message-bg: var(--sdn-bg-2); } html.dark body { background: var(--sdn-bg-0) !important; background-image: var(--sdn-texture), linear-gradient(170deg, var(--sdn-bg-0) 0%, #151320 100%) !important; background-blend-mode: overlay; background-attachment: fixed !important; font-family: 'Inter', sans-serif; color: var(--sdn-text-main); } html.dark body::before { display: none !important; } [data-ui-component="SideNavBar"], ${SHARED_CHAT_CONTAINER_SELECTOR} { background-color: transparent !important; scrollbar-width: thin !important; scrollbar-color: var(--sdn-bg-3) transparent !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar { width: 9px !important; height: 9px !important; background-color: transparent !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar-track, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar-track { background: rgba(42, 40, 58, 0.4) !important; border-radius: 5px !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar-thumb { background-color: var(--sdn-bg-3) !important; border-radius: 5px !important; border: 1px solid var(--sdn-bg-1) !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar-thumb:hover { background-color: var(--sdn-accent-pink) !important; } [data-ui-component="ChatHeaderBar"] { background: var(--sdn-bg-1) !important; border-bottom: 1px solid var(--sdn-border) !important; box-shadow: 0 2px 7px var(--sdn-shadow-medium); padding: 6px 0 !important; } [data-ui-component="SideNavBar"] { background: var(--sdn-bg-1) !important; border-right: 1px solid var(--sdn-border) !important; box-shadow: 1px 0 6px var(--sdn-shadow-medium); } [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: #D0C8E0 !important; font-weight: 500; } [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--sdn-text-sender) !important; transition: stroke 0.2s ease; } [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--sdn-accent-pink-hover) !important; } [data-ui-component^="SideNav"] button { color: var(--sdn-text-sender) !important; transition: background-color 0.2s ease, color 0.2s ease, border-left-color 0.2s ease; border-radius: 0 6px 6px 0 !important; padding: 8px 12px 8px 15px; border-left: 3px solid transparent; } [data-ui-component^="SideNav"] button:hover { background-color: var(--sdn-accent-pink) !important; color: #FFFFFF !important; border-left-color: var(--sdn-accent-pink-hover) !important; } [data-ui-component^="SideNav"] button svg { stroke: var(--sdn-text-sender) !important; transition: stroke 0.2s ease; } [data-ui-component^="SideNav"] button:hover svg { stroke: #FFFFFF !important; } [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: color-mix(in srgb, transparent, var(--sdn-bot-message-bg) calc(var(--message-bg-opacity) * 100%)) !important; } [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatMessageWrapper"].bg-gray-4 { background-color: color-mix(in srgb, transparent, var(--sdn-user-message-bg) calc(var(--message-bg-opacity) * 100%)) !important; } [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] { border: 1px solid var(--sdn-border) !important; border-radius: 10px !important; padding: 1rem 1.3rem !important; margin-bottom: 1rem !important; box-shadow: 0 3px 8px var(--sdn-shadow-light); transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.1s ease, width 0.1s ease-out, background-color 0.2s ease; } [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--sdn-border-focus) !important; box-shadow: 0 5px 12px var(--sdn-shadow-medium); transform: translateY(-1px); } [data-ui-component="BotMessageContainer"] { border-left: 3px solid var(--sdn-accent-pink) !important; } [data-ui-component="UserMessageBackgroundContainer"] { border-left: 3px solid var(--sdn-accent-green) !important; } [data-ui-component="ChatHeroInnerContainer"] { background: linear-gradient(145deg, var(--sdn-bg-2), var(--sdn-bg-1)); border-color: var(--sdn-border) !important; box-shadow: 0 4px 10px var(--sdn-shadow-medium); } [data-ui-component="MessageSenderName"] { color: var(--sdn-text-sender) !important; font-weight: 600; margin-bottom: 5px; font-size: 0.9em; } [data-ui-component="MessageTextSpan"] { color: var(--sdn-text-main) !important; line-height: inherit !important; } [data-ui-component="MessageTextSpan"] > em { color: var(--sdn-text-italic) !important; font-style: italic !important; font-weight: 500; } [data-ui-component="MessageTextSpan"] > q { color: var(--sdn-text-quote) !important; font-style: italic !important; opacity: 1; background-color: rgba(160, 216, 192, 0.1); border-left: 3px solid rgba(160, 216, 192, 0.5); padding: 0.1em 0.6em; display: inline-block; margin: 0.15em 0; border-radius: 0 4px 4px 0; } [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--sdn-text-sender) !important; transition: stroke 0.2s ease; } [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--sdn-accent-pink-hover) !important; } [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: #FFD700 !important; stroke: #DAA520 !important; } [data-ui-component="ChatInputBarContainer"] { background-color: transparent !important; border-top: none !important; padding: 5px 10px 15px 10px !important; } [data-ui-component="ChatInputBarInnerContainer"] { padding: 0 !important; } [data-ui-component="TextInputAreaWrapper"] { background-color: var(--sdn-bg-1) !important; border: 1px solid var(--sdn-border) !important; border-radius: 10px !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.25); margin: 0 !important; padding: 4px 10px !important; transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; display: flex !important; align-items: center; } [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--sdn-border-focus) !important; background-color: var(--sdn-bg-2) !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.25), 0 0 0 3px rgba(232, 136, 174, 0.2); } [data-ui-component="MessageInputTextarea"] { color: var(--sdn-text-main) !important; caret-color: var(--sdn-accent-pink); background: transparent !important; padding: 11px 8px !important; flex-grow: 1; font-size: inherit; line-height: 1.6 !important; } [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--sdn-text-sender) !important; opacity: 0.6; font-style: italic; } [data-ui-component="SendButtonContainer"] { background-color: var(--sdn-accent-pink) !important; border-radius: 8px !important; margin-left: 10px !important; padding: 9px !important; transition: background-color 0.2s ease, transform 0.1s ease; box-shadow: 0 2px 4px var(--sdn-shadow-medium); display: flex; align-items: center; justify-content: center; border: none; } [data-ui-component="SendButtonContainer"]:hover { background-color: var(--sdn-accent-pink-hover) !important; transform: scale(1.05); } [data-ui-component="SendButtonIcon"] { stroke: #FFFFFF !important; width: 22px; height: 22px; }`
        },
        'golden_sands_twilight': {
            name: '🏜️ Golden Sands (Twilight)',
            description: 'Warm desert night theme. Sandy text on dark bronze, rich gold/copper accents.',
            css: `:root { --gst-bg-0: #201C18; --gst-bg-1: #332A22; --gst-bg-2: #453A2F; --gst-bg-3: #5A4D3F; --gst-text-main: #F5EFE5; --gst-text-italic: #E89868; --gst-text-quote: #88B0A8; --gst-text-sender: #B0A08C; --gst-accent-gold: #D8B884; --gst-accent-gold-hover: #E8C898; --gst-accent-copper: #C88462; --gst-border: #5A4D3F; --gst-border-focus: #D8B884; --gst-shadow-heavy: rgba(0, 0, 0, 0.5); --gst-shadow-medium: rgba(0, 0, 0, 0.3); --gst-shadow-light: rgba(0, 0, 0, 0.2); --gst-texture: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAQKADAAQAAAABAAAAQAAAAABGUUKwAAAAYElEQVR4Ae3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAPgZAADSDAABI5o46AAAAABJRU5ErkJggg=='); --gst-user-message-bg: var(--gst-bg-1); --gst-bot-message-bg: var(--gst-bg-2); } html.dark body { background: var(--gst-bg-0) !important; background-image: var(--gst-texture), linear-gradient(170deg, var(--gst-bg-0) 0%, #181411 100%) !important; background-blend-mode: overlay; background-attachment: fixed !important; font-family: 'Inter', sans-serif; color: var(--gst-text-main); } html.dark body::before { display: none !important; } [data-ui-component="SideNavBar"], ${SHARED_CHAT_CONTAINER_SELECTOR} { background-color: transparent !important; scrollbar-width: thin !important; scrollbar-color: var(--gst-bg-3) transparent !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar { width: 10px !important; height: 10px !important; background-color: transparent !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar-track, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar-track { background: rgba(51, 42, 34, 0.4) !important; border-radius: 5px !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar-thumb { background-color: var(--gst-bg-3) !important; border-radius: 5px !important; border: 1px solid var(--gst-bg-1) !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar-thumb:hover { background-color: var(--gst-accent-gold) !important; } [data-ui-component="ChatHeaderBar"] { background: var(--gst-bg-1) !important; border-bottom: 1px solid var(--gst-border) !important; box-shadow: 0 2px 7px var(--gst-shadow-medium); padding: 6px 0 !important; } [data-ui-component="SideNavBar"] { background: var(--gst-bg-1) !important; border-right: 1px solid var(--gst-border) !important; box-shadow: 1px 0 6px var(--gst-shadow-medium); } [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: #D8C8B4 !important; font-weight: 500; } [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--gst-text-sender) !important; transition: stroke 0.2s ease; } [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--gst-accent-gold-hover) !important; } [data-ui-component^="SideNav"] button { color: var(--gst-text-sender) !important; transition: background-color 0.2s ease, color 0.2s ease; border-radius: 6px !important; padding: 8px 12px; } [data-ui-component^="SideNav"] button:hover { background-color: var(--gst-accent-gold) !important; color: var(--gst-bg-0) !important; } [data-ui-component^="SideNav"] button svg { stroke: var(--gst-text-sender) !important; transition: stroke 0.2s ease; } [data-ui-component^="SideNav"] button:hover svg { stroke: var(--gst-bg-0) !important; } [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: color-mix(in srgb, transparent, var(--gst-bot-message-bg) calc(var(--message-bg-opacity) * 100%)) !important; } [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatMessageWrapper"].bg-gray-4 { background-color: color-mix(in srgb, transparent, var(--gst-user-message-bg) calc(var(--message-bg-opacity) * 100%)) !important; } [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] { border: 1px solid var(--gst-border) !important; background-image: var(--gst-texture) !important; background-blend-mode: overlay; border-radius: 8px !important; padding: 1rem 1.3rem !important; margin-bottom: 1rem !important; box-shadow: 0 3px 8px var(--gst-shadow-light); transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.1s ease, width 0.1s ease-out, background-color 0.2s ease; } [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--gst-border-focus) !important; box-shadow: 0 5px 12px var(--gst-shadow-medium); transform: translateY(-1px); } [data-ui-component="BotMessageContainer"] { border-left: 3px solid var(--gst-accent-gold) !important; } [data-ui-component="UserMessageBackgroundContainer"] { border-left: 3px solid var(--gst-accent-copper) !important; } [data-ui-component="ChatHeroInnerContainer"] { background: linear-gradient(145deg, var(--gst-bg-2), var(--gst-bg-1)); border-color: var(--gst-border) !important; box-shadow: 0 4px 10px var(--gst-shadow-medium); } [data-ui-component="MessageSenderName"] { color: var(--gst-text-sender) !important; font-weight: 600; margin-bottom: 5px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.5px; } [data-ui-component="MessageTextSpan"] { color: var(--gst-text-main) !important; line-height: inherit !important; } [data-ui-component="MessageTextSpan"] > em { color: var(--gst-text-italic) !important; font-style: italic !important; font-weight: 500; } [data-ui-component="MessageTextSpan"] > q { color: var(--gst-text-quote) !important; font-style: italic !important; opacity: 1; background-color: rgba(136, 176, 168, 0.1); border-left: 3px solid rgba(136, 176, 168, 0.5); padding: 0.1em 0.6em; display: inline-block; margin: 0.15em 0; border-radius: 0 4px 4px 0; } [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--gst-text-sender) !important; transition: stroke 0.2s ease; } [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--gst-accent-gold-hover) !important; } [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: var(--gst-accent-copper) !important; stroke: #A86442 !important; } [data-ui-component="ChatInputBarContainer"] { background-color: transparent !important; border-top: none !important; padding: 5px 10px 15px 10px !important; } [data-ui-component="ChatInputBarInnerContainer"] { padding: 0 !important; } [data-ui-component="TextInputAreaWrapper"] { background-color: var(--gst-bg-1) !important; background-image: var(--gst-texture) !important; background-blend-mode: overlay; border: 1px solid var(--gst-border) !important; border-radius: 8px !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); margin: 0 !important; padding: 4px 10px !important; transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; display: flex !important; align-items: center; } [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--gst-border-focus) !important; background-color: var(--gst-bg-2) !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3), 0 0 0 3px rgba(216, 184, 132, 0.25); } [data-ui-component="MessageInputTextarea"] { color: var(--gst-text-main) !important; caret-color: var(--gst-accent-gold); background: transparent !important; padding: 11px 8px !important; flex-grow: 1; font-size: inherit; line-height: 1.6 !important; } [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--gst-text-sender) !important; opacity: 0.6; font-style: italic; } [data-ui-component="SendButtonContainer"] { background-color: var(--gst-accent-gold) !important; border-radius: 7px !important; margin-left: 10px !important; padding: 9px !important; transition: background-color 0.2s ease, transform 0.1s ease; box-shadow: 0 2px 4px var(--gst-shadow-medium); display: flex; align-items: center; justify-content: center; border: none; } [data-ui-component="SendButtonContainer"]:hover { background-color: var(--gst-accent-gold-hover) !important; transform: scale(1.05); } [data-ui-component="SendButtonIcon"] { stroke: var(--gst-bg-0) !important; width: 22px; height: 22px; }`
        },
        'ronin_red': {
            name: '🏮 Ronin Red',
            description: 'High-tech dark theme. Extreme contrast, sharp red accents, clear text hierarchy.',
            css: `:root { --rr-bg-0: #0A0A0C; --rr-bg-1: #121317; --rr-bg-2: #1C1E22; --rr-bg-3: #282A30; --rr-text-main: #F8F9FA; --rr-text-italic: #FF87A7; --rr-text-quote: #87CEFA; --rr-text-sender: #9098A8; --rr-accent-red: #F03E3E; --rr-accent-red-hover: #FF5C5C; --rr-accent-red-active: #D93434; --rr-border: #34363B; --rr-border-focus: #F03E3E; --rr-shadow-heavy: rgba(0, 0, 0, 0.6); --rr-shadow-medium: rgba(0, 0, 0, 0.4); --rr-shadow-light: rgba(0, 0, 0, 0.25); --rr-red-glow: 0 0 10px rgba(240, 62, 62, 0.5); --rr-user-message-bg: var(--rr-bg-1); --rr-bot-message-bg: var(--rr-bg-2); } html.dark body { background: var(--rr-bg-0) !important; font-family: 'Inter', sans-serif; } html.dark body::before { display: none !important; } [data-ui-component="SideNavBar"], ${SHARED_CHAT_CONTAINER_SELECTOR} { background-color: transparent !important; scrollbar-width: thin !important; scrollbar-color: var(--rr-bg-3) transparent !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar { width: 8px !important; height: 8px !important; background-color: transparent !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar-track, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar-track { background: rgba(18, 19, 23, 0.5) !important; border-radius: 4px !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar-thumb { background-color: var(--rr-bg-3) !important; border-radius: 4px !important; border: 1px solid var(--rr-bg-1) !important; } [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover, ${SHARED_CHAT_CONTAINER_SELECTOR}::-webkit-scrollbar-thumb:hover { background-color: var(--rr-accent-red-active) !important; } [data-ui-component="ChatHeaderBar"] { background: var(--rr-bg-1) !important; border-bottom: 1px solid var(--rr-border) !important; box-shadow: 0 3px 8px var(--rr-shadow-medium); padding: 6px 0 !important; } [data-ui-component="SideNavBar"] { background: var(--rr-bg-1) !important; border-right: 1px solid var(--rr-border) !important; box-shadow: 2px 0 7px var(--rr-shadow-medium); } [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: #D8DCE0 !important; font-weight: 500; } [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--rr-text-sender) !important; transition: stroke 0.2s ease, filter 0.2s ease; } [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--rr-accent-red-hover) !important; filter: drop-shadow(var(--rr-red-glow)); } [data-ui-component^="SideNav"] button { color: var(--rr-text-sender) !important; transition: background-color 0.15s ease, color 0.15s ease, border-left-color 0.15s ease; border-radius: 0 4px 4px 0 !important; padding: 8px 12px 8px 15px; border-left: 3px solid transparent; } [data-ui-component^="SideNav"] button:hover { background-color: var(--rr-accent-red) !important; color: #FFFFFF !important; border-left-color: var(--rr-accent-red-hover); } [data-ui-component^="SideNav"] button svg { stroke: var(--rr-text-sender) !important; transition: stroke 0.15s ease; } [data-ui-component^="SideNav"] button:hover svg { stroke: #FFFFFF !important; } [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: color-mix(in srgb, transparent, var(--rr-bot-message-bg) calc(var(--message-bg-opacity) * 100%)) !important; } [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatMessageWrapper"].bg-gray-4 { background-color: color-mix(in srgb, transparent, var(--rr-user-message-bg) calc(var(--message-bg-opacity) * 100%)) !important; } [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] { border: 1px solid var(--rr-border) !important; border-radius: 4px !important; padding: 1rem 1.3rem !important; margin-bottom: 1rem !important; box-shadow: 0 2px 5px var(--rr-shadow-light); transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.1s ease, width 0.1s ease-out, background-color 0.2s ease; } [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--rr-border-focus) !important; box-shadow: 0 4px 8px var(--rr-shadow-medium); transform: translateY(-1px); } [data-ui-component="BotMessageContainer"] { border-left: 3px solid var(--rr-accent-red) !important; } [data-ui-component="UserMessageBackgroundContainer"] { border-left: 3px solid var(--rr-bg-3) !important; } [data-ui-component="ChatHeroInnerContainer"] { background: var(--rr-bg-2) !important; border: 1px solid var(--rr-border) !important; box-shadow: 0 3px 8px var(--rr-shadow-medium); } [data-ui-component="MessageSenderName"] { color: var(--rr-text-sender) !important; font-weight: 600; margin-bottom: 5px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.5px; } [data-ui-component="MessageTextSpan"] { color: var(--rr-text-main) !important; line-height: inherit !important; } [data-ui-component="MessageTextSpan"] > em { color: var(--rr-text-italic) !important; font-style: italic !important; font-weight: 500; } [data-ui-component="MessageTextSpan"] > q { color: var(--rr-text-quote) !important; font-style: italic !important; opacity: 1; background-color: rgba(135, 206, 250, 0.1); border-left: 3px solid rgba(135, 206, 250, 0.5); padding: 0.1em 0.6em; display: inline-block; margin: 0.15em 0; border-radius: 0 4px 4px 0; } [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--rr-text-sender) !important; transition: stroke 0.2s ease, filter 0.2s ease; } [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--rr-accent-red-hover) !important; filter: drop-shadow(var(--rr-red-glow)); } [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: var(--rr-accent-red) !important; stroke: var(--rr-accent-red) !important; filter: drop-shadow(var(--rr-red-glow)); } [data-ui-component="ChatInputBarContainer"] { background-color: transparent !important; border-top: none !important; padding: 5px 10px 15px 10px !important; } [data-ui-component="ChatInputBarInnerContainer"] { padding: 0 !important; } [data-ui-component="TextInputAreaWrapper"] { background-color: var(--rr-bg-1) !important; border: 1px solid var(--rr-border) !important; border-radius: 4px !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); margin: 0 !important; padding: 4px 10px !important; transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; display: flex !important; align-items: center; } [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--rr-border-focus) !important; background-color: var(--rr-bg-2) !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3), 0 0 0 3px rgba(240, 62, 62, 0.25); } [data-ui-component="MessageInputTextarea"] { color: var(--rr-text-main) !important; caret-color: var(--rr-accent-red); background: transparent !important; padding: 11px 8px !important; flex-grow: 1; font-size: inherit; line-height: 1.6 !important; } [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--rr-text-sender) !important; opacity: 0.5; font-style: italic; } [data-ui-component="SendButtonContainer"] { background-color: var(--rr-accent-red) !important; border-radius: 4px !important; margin-left: 10px !important; padding: 9px !important; transition: background-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease; box-shadow: 0 2px 5px var(--rr-shadow-medium), var(--rr-red-glow); display: flex; align-items: center; justify-content: center; border: none; } [data-ui-component="SendButtonContainer"]:hover { background-color: var(--rr-accent-red-hover) !important; box-shadow: 0 3px 7px var(--rr-shadow-heavy), 0 0 12px rgba(255, 92, 92, 0.7); transform: scale(1.05); } [data-ui-component="SendButtonIcon"] { stroke: #FFFFFF !important; width: 22px; height: 22px; }`
        }
    };

    let logoElement, popupElement, dynamicStyleElement, themeStyleElement, backgroundStyleElement, widthStyleElement,
        settingsView, themesView, fontSlider, fontValue, widthSlider, widthValue, themeDisplay,
        changeThemeBtn, resetBtn, themeListContainer, backBtn,
        backgroundUrlInput, applyBgBtn, resetBgBtn,
        opacitySlider, opacityValue,
        avatarSizeSlider, avatarSizeValue,
        buttonOrderSelectElement;

    let currentThemeKey = DEFAULT_THEME_KEY;
    let currentFontSize = DEFAULT_FONT_SIZE;
    let currentWidth = DEFAULT_WIDTH_SLIDER;
    let customBackgroundUrl = DEFAULT_BACKGROUND_URL;
    let currentOpacity = DEFAULT_OPACITY;
    let currentAvatarSize = DEFAULT_AVATAR_SIZE;
    let currentButtonOrder = DEFAULT_BUTTON_ORDER;
    let isInitialized = false;
    let contentObserver = null;

    const popupHTML = `
        <div id="${VIEW_SETTINGS_ID}" style="display: block;">
            <div class="customizer-header">UI Customizer v${GM_info.script.version}</div>
            <div class="customizer-section"> <label for="${FONT_SLIDER_ID}">Message Font Size</label> <div class="slider-container"> <input type="range" id="${FONT_SLIDER_ID}" min="8" max="32" step="1"> <span id="${FONT_VALUE_ID}"></span> </div> </div>
            <div class="customizer-section"> <label for="${WIDTH_SLIDER_ID}">Message Width</label> <div class="slider-container"> <input type="range" id="${WIDTH_SLIDER_ID}" min="${MIN_WIDTH_SLIDER}" max="${MAX_WIDTH_SLIDER}" step="1"> <span id="${WIDTH_VALUE_ID}"></span> </div> </div>
            <div class="customizer-section"> <label for="${OPACITY_SLIDER_ID}">Message BG Opacity</label> <div class="slider-container"> <input type="range" id="${OPACITY_SLIDER_ID}" min="0" max="1" step="0.01"> <span id="${OPACITY_VALUE_ID}"></span> </div> </div>
            <div class="customizer-section"> <label for="${AVATAR_SIZE_SLIDER_ID}">Avatar Size</label> <div class="slider-container"> <input type="range" id="${AVATAR_SIZE_SLIDER_ID}" min="${MIN_AVATAR_SIZE}" max="${MAX_AVATAR_SIZE}" step="1"> <span id="${AVATAR_SIZE_VALUE_ID}"></span> </div> </div>
            <div class="customizer-section">
                <label for="${BUTTON_ORDER_SELECT_ID}">Message Actions Button Order</label>
                <div class="select-container">
                    <select id="${BUTTON_ORDER_SELECT_ID}">
                        <option value="default">ChatPage v2</option>
                        <option value="new">ChatPage v1</option>
                    </select>
                </div>
            </div>
            <div class="customizer-section theme-section"> <span>Current Theme: <strong id="${THEME_DISPLAY_ID}"></strong></span> <button id="${CHANGE_THEME_BTN_ID}" class="customizer-button">Change Theme</button> </div>
            <div class="customizer-section background-section"> <label for="${BACKGROUND_URL_INPUT_ID}">Custom Background URL</label> <input type="text" id="${BACKGROUND_URL_INPUT_ID}" placeholder="Enter image URL..."> <div class="button-group"> <button id="${APPLY_BG_BTN_ID}" class="customizer-button apply-bg">Apply BG</button> <button id="${RESET_BG_BTN_ID}" class="customizer-button secondary reset-bg">Reset BG</button> </div> </div>
            <div class="customizer-footer"> <button id="${RESET_BTN_ID}" class="customizer-button secondary">Reset Font & Width</button> </div>
        </div>
        <div id="${VIEW_THEMES_ID}" style="display: none;"> <div class="customizer-header">Choose Theme</div> <div id="${THEME_LIST_ID}" class="theme-list"></div> <div class="customizer-footer"> <button id="${BACK_BTN_ID}" class="customizer-button secondary">Back</button> </div> </div>
    `;

    const guiStyles = `
        #${POPUP_ID} { display: none !important; position: fixed !important; z-index: 100005 !important; top: 15px !important; right: 15px !important; bottom: auto !important; left: auto !important; background-color: rgba(44, 48, 56, 0.92) !important; color: #d8dee9 !important; border: 1px solid rgba(216, 222, 233, 0.15) !important; border-radius: 8px !important; width: 300px !important; padding: 0px !important; font-size: 13px !important; font-family: 'Inter', sans-serif !important; box-shadow: 0 6px 25px rgba(0,0,0,0.5) !important; backdrop-filter: blur(7px) !important; transition: opacity 0.2s ease, transform 0.2s ease; opacity: 0; transform: translateY(10px) scale(0.98); }
        #${POPUP_ID}.visible { display: block !important; opacity: 1; transform: translateY(0) scale(1); }
        #${POPUP_ID} .customizer-header { font-size: 15px; font-weight: 600; text-align: center; margin: 0; padding: 12px 18px 10px 18px; border-bottom: 1px solid rgba(216, 222, 233, 0.1); background-color: rgba(59, 66, 82, 0.6); border-radius: 8px 8px 0 0; color: #eceff4; }
        #${POPUP_ID} .customizer-section { margin-bottom: 18px; padding: 0 18px; }
        #${POPUP_ID} #${VIEW_SETTINGS_ID} .customizer-section:first-of-type { margin-top: 22px !important; }
        #${POPUP_ID} label { display: block; margin-bottom: 6px; font-weight: 500; color: #d8dee9; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; }
        #${POPUP_ID} .slider-container { display: flex; align-items: center; gap: 12px; }
        #${POPUP_ID} input[type="range"] { flex-grow: 1; cursor: pointer; -webkit-appearance: none; appearance: none; height: 6px; background: #434c5e; border-radius: 3px; outline: none; transition: background-color 0.15s ease; margin: 0; padding: 0; }
        #${POPUP_ID} input[type="range"]:hover { background: #4c566a; }
        #${POPUP_ID} input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; background: #88c0d0; border-radius: 50%; cursor: pointer; border: 2px solid #3b4252; transition: background-color 0.15s ease, transform 0.1s ease; }
        #${POPUP_ID} input[type="range"]::-moz-range-thumb { width: 16px; height: 16px; background: #88c0d0; border-radius: 50%; cursor: pointer; border: 2px solid #3b4252; transition: background-color 0.15s ease, transform 0.1s ease; }
        #${POPUP_ID} span[id*="-value"] { min-width: 45px; text-align: right; font-family: monospace; font-size: 14px; font-weight: bold; color: #eceff4; background: rgba(59, 66, 82, 0.4); padding: 2px 5px; border-radius: 4px; user-select: none; }
        #${POPUP_ID} .theme-section { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding-top: 15px; border-top: 1px solid rgba(216, 222, 233, 0.1); margin-top: 18px; }
        #${POPUP_ID} .theme-section span { color: #d8dee9; font-size: 12px; }
        #${POPUP_ID} .theme-section strong { color: #eceff4; font-weight: 600; }
        #${POPUP_ID} .customizer-button { background-color: #5e81ac; color: #eceff4; border: none; border-radius: 5px; padding: 8px 15px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.2); width: 100%; text-align: center; }
        #${POPUP_ID} .customizer-button:hover { background-color: #81a1c1; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        #${POPUP_ID} .customizer-button:active { transform: translateY(1px); }
        #${POPUP_ID} .customizer-button.secondary { background-color: #4c566a; color: #d8dee9; }
        #${POPUP_ID} .customizer-button.secondary:hover { background-color: #5e6a7e; }
        #${POPUP_ID} .customizer-footer { margin-top: 0; padding: 15px 18px; border-top: 1px solid rgba(216, 222, 233, 0.1); }
        #${POPUP_ID} #${THEME_LIST_ID} { max-height: 280px; overflow-y: auto; margin: 10px 0; padding: 0 18px 10px 18px; }
        #${POPUP_ID} .theme-item { padding: 10px 12px; margin-bottom: 8px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(76, 86, 106, 0.5); background-color: rgba(59, 66, 82, 0.4); transition: background-color 0.2s ease, border-color 0.2s ease; }
        #${POPUP_ID} .theme-item:hover { background-color: rgba(76, 86, 106, 0.7); border-color: #5e81ac; }
        #${POPUP_ID} .theme-item-name { font-weight: 600; display: block; margin-bottom: 4px; color: #eceff4; font-size: 14px; }
        #${POPUP_ID} .theme-item-desc { font-size: 12px; color: #d8dee9; opacity: 0.8; line-height: 1.4; }
        #${POPUP_ID} .background-section { padding-top: 15px; border-top: 1px solid rgba(216, 222, 233, 0.1); margin-top: 18px; }
        #${POPUP_ID} #${BACKGROUND_URL_INPUT_ID} { width: 100%; padding: 8px 10px; margin-top: 4px; margin-bottom: 10px; border: 1px solid #4c566a; background-color: rgba(59, 66, 82, 0.6); color: #eceff4; border-radius: 4px; font-size: 13px; box-sizing: border-box; }
        #${POPUP_ID} #${BACKGROUND_URL_INPUT_ID}::placeholder { color: #9098a8; opacity: 0.7; }
        #${POPUP_ID} .background-section .button-group { display: flex; gap: 10px; }
        #${POPUP_ID} .customizer-button.apply-bg { background-color: #8FBCBB; }
        #${POPUP_ID} .customizer-button.apply-bg:hover { background-color: #98C9C8; }
        #${LOGO_ID} { cursor: pointer !important; pointer-events: auto !important; transition: transform 0.2s ease, opacity 0.2s ease !important; opacity: 0.7 !important; }
        #${LOGO_ID}:hover { transform: scale(1.1) !important; opacity: 1 !important; }
        #${POPUP_ID} .select-container { display: flex; align-items: center; margin-top: 4px; }
        #${POPUP_ID} #${BUTTON_ORDER_SELECT_ID} { width: 100%; padding: 8px 10px; border: 1px solid #4c566a; background-color: rgba(59, 66, 82, 0.6); color: #eceff4; border-radius: 4px; font-size: 13px; box-sizing: border-box; cursor: pointer; font-family: 'Inter', sans-serif; }
        #${POPUP_ID} #${BUTTON_ORDER_SELECT_ID} option { background-color: #3B4252; color: #ECEFF4; }
        #${POPUP_ID} #${BUTTON_ORDER_SELECT_ID}:focus { outline: none; border-color: #88c0d0; box-shadow: 0 0 0 2px rgba(136, 192, 208, 0.3); }
        [data-ui-component="ChatInputBarContainer"] { padding-top: 3px !important; padding-bottom: 5px !important; position: absolute !important; bottom: 5px !important; left: 0 !important; right: 0 !important; max-width: 70% !important; margin-top: 0 !important; }
        ${SHARED_CHAT_CONTAINER_SELECTOR} { padding-bottom: 60px !important; }
    `;

    function styleAvatarImageTag(imgTag) {  imgTag.style.width = '100%'; imgTag.style.height = '100%'; imgTag.style.objectFit = 'cover'; imgTag.style.display = 'block'; imgTag.style.borderRadius = '0'; }
    function processSingleAvatar(avatarButton, size) {  if (!avatarButton) return; const sizePx = `${size}px`; avatarButton.style.width = sizePx; avatarButton.style.height = sizePx; avatarButton.style.borderRadius = '50%'; avatarButton.style.overflow = 'hidden'; avatarButton.style.display = 'inline-flex'; avatarButton.style.justifyContent = 'center'; avatarButton.style.alignItems = 'center'; avatarButton.style.border = 'none'; avatarButton.style.boxShadow = `0 0 0 1px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.05)`; const img = avatarButton.querySelector('img'); if (img) { const classParamPattern = /\?class=avatar\d+x\d+/; let currentImgSrc = img.src; let newSrcCandidate = currentImgSrc; let needsSrcUpdate = false; if (currentImgSrc && currentImgSrc.match(classParamPattern)) { newSrcCandidate = currentImgSrc.replace(classParamPattern, ''); needsSrcUpdate = true; } if (needsSrcUpdate) { if (img.dataset.triedCleanSrc === newSrcCandidate && img.dataset.cleanSrcFailed === 'true') { styleAvatarImageTag(img); } else { const originalSrcForOnError = currentImgSrc; img.src = newSrcCandidate; img.dataset.triedCleanSrc = newSrcCandidate; img.dataset.cleanSrcFailed = 'false'; img.onerror = function() { if (img.src !== originalSrcForOnError) { img.src = originalSrcForOnError; } img.dataset.cleanSrcFailed = 'true'; img.onerror = null; img.onload = null; styleAvatarImageTag(img); }; img.onload = function() { img.dataset.cleanSrcFailed = 'false'; img.onload = null; img.onerror = null; styleAvatarImageTag(img); }; } } else { styleAvatarImageTag(img); } delete img.dataset.originalSrcAttempted; } avatarButton.dataset.processedBySize = String(size); }
    function applyCurrentAvatarSizeToAll(specificElements = null) {  const elementsToProcess = specificElements || document.querySelectorAll(ALL_AVATAR_BUTTON_SELECTORS); const isCalledByObserver = !!specificElements; elementsToProcess.forEach(avatarButton => { if (!document.body.contains(avatarButton)) { return; } if (isCalledByObserver || avatarButton.dataset.processedBySize !== String(currentAvatarSize)) { processSingleAvatar(avatarButton, currentAvatarSize); } }); if (avatarSizeValue) avatarSizeValue.textContent = `${currentAvatarSize}px`; }
    function applyDynamicStyles() {  if (!dynamicStyleElement) { dynamicStyleElement = document.createElement('style'); dynamicStyleElement.id = DYNAMIC_STYLE_ID; document.head.appendChild(dynamicStyleElement); } const fontSize = `${currentFontSize}px`; const lineHeight = `${Math.round(currentFontSize * 1.6)}px`; dynamicStyleElement.textContent = `:root { --dynamic-font-size: ${fontSize}; --dynamic-line-height: ${lineHeight}; } [data-ui-component="MessageTextSpan"], [data-ui-component="MessageTextSpan"] > em, [data-ui-component="MessageTextSpan"] > q { font-size: var(--dynamic-font-size) !important; } [data-ui-component="MessageContentContainer"] { line-height: var(--dynamic-line-height) !important; } [data-ui-component="MessageInputTextarea"] { font-size: var(--dynamic-font-size) !important; line-height: 1.5 !important; }`; if (fontValue) fontValue.textContent = `${currentFontSize}px`; }
    function applyWidthStyle(widthPercent) {  if (!widthStyleElement) { widthStyleElement = document.createElement('style'); widthStyleElement.id = WIDTH_STYLE_ID; document.head.appendChild(widthStyleElement); } const customCSS = ` ${messageContainerSelector_SLIDER} { width: ${widthPercent}% !important; max-width: none !important; margin-left: auto !important; margin-right: auto !important; } `; widthStyleElement.textContent = customCSS; if (widthValue) widthValue.textContent = `${widthPercent}%`; }
    function applyOpacityStyle(opacity) {  const opacityValueFormatted = parseFloat(opacity).toFixed(2); document.documentElement.style.setProperty('--message-bg-opacity', opacityValueFormatted); if (opacityValue) opacityValue.textContent = opacityValueFormatted; }
    function applyCustomBackground() {  if (!backgroundStyleElement) { backgroundStyleElement = document.createElement('style'); backgroundStyleElement.id = BACKGROUND_STYLE_ID; document.head.appendChild(backgroundStyleElement); } if (customBackgroundUrl && customBackgroundUrl.trim() !== '') { try { const safeUrl = CSS.escape(customBackgroundUrl.trim()); backgroundStyleElement.textContent = `${BACKGROUND_TARGET_SELECTOR} { background-image: url("${safeUrl}") !important; background-size: cover !important; background-position: center center !important; background-repeat: no-repeat !important; background-attachment: fixed !important; }`; } catch (e) { console.error("Error applying custom background:", e); backgroundStyleElement.textContent = ''; } } else { backgroundStyleElement.textContent = ''; } }
    function applyTheme(themeKey) {  currentThemeKey = themes[themeKey] ? themeKey : DEFAULT_THEME_KEY; const theme = themes[currentThemeKey]; if (!themeStyleElement) { themeStyleElement = document.createElement('style'); themeStyleElement.id = THEME_STYLE_ID; document.head.appendChild(themeStyleElement); } document.documentElement.className = document.documentElement.className.replace(/ theme-\S+/g, ''); document.documentElement.classList.add(`theme-${currentThemeKey}`); if(theme && theme.css) { themeStyleElement.textContent = theme.css; } else { console.error(`Theme or theme CSS not found for key: ${currentThemeKey}`); themeStyleElement.textContent = '';  } if (themeDisplay && theme) themeDisplay.textContent = theme.name; if (popupElement) popupElement.dataset.activeTheme = currentThemeKey; document.documentElement.classList.add('dark'); document.documentElement.style.colorScheme = 'dark'; applyCustomBackground(); applyCurrentAvatarSizeToAll(); }
    async function saveFontSettings() { try { await GM_setValue(STORAGE_FONT_SIZE_KEY, currentFontSize); } catch (e) { console.error("Error saving font size:", e); } }
    async function saveWidthSettings() { try { await GM_setValue(STORAGE_WIDTH_KEY, currentWidth); } catch (e) { console.error("Error saving width:", e); } }
    async function saveThemePref() { try { await GM_setValue(STORAGE_THEME_KEY, currentThemeKey); } catch (e) { console.error("Error saving theme:", e); } }
    async function saveBackgroundUrl() { try { await GM_setValue(STORAGE_BACKGROUND_URL_KEY, customBackgroundUrl); } catch (e) { console.error("Error saving background URL:", e); } }
    async function saveOpacitySettings() { try { await GM_setValue(STORAGE_OPACITY_KEY, currentOpacity); } catch (e) { console.error("Error saving opacity:", e); } }
    async function saveAvatarSizeSettings() { try { await GM_setValue(STORAGE_AVATAR_SIZE_KEY, currentAvatarSize); } catch (e) { console.error("Error saving avatar size:", e); } }
    async function saveButtonOrder() { try { await GM_setValue(STORAGE_BUTTON_ORDER_KEY, currentButtonOrder); } catch (e) { console.error("Error saving button order:", e); } }
    async function loadSettings() { try { currentThemeKey = await GM_getValue(STORAGE_THEME_KEY, DEFAULT_THEME_KEY); currentFontSize = await GM_getValue(STORAGE_FONT_SIZE_KEY, DEFAULT_FONT_SIZE); currentWidth = await GM_getValue(STORAGE_WIDTH_KEY, DEFAULT_WIDTH_SLIDER); customBackgroundUrl = await GM_getValue(STORAGE_BACKGROUND_URL_KEY, DEFAULT_BACKGROUND_URL); currentOpacity = await GM_getValue(STORAGE_OPACITY_KEY, DEFAULT_OPACITY); currentAvatarSize = await GM_getValue(STORAGE_AVATAR_SIZE_KEY, DEFAULT_AVATAR_SIZE); currentButtonOrder = await GM_getValue(STORAGE_BUTTON_ORDER_KEY, DEFAULT_BUTTON_ORDER); currentFontSize = Math.max(8, Math.min(32, parseInt(currentFontSize, 10) || DEFAULT_FONT_SIZE)); currentWidth = Math.max(MIN_WIDTH_SLIDER, Math.min(MAX_WIDTH_SLIDER, parseInt(currentWidth, 10) || DEFAULT_WIDTH_SLIDER)); currentOpacity = Math.max(0, Math.min(1, parseFloat(currentOpacity) || DEFAULT_OPACITY)); currentAvatarSize = Math.max(MIN_AVATAR_SIZE, Math.min(MAX_AVATAR_SIZE, parseInt(currentAvatarSize, 10) || DEFAULT_AVATAR_SIZE)); if (!themes[currentThemeKey]) { currentThemeKey = DEFAULT_THEME_KEY; await saveThemePref(); } } catch (e) { console.error("Error loading settings, reverting to defaults:", e); currentThemeKey = DEFAULT_THEME_KEY; currentFontSize = DEFAULT_FONT_SIZE; currentWidth = DEFAULT_WIDTH_SLIDER; customBackgroundUrl = DEFAULT_BACKGROUND_URL; currentOpacity = DEFAULT_OPACITY; currentAvatarSize = DEFAULT_AVATAR_SIZE; currentButtonOrder = DEFAULT_BUTTON_ORDER; } }
    function resetFontAndWidthSettings() {  currentFontSize = DEFAULT_FONT_SIZE; currentWidth = DEFAULT_WIDTH_SLIDER; if (fontSlider) fontSlider.value = currentFontSize; if (widthSlider) widthSlider.value = currentWidth; applyDynamicStyles(); applyWidthStyle(currentWidth); saveFontSettings(); saveWidthSettings(); }
    function resetBackground() {  customBackgroundUrl = null; if (backgroundUrlInput) backgroundUrlInput.value = ''; saveBackgroundUrl(); applyCustomBackground(); }
    function populateThemeList() {  if (!themeListContainer) return; themeListContainer.innerHTML = ''; for (const key in themes) { const theme = themes[key]; const item = document.createElement('div'); item.className = 'theme-item'; item.dataset.themeKey = key; item.innerHTML = `<span class="theme-item-name">${theme.name}</span> <span class="theme-item-desc">${theme.description}</span>`; item.addEventListener('click', () => { applyTheme(key); saveThemePref(); switchView('settings'); }); themeListContainer.appendChild(item); } }
    function switchView(viewName) {  if (!settingsView || !themesView || !popupElement) return; settingsView.style.display = (viewName === 'settings') ? 'block' : 'none'; themesView.style.display = (viewName === 'themes') ? 'block' : 'none'; }
    function positionPopup() {  if (!popupElement) return; popupElement.style.top = '15px'; popupElement.style.right = '15px'; popupElement.style.bottom = 'auto'; popupElement.style.left = 'auto'; }
    function togglePopup() {  if (!popupElement) { return; } const isVisible = popupElement.classList.contains('visible'); if (!isVisible) { positionPopup(); void popupElement.offsetWidth; popupElement.classList.add('visible'); } else { popupElement.classList.remove('visible'); } }


    function reorderButtonsInContainer(actionsContainer) {
        if (!actionsContainer || !document.body.contains(actionsContainer)) {
            return;
        }
        const buttonParent = actionsContainer.querySelector('div.flex.justify-between.items-center > div.flex.items-center.gap-2');
        if (!buttonParent) {
            return;
        }

        const computedStyle = window.getComputedStyle(buttonParent);
        const isActive = parseFloat(computedStyle.opacity) > 0.5 && computedStyle.display !== 'none';

        if (!isActive) {
            return;
        } else {
        }


        if (buttonParent.dataset.scButtonOrderApplied === currentButtonOrder) {
            return;
        }

        const buttons = {
            star: buttonParent.querySelector(BUTTON_SELECTOR_STAR),
            tts: buttonParent.querySelector(BUTTON_SELECTOR_TTS),
            regenerate: buttonParent.querySelector(BUTTON_SELECTOR_REGENERATE),
            edit: buttonParent.querySelector(BUTTON_SELECTOR_EDIT)
        };

        Object.values(buttons).forEach(btn => {
            if (btn && btn.parentElement === buttonParent) {
                buttonParent.removeChild(btn);
            }
        });

        let orderToAppend = [];
        if (currentButtonOrder === 'new') {
            orderToAppend = [buttons.star, buttons.tts, buttons.regenerate, buttons.edit];
        } else {
            orderToAppend = [buttons.regenerate, buttons.edit, buttons.star, buttons.tts];
        }

        orderToAppend.forEach(button => {
            if (button) {
                buttonParent.appendChild(button);
            }
        });
        buttonParent.dataset.scButtonOrderApplied = currentButtonOrder;
    }

    function applyButtonOrderToAllMessageActions(checkVisibility = false) {
        document.querySelectorAll(MESSAGE_ACTIONS_CONTAINER_SELECTOR).forEach(container => {
            if (checkVisibility) {
                const buttonParent = container.querySelector('div.flex.justify-between.items-center > div.flex.items-center.gap-2');
                if (buttonParent) {
                    const computedStyle = window.getComputedStyle(buttonParent);
                    const isActive = parseFloat(computedStyle.opacity) > 0.5 && computedStyle.display !== 'none';
                    if (!isActive) {
                        return;
                    }
                }
            }
            reorderButtonsInContainer(container);
        });
    }


    function observeContent() {
        const targetNode = document.querySelector(CHAT_MESSAGES_CONTAINER_SELECTOR);
        if (!targetNode) {
            setTimeout(observeContent, 1500);
            return;
        }
        const config = { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] };

        const callback = function(mutationsList, observer) {
            const addedAvatarButtons = new Set();
            const affectedMessageActionContainers = new Set();

            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches && node.matches(ALL_AVATAR_BUTTON_SELECTORS)) {
                                addedAvatarButtons.add(node);
                            }
                            node.querySelectorAll(ALL_AVATAR_BUTTON_SELECTORS).forEach(avatar => addedAvatarButtons.add(avatar));

                            if (node.matches && node.matches(MESSAGE_ACTIONS_CONTAINER_SELECTOR)) {
                                if (node.querySelector('div.flex.justify-between.items-center > div.flex.items-center.gap-2')) {
                                    affectedMessageActionContainers.add(node);
                                }
                            }
                            node.querySelectorAll(MESSAGE_ACTIONS_CONTAINER_SELECTOR).forEach(container => {
                                if (container.querySelector('div.flex.justify-between.items-center > div.flex.items-center.gap-2')) {
                                    affectedMessageActionContainers.add(container);
                                }
                            });
                        }
                    }
                } else if (mutation.type === 'attributes') {
                    const targetElement = mutation.target;
                    const mainActionsContainer = targetElement.closest(MESSAGE_ACTIONS_CONTAINER_SELECTOR);
                    if (mainActionsContainer) {
                        const buttonParent = mainActionsContainer.querySelector('div.flex.justify-between.items-center > div.flex.items-center.gap-2');
                        if (buttonParent && (targetElement === buttonParent || targetElement === mainActionsContainer || buttonParent.contains(targetElement))) {
                           if (document.body.contains(mainActionsContainer)) {
                                affectedMessageActionContainers.add(mainActionsContainer);
                           }
                        }
                    }
                }

                if (mutation.target && mutation.target.nodeType === Node.ELEMENT_NODE) {
                    const parentContainer = mutation.target.closest(MESSAGE_ACTIONS_CONTAINER_SELECTOR);
                    if (parentContainer) {
                       if (document.body.contains(parentContainer) &&
                           parentContainer.querySelector('div.flex.justify-between.items-center > div.flex.items-center.gap-2')) {
                           affectedMessageActionContainers.add(parentContainer);
                       }
                    }
               }
            }

            if (addedAvatarButtons.size > 0) {
                applyCurrentAvatarSizeToAll(Array.from(addedAvatarButtons));
            }
            if (affectedMessageActionContainers.size > 0) {
                affectedMessageActionContainers.forEach(container => reorderButtonsInContainer(container));
            }
        };
        if (contentObserver) {
            contentObserver.disconnect();
        }
        contentObserver = new MutationObserver(callback);
        contentObserver.observe(targetNode, config);
        contentObserver.observe(document.body, { childList: true, subtree: true });
    }

    async function initialize() {
        if (isInitialized) return;
        logoElement = document.getElementById(LOGO_ID);
        if (!logoElement) {
            setTimeout(initialize, 1500);
            return;
        }
        isInitialized = true;

        try {
            await loadSettings();
            if (!document.getElementById(POPUP_ID)) { popupElement = document.createElement('div'); popupElement.id = POPUP_ID; document.body.appendChild(popupElement); }
            else { popupElement = document.getElementById(POPUP_ID); }
            popupElement.innerHTML = popupHTML;

            settingsView = document.getElementById(VIEW_SETTINGS_ID);
            themesView = document.getElementById(VIEW_THEMES_ID);
            fontSlider = document.getElementById(FONT_SLIDER_ID);
            fontValue = document.getElementById(FONT_VALUE_ID);
            widthSlider = document.getElementById(WIDTH_SLIDER_ID);
            widthValue = document.getElementById(WIDTH_VALUE_ID);
            opacitySlider = document.getElementById(OPACITY_SLIDER_ID);
            opacityValue = document.getElementById(OPACITY_VALUE_ID);
            avatarSizeSlider = document.getElementById(AVATAR_SIZE_SLIDER_ID);
            avatarSizeValue = document.getElementById(AVATAR_SIZE_VALUE_ID);
            buttonOrderSelectElement = document.getElementById(BUTTON_ORDER_SELECT_ID);
            themeDisplay = document.getElementById(THEME_DISPLAY_ID);
            changeThemeBtn = document.getElementById(CHANGE_THEME_BTN_ID);
            resetBtn = document.getElementById(RESET_BTN_ID);
            themeListContainer = document.getElementById(THEME_LIST_ID);
            backBtn = document.getElementById(BACK_BTN_ID);
            backgroundUrlInput = document.getElementById(BACKGROUND_URL_INPUT_ID);
            applyBgBtn = document.getElementById(APPLY_BG_BTN_ID);
            resetBgBtn = document.getElementById(RESET_BG_BTN_ID);

            if (!settingsView || !themesView || !fontSlider || !fontValue || !widthSlider || !widthValue ||
                !opacitySlider || !opacityValue || !avatarSizeSlider || !avatarSizeValue ||
                !buttonOrderSelectElement ||
                !themeDisplay || !changeThemeBtn || !resetBtn || !themeListContainer || !backBtn ||
                !backgroundUrlInput || !applyBgBtn || !resetBgBtn) {
                console.error("UI Customizer: One or more GUI elements are missing! Check IDs.");
                throw new Error("GUI elements missing after creation!");
            }

            GM_addStyle(guiStyles);
            populateThemeList();

            fontSlider.value = currentFontSize;
            widthSlider.value = currentWidth;
            opacitySlider.value = currentOpacity;
            avatarSizeSlider.value = currentAvatarSize;
            buttonOrderSelectElement.value = currentButtonOrder;
            backgroundUrlInput.value = customBackgroundUrl || '';

            applyTheme(currentThemeKey);
            applyDynamicStyles();
            applyWidthStyle(currentWidth);
            applyOpacityStyle(currentOpacity);
            applyButtonOrderToAllMessageActions();

            if (!logoElement.dataset.customizerListener) { logoElement.addEventListener('click', (e) => { e.stopPropagation(); togglePopup(); }); logoElement.dataset.customizerListener = 'true'; }
            if (!fontSlider.dataset.listenerAdded) { fontSlider.addEventListener('input', () => { currentFontSize = fontSlider.value; applyDynamicStyles(); }); fontSlider.addEventListener('change', saveFontSettings); fontSlider.dataset.listenerAdded = 'true'; }
            if (!widthSlider.dataset.listenerAdded) { widthSlider.addEventListener('input', () => { currentWidth = widthSlider.value; applyWidthStyle(currentWidth); }); widthSlider.addEventListener('change', saveWidthSettings); widthSlider.dataset.listenerAdded = 'true'; }
            if (!opacitySlider.dataset.listenerAdded) { opacitySlider.addEventListener('input', () => { currentOpacity = opacitySlider.value; applyOpacityStyle(currentOpacity); }); opacitySlider.addEventListener('change', saveOpacitySettings); opacitySlider.dataset.listenerAdded = 'true'; }
            if (!avatarSizeSlider.dataset.listenerAdded) { avatarSizeSlider.addEventListener('input', () => { currentAvatarSize = avatarSizeSlider.value; applyCurrentAvatarSizeToAll(); }); avatarSizeSlider.addEventListener('change', saveAvatarSizeSettings); avatarSizeSlider.dataset.listenerAdded = 'true'; }
            if (!buttonOrderSelectElement.dataset.listenerAdded) {
                buttonOrderSelectElement.addEventListener('change', () => {
                    currentButtonOrder = buttonOrderSelectElement.value;
                    saveButtonOrder();
                    document.querySelectorAll(MESSAGE_ACTIONS_CONTAINER_SELECTOR).forEach(container => {
                        const buttonParent = container.querySelector('div.flex.justify-between.items-center > div.flex.items-center.gap-2');
                        if (buttonParent) {
                            delete buttonParent.dataset.scButtonOrderApplied;
                        }
                    });
                    applyButtonOrderToAllMessageActions(true);
                });
                buttonOrderSelectElement.dataset.listenerAdded = 'true';
            }
            if (!resetBtn.dataset.listenerAdded) { resetBtn.addEventListener('click', resetFontAndWidthSettings); resetBtn.dataset.listenerAdded = 'true'; }
            if (!changeThemeBtn.dataset.listenerAdded) { changeThemeBtn.addEventListener('click', () => switchView('themes')); changeThemeBtn.dataset.listenerAdded = 'true'; }
            if (!backBtn.dataset.listenerAdded) { backBtn.addEventListener('click', () => switchView('settings')); backBtn.dataset.listenerAdded = 'true'; }
            if (!applyBgBtn.dataset.listenerAdded) { applyBgBtn.addEventListener('click', () => { const url = backgroundUrlInput.value.trim(); customBackgroundUrl = url; saveBackgroundUrl(); applyCustomBackground(); }); applyBgBtn.dataset.listenerAdded = 'true'; }
            if (!resetBgBtn.dataset.listenerAdded) { resetBgBtn.addEventListener('click', resetBackground); resetBgBtn.dataset.listenerAdded = 'true'; }
            if (!document.body.dataset.customizerPopupListener) { document.addEventListener('click', (event) => { if (popupElement && popupElement.classList.contains('visible')) { if (!popupElement.contains(event.target) && (!logoElement || !logoElement.contains(event.target))) { togglePopup(); } } }, true); document.body.dataset.customizerPopupListener = 'true'; }

            observeContent();

        } catch (error) {
            console.error("Fatal error during UI Customizer initialization:", error);
            isInitialized = false;
        }
    }

    const INITIALIZATION_DELAY = 4500;
    setTimeout(initialize, INITIALIZATION_DELAY);

})();
