// ==UserScript==
// @name         SpicyChat Accessibility Enhancer [Beta]
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Improves SpicyChat accessibility with themes for color blindness, low vision, and photosensitivity. Requires 'SpicyChat Logic Core'.
// @author       Discord: @encode_your, SpicyChat: @sophieaaa
// @match        https://spicychat.ai/chat/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_info
// @updateURL    
// @downloadURL  
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    console.log(`SpicyChat Accessibility Enhancer v${GM_info.script.version}: Initializing (using UI Customizer base)...`);

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

    const DEFAULT_FONT_SIZE = 16;
    const DEFAULT_THEME_KEY = 'daltoSafe_universal';

    const themes = {
        'deutero_friendly': {
            name: 'Deutero-Friendly',
            description: 'Optimized for Deuteranopia (green-weak/blind). Uses blue/yellow accents, avoids red/green confusion.',
            css: `
                :root {
                    --acc-df-bg: #1e1e1e; --acc-df-text: #eaeaea; --acc-df-bg-alt: #282828;
                    --acc-df-accent: #007acc; --acc-df-accent-hover: #3399e6;
                    --acc-df-link: #ffcc00; --acc-df-link-hover: #ffe066;
                    --acc-df-error: #ff6600; --acc-df-success: #3399ff;
                    --acc-df-border: #4d4d4d; --acc-df-border-focus: var(--acc-df-accent);
                    --acc-df-quote-text: #a5dfff; --acc-df-action-text: #f5d76e;
                    --acc-df-sender: #a8a8a8;
                }
                html { color-scheme: dark !important; } html.dark { --dark-mode: 1;}
                html.dark body { background: var(--acc-df-bg) !important; color: var(--acc-df-text) !important; font-family: 'Segoe UI', 'Verdana', sans-serif !important; }
                html.dark body::before { display: none !important; }
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { scrollbar-color: var(--acc-df-border) transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--acc-df-border) !important; border: 2px solid var(--acc-df-bg) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--acc-df-accent) !important; }
                [data-ui-component="ChatHeaderBar"], [data-ui-component="SideNavBar"] { background: var(--acc-df-bg-alt) !important; border-color: var(--acc-df-border) !important; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--acc-df-accent) !important; color: #fff !important; border-left-color: var(--acc-df-link) !important; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: #fff !important; }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: var(--acc-df-text) !important; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--acc-df-sender) !important; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--acc-df-link-hover) !important; }
                [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: var(--acc-df-bg) !important; border: 1px solid var(--acc-df-border) !important; border-left: 3px solid var(--acc-df-accent) !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--acc-df-bg-alt) !important; border: 1px solid var(--acc-df-border) !important; border-left: 3px solid var(--acc-df-link) !important; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--acc-df-border-focus) !important; }
                [data-ui-component="MessageSenderName"] { color: var(--acc-df-sender) !important; font-weight: bold; }
                [data-ui-component="MessageTextSpan"] { color: var(--acc-df-text) !important; font-size: var(--dynamic-font-size) !important; line-height: var(--dynamic-line-height) !important; }
                [data-ui-component="MessageTextSpan"] > q { color: var(--acc-df-quote-text) !important; font-style: italic !important; background: none !important; border: none; padding: 0; display: inline; }
                [data-ui-component="MessageTextSpan"] > em { color: var(--acc-df-action-text) !important; font-style: normal !important; font-weight: bold !important; }
                [data-ui-component="MessageAvatarImage"] { border: 2px solid var(--acc-df-border); }
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--acc-df-sender) !important; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--acc-df-link-hover) !important; }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: var(--acc-df-link) !important; stroke: var(--acc-df-link) !important; }
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--acc-df-bg-alt) !important; border: 1px solid var(--acc-df-border) !important; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--acc-df-border-focus) !important; box-shadow: 0 0 0 2px var(--acc-df-accent); }
                [data-ui-component="MessageInputTextarea"] { color: var(--acc-df-text) !important; caret-color: var(--acc-df-link); font-size: var(--dynamic-font-size) !important; line-height: 1.5 !important; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--acc-df-accent) !important; }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--acc-df-accent-hover) !important; }
                [data-ui-component="SendButtonIcon"] { stroke: #fff !important; }
                *:focus-visible { outline: 2px solid var(--acc-df-link) !important; outline-offset: 1px !important; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { outline: none !important; }
            `
        },
        'protano_friendly': {
            name: 'Protano-Friendly',
            description: 'Optimized for Protanopia (red-weak/blind). Similar to Deutero, uses blue/yellow, avoids red confusion.',
            css: `
                :root {
                    --acc-pf-bg: #1a1a1a; --acc-pf-text: #f2f2f2; --acc-pf-bg-alt: #262626;
                    --acc-pf-accent: #0073e6; --acc-pf-accent-hover: #338fff;
                    --acc-pf-link: #ffcc00; --acc-pf-link-hover: #ffe066;
                    --acc-pf-error: #ff9900; --acc-pf-success: #33ccff;
                    --acc-pf-border: #4a4a4a; --acc-pf-border-focus: var(--acc-pf-accent);
                    --acc-pf-quote-text: #a0cfff; --acc-pf-action-text: #e7c46c;
                    --acc-pf-sender: #c0c0c0;
                }
                html { color-scheme: dark !important; } html.dark { --dark-mode: 1; }
                html.dark body { background: var(--acc-pf-bg) !important; color: var(--acc-pf-text) !important; font-family: 'Segoe UI', 'Verdana', sans-serif !important; }
                html.dark body::before { display: none !important; }
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { scrollbar-color: var(--acc-pf-border) transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--acc-pf-border) !important; border: 2px solid var(--acc-pf-bg) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--acc-pf-accent) !important; }
                [data-ui-component="ChatHeaderBar"], [data-ui-component="SideNavBar"] { background: var(--acc-pf-bg-alt) !important; border-color: var(--acc-pf-border) !important; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--acc-pf-accent) !important; color: #fff !important; border-left-color: var(--acc-pf-link) !important; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: #fff !important; }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: var(--acc-pf-text) !important; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--acc-pf-sender) !important; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--acc-pf-link-hover) !important; }
                [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: var(--acc-pf-bg) !important; border: 1px solid var(--acc-pf-border) !important; border-left: 3px solid var(--acc-pf-accent) !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--acc-pf-bg-alt) !important; border: 1px solid var(--acc-pf-border) !important; border-left: 3px solid var(--acc-pf-link) !important; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--acc-pf-border-focus) !important; }
                [data-ui-component="MessageSenderName"] { color: var(--acc-pf-sender) !important; font-weight: bold; }
                [data-ui-component="MessageTextSpan"] { color: var(--acc-pf-text) !important; font-size: var(--dynamic-font-size) !important; line-height: var(--dynamic-line-height) !important; }
                [data-ui-component="MessageTextSpan"] > q { color: var(--acc-pf-quote-text) !important; font-style: italic !important; background: none !important; border: none; padding: 0; display: inline; }
                [data-ui-component="MessageTextSpan"] > em { color: var(--acc-pf-action-text) !important; font-style: normal !important; font-weight: bold !important; }
                [data-ui-component="MessageAvatarImage"] { border: 2px solid var(--acc-pf-border); }
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--acc-pf-sender) !important; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--acc-pf-link-hover) !important; }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: var(--acc-pf-link) !important; stroke: var(--acc-pf-link) !important; }
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--acc-pf-bg-alt) !important; border: 1px solid var(--acc-pf-border) !important; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--acc-pf-border-focus) !important; box-shadow: 0 0 0 2px var(--acc-pf-accent); }
                [data-ui-component="MessageInputTextarea"] { color: var(--acc-pf-text) !important; caret-color: var(--acc-pf-link); font-size: var(--dynamic-font-size) !important; line-height: 1.5 !important; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--acc-pf-accent) !important; }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--acc-pf-accent-hover) !important; }
                [data-ui-component="SendButtonIcon"] { stroke: #fff !important; }
                *:focus-visible { outline: 2px solid var(--acc-pf-link) !important; outline-offset: 1px !important; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { outline: none !important; }
            `
        },
        'tritano_friendly': {
            name: 'Tritano-Friendly',
            description: 'Optimized for Tritanopia (blue/yellow-weak/blind). Uses red/green/orange accents.',
            css: `
                :root {
                    --acc-tf-bg: #121212; --acc-tf-text: #f5f5f5; --acc-tf-bg-alt: #1e1e1e;
                    --acc-tf-accent: #cc3300; --acc-tf-accent-hover: #e64d1a;
                    --acc-tf-link: #66cc00; --acc-tf-link-hover: #80ff00;
                    --acc-tf-error: #ff9900; --acc-tf-success: #99cc00;
                    --acc-tf-border: #404040; --acc-tf-border-focus: var(--acc-tf-accent);
                    --acc-tf-quote-text: #e3d7b5; --acc-tf-action-text: #d7aaff;
                    --acc-tf-sender: #bfbfbf;
                }
                html { color-scheme: dark !important; } html.dark { --dark-mode: 1; }
                html.dark body { background: var(--acc-tf-bg) !important; color: var(--acc-tf-text) !important; font-family: 'Segoe UI', 'Verdana', sans-serif !important; }
                html.dark body::before { display: none !important; }
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { scrollbar-color: var(--acc-tf-border) transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--acc-tf-border) !important; border: 2px solid var(--acc-tf-bg) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--acc-tf-accent) !important; }
                [data-ui-component="ChatHeaderBar"], [data-ui-component="SideNavBar"] { background: var(--acc-tf-bg-alt) !important; border-color: var(--acc-tf-border) !important; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--acc-tf-accent) !important; color: #fff !important; border-left-color: var(--acc-tf-link) !important; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: #fff !important; }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: var(--acc-tf-text) !important; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--acc-tf-sender) !important; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--acc-tf-link-hover) !important; }
                [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: var(--acc-tf-bg) !important; border: 1px solid var(--acc-tf-border) !important; border-left: 3px solid var(--acc-tf-accent) !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--acc-tf-bg-alt) !important; border: 1px solid var(--acc-tf-border) !important; border-left: 3px solid var(--acc-tf-link) !important; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--acc-tf-border-focus) !important; }
                [data-ui-component="MessageSenderName"] { color: var(--acc-tf-sender) !important; font-weight: bold; }
                [data-ui-component="MessageTextSpan"] { color: var(--acc-tf-text) !important; font-size: var(--dynamic-font-size) !important; line-height: var(--dynamic-line-height) !important; }
                [data-ui-component="MessageTextSpan"] > q { color: var(--acc-tf-quote-text) !important; font-style: italic !important; background: none !important; border: none; padding: 0; display: inline; font-weight: 500; }
                [data-ui-component="MessageTextSpan"] > em { color: var(--acc-tf-action-text) !important; font-style: normal !important; font-weight: bold !important; }
                [data-ui-component="MessageAvatarImage"] { border: 2px solid var(--acc-tf-border); }
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--acc-tf-sender) !important; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--acc-tf-link-hover) !important; }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: var(--acc-tf-link) !important; stroke: var(--acc-tf-link) !important; }
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--acc-tf-bg-alt) !important; border: 1px solid var(--acc-tf-border) !important; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--acc-tf-border-focus) !important; box-shadow: 0 0 0 2px var(--acc-tf-accent); }
                [data-ui-component="MessageInputTextarea"] { color: var(--acc-tf-text) !important; caret-color: var(--acc-tf-link); font-size: var(--dynamic-font-size) !important; line-height: 1.5 !important; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--acc-tf-accent) !important; }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--acc-tf-accent-hover) !important; }
                [data-ui-component="SendButtonIcon"] { stroke: #fff !important; }
                *:focus-visible { outline: 2px solid var(--acc-tf-link) !important; outline-offset: 1px !important; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { outline: none !important; }
            `
        },
        'daltoSafe_universal': {
            name: 'DaltoSafe Universal',
            description: 'Maximum compatibility for all types of color blindness using orange, teal, purple.',
            css: `
                :root {
                    --acc-du-bg: #1a1a1a; --acc-du-text: #f2f2f2; --acc-du-bg-alt: #262626;
                    --acc-du-accent1: #ffaa00; --acc-du-accent1-hover: #ffc34d;
                    --acc-du-accent2: #66cccc; --acc-du-accent2-hover: #85e0e0;
                    --acc-du-success: #9966ff; --acc-du-error: #ff9900;
                    --acc-du-border: #4d4d4d; --acc-du-border-focus: var(--acc-du-accent1);
                    --acc-du-quote-text: #cfcfcf; --acc-du-action-text: #e6b3ff;
                    --acc-du-sender: #b0b0b0;
                }
                html { color-scheme: dark !important; } html.dark { --dark-mode: 1; }
                html.dark body { background: var(--acc-du-bg) !important; color: var(--acc-du-text) !important; font-family: 'Segoe UI', 'Verdana', sans-serif !important; }
                html.dark body::before { display: none !important; }
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { scrollbar-color: var(--acc-du-border) transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--acc-du-border) !important; border: 2px solid var(--acc-du-bg) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--acc-du-accent1) !important; }
                [data-ui-component="ChatHeaderBar"], [data-ui-component="SideNavBar"] { background: var(--acc-du-bg-alt) !important; border-color: var(--acc-du-border) !important; }
                [data-ui-component^="SideNav"] button { text-decoration: none !important; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--acc-du-accent1) !important; color: #000 !important; border-left-color: var(--acc-du-accent2) !important; text-decoration: none !important; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: #000 !important; }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: var(--acc-du-text) !important; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--acc-du-sender) !important; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--acc-du-accent1-hover) !important; }
                [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: var(--acc-du-bg) !important; border: 1px solid var(--acc-du-border) !important; border-left: 3px solid var(--acc-du-accent1) !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--acc-du-bg-alt) !important; border: 1px solid var(--acc-du-border) !important; border-left: 3px solid var(--acc-du-accent2) !important; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--acc-du-border-focus) !important; }
                [data-ui-component="MessageSenderName"] { color: var(--acc-du-sender) !important; font-weight: bold; }
                [data-ui-component="MessageTextSpan"] { color: var(--acc-du-text) !important; font-size: var(--dynamic-font-size) !important; line-height: var(--dynamic-line-height) !important; }
                [data-ui-component="MessageTextSpan"] > q { color: var(--acc-du-quote-text) !important; font-style: italic !important; background: none !important; border: none; padding: 0; display: inline; }
                [data-ui-component="MessageTextSpan"] > em { color: var(--acc-du-action-text) !important; font-style: normal !important; font-weight: bold !important; background-color: rgba(230,179,255,0.1); padding: 0.1em 0.2em; border-radius: 3px; }
                [data-ui-component="MessageAvatarImage"] { border: 2px solid var(--acc-du-border); }
                [data-ui-component="MessageActionsContainer"] button { text-decoration: none !important; }
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--acc-du-sender) !important; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--acc-du-accent1-hover) !important; }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: var(--acc-du-accent1) !important; stroke: var(--acc-du-accent1) !important; }
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--acc-du-bg-alt) !important; border: 1px solid var(--acc-du-border) !important; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--acc-du-border-focus) !important; box-shadow: 0 0 0 2px var(--acc-du-accent1); }
                [data-ui-component="MessageInputTextarea"] { color: var(--acc-du-text) !important; caret-color: var(--acc-du-accent1); font-size: var(--dynamic-font-size) !important; line-height: 1.5 !important; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--acc-du-accent1) !important; }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--acc-du-accent1-hover) !important; }
                [data-ui-component="SendButtonIcon"] { stroke: #000 !important; }
                *:focus-visible { outline: 2px solid var(--acc-du-accent2) !important; outline-offset: 1px !important; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { outline: none !important; }
                a[href] { text-decoration: underline !important; color: var(--acc-du-accent2) !important; }
                a[href]:hover { color: var(--acc-du-accent2-hover) !important; }
            `
        },
         'grayscale_comfort': {
            name: 'Grayscale Comfort',
            description: 'Monochromatic theme for photosensitivity and migraine relief. Soft grays, no bright colors.',
            css: `
                :root {
                    --acc-gs-bg: #2a2a2a; --acc-gs-text: #d6d6d6; --acc-gs-bg-alt: #202020;
                    --acc-gs-accent: #b0b0b0; --acc-gs-accent-hover: #c0c0c0;
                    --acc-gs-link: #d6d6d6; --acc-gs-link-hover: #e0e0e0;
                    --acc-gs-error: #d6d6d6; --acc-gs-success: #d6d6d6;
                    --acc-gs-border: #444444; --acc-gs-border-focus: #b0b0b0;
                    --acc-gs-quote-text: #bcbcbc; --acc-gs-action-text: #999999;
                    --acc-gs-sender: #a0a0a0;
                }
                html { color-scheme: dark !important; } html.dark { --dark-mode: 1; }
                html.dark body { background: var(--acc-gs-bg) !important; color: var(--acc-gs-text) !important; font-family: 'Segoe UI', 'Verdana', sans-serif !important; }
                html.dark body::before { display: none !important; }
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { scrollbar-color: var(--acc-gs-border) transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--acc-gs-border) !important; border: 2px solid var(--acc-gs-bg) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--acc-gs-accent) !important; }
                [data-ui-component="ChatHeaderBar"], [data-ui-component="SideNavBar"] { background: var(--acc-gs-bg) !important; border-color: var(--acc-gs-border) !important; box-shadow: none !important; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--acc-gs-accent) !important; color: var(--acc-gs-bg) !important; border-left-color: var(--acc-gs-link) !important; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: var(--acc-gs-bg) !important; }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: var(--acc-gs-text) !important; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--acc-gs-sender) !important; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--acc-gs-link-hover) !important; }
                [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: var(--acc-gs-bg-alt) !important; border: 1px solid var(--acc-gs-border) !important; border-left: 3px solid var(--acc-gs-accent) !important; box-shadow: none !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--acc-gs-bg) !important; border: 1px solid var(--acc-gs-border) !important; border-left: 3px solid var(--acc-gs-border) !important; box-shadow: none !important; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--acc-gs-border-focus) !important; }
                [data-ui-component="MessageSenderName"] { color: var(--acc-gs-sender) !important; font-weight: normal; }
                [data-ui-component="MessageTextSpan"] { color: var(--acc-gs-text) !important; font-size: var(--dynamic-font-size) !important; line-height: var(--dynamic-line-height) !important; }
                [data-ui-component="MessageTextSpan"] > q { color: var(--acc-gs-quote-text) !important; font-style: italic !important; background: none !important; border: none; padding: 0; display: inline; }
                [data-ui-component="MessageTextSpan"] > em { color: var(--acc-gs-action-text) !important; font-style: italic !important; font-weight: bold !important; }
                [data-ui-component="MessageAvatarImage"] { border: 1px solid var(--acc-gs-border); filter: grayscale(100%); opacity: 0.8; }
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--acc-gs-sender) !important; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--acc-gs-link-hover) !important; }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: var(--acc-gs-accent) !important; stroke: var(--acc-gs-accent) !important; }
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--acc-gs-bg-alt) !important; border: 1px solid var(--acc-gs-border) !important; box-shadow: none; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--acc-gs-border-focus) !important; box-shadow: 0 0 0 2px var(--acc-gs-accent); }
                [data-ui-component="MessageInputTextarea"] { color: var(--acc-gs-text) !important; caret-color: var(--acc-gs-accent); font-size: var(--dynamic-font-size) !important; line-height: 1.5 !important; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--acc-gs-accent) !important; box-shadow: none; border: 1px solid var(--acc-gs-border); }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--acc-gs-accent-hover) !important; }
                [data-ui-component="SendButtonIcon"] { stroke: var(--acc-gs-bg) !important; }
                *:focus-visible { outline: 2px solid var(--acc-gs-accent) !important; outline-offset: 1px !important; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { outline: none !important; }
            `
        },
        'muted_dark_blue': {
            name: 'Muted Dark Blue',
            description: 'Alternative for photosensitivity. Soft dark blue tones, avoids high contrast and brightness.',
            css: `
                :root {
                    --acc-mdb-bg: #1b222c; --acc-mdb-text: #cfd8dc; --acc-mdb-bg-alt: #242f3d;
                    --acc-mdb-accent: #8fa3b0; --acc-mdb-accent-hover: #a1b3bf;
                    --acc-mdb-link: #cfd8dc; --acc-mdb-link-hover: #e0e6e9;
                    --acc-mdb-error: #cfd8dc; --acc-mdb-success: #cfd8dc;
                    --acc-mdb-border: #2c3744; --acc-mdb-border-focus: #8fa3b0;
                    --acc-mdb-quote-text: #aabac2; --acc-mdb-action-text: #8fa3b0;
                    --acc-mdb-sender: #a0a8ae;
                }
                html { color-scheme: dark !important; } html.dark { --dark-mode: 1; }
                html.dark body { background: var(--acc-mdb-bg) !important; color: var(--acc-mdb-text) !important; font-family: 'Segoe UI', 'Verdana', sans-serif !important; }
                html.dark body::before { display: none !important; }
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { scrollbar-color: var(--acc-mdb-border) transparent !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: var(--acc-mdb-border) !important; border: 2px solid var(--acc-mdb-bg) !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--acc-mdb-accent) !important; }
                [data-ui-component="ChatHeaderBar"], [data-ui-component="SideNavBar"] { background: var(--acc-mdb-bg) !important; border-color: var(--acc-mdb-border) !important; box-shadow: none !important; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--acc-mdb-accent) !important; color: var(--acc-mdb-bg) !important; border-left-color: var(--acc-mdb-link) !important; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: var(--acc-mdb-bg) !important; }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: var(--acc-mdb-text) !important; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--acc-mdb-sender) !important; }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--acc-mdb-link-hover) !important; }
                [data-ui-component="BotMessageContainer"], [data-ui-component="ChatHeroInnerContainer"] { background-color: var(--acc-mdb-bg-alt) !important; border: 1px solid var(--acc-mdb-border) !important; border-left: 3px solid var(--acc-mdb-accent) !important; box-shadow: none !important; }
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--acc-mdb-bg) !important; border: 1px solid var(--acc-mdb-border) !important; border-left: 3px solid var(--acc-mdb-border) !important; box-shadow: none !important; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--acc-mdb-border-focus) !important; }
                [data-ui-component="MessageSenderName"] { color: var(--acc-mdb-sender) !important; font-weight: normal; }
                [data-ui-component="MessageTextSpan"] { color: var(--acc-mdb-text) !important; font-size: var(--dynamic-font-size) !important; line-height: var(--dynamic-line-height) !important; }
                [data-ui-component="MessageTextSpan"] > q { color: var(--acc-mdb-quote-text) !important; font-style: italic !important; background: none !important; border: none; padding: 0; display: inline; }
                [data-ui-component="MessageTextSpan"] > em { color: var(--acc-mdb-action-text) !important; font-style: italic !important; font-weight: normal !important; }
                [data-ui-component="MessageAvatarImage"] { border: 1px solid var(--acc-mdb-border); filter: saturate(0.5); opacity: 0.9; }
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--acc-mdb-sender) !important; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--acc-mdb-link-hover) !important; }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: var(--acc-mdb-accent) !important; stroke: var(--acc-mdb-accent) !important; }
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--acc-mdb-bg-alt) !important; border: 1px solid var(--acc-mdb-border) !important; box-shadow: none; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--acc-mdb-border-focus) !important; box-shadow: 0 0 0 2px var(--acc-mdb-accent); }
                [data-ui-component="MessageInputTextarea"] { color: var(--acc-mdb-text) !important; caret-color: var(--acc-mdb-accent); font-size: var(--dynamic-font-size) !important; line-height: 1.5 !important; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--acc-mdb-accent) !important; box-shadow: none; border: 1px solid var(--acc-mdb-border); }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--acc-mdb-accent-hover) !important; }
                [data-ui-component="SendButtonIcon"] { stroke: var(--acc-mdb-bg) !important; }
                *:focus-visible { outline: 2px solid var(--acc-mdb-accent) !important; outline-offset: 1px !important; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { outline: none !important; }
            `
        },
        'strong_contrast': {
            name: 'Strong Contrast',
            description: 'High contrast (black/white/yellow/blue) with large fonts and spacing for low vision users.',
            css: `
                :root {
                    --acc-sc-bg: #000000; --acc-sc-text: #FFFFFF; --acc-sc-bg-alt: #222222; --acc-sc-bg-panel: #0d0d0d;
                    --acc-sc-accent: #FFFF00; --acc-sc-accent-hover: #ffff80;
                    --acc-sc-link: #33ccff; --acc-sc-link-hover: #80e5ff;
                    --acc-sc-error: #FFA500; --acc-sc-success: var(--acc-sc-link);
                    --acc-sc-border: #666666; --acc-sc-border-focus: var(--acc-sc-accent);
                    --acc-sc-quote-text: #FFFF00; --acc-sc-action-text: #33ccff;
                    --acc-sc-sender: #dddddd;
                    --acc-sc-shadow: rgba(255, 255, 0, 0.2);
                }
                html { color-scheme: dark !important; } html.dark { --dark-mode: 1; }
                html.dark body { background: var(--acc-sc-bg) !important; color: var(--acc-sc-text) !important; font-family: 'Arial', 'Verdana', sans-serif !important; }
                html.dark body::before { display: none !important; }
                [data-ui-component="ChatMessageScrollContainer"], [data-ui-component="SideNavBar"] { scrollbar-color: #ccc #444 !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar { width: 14px !important; height: 14px !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-track { background: #222 !important; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb { background-color: #ddd !important; border: 2px solid #222 !important; border-radius: 7px; }
                [data-ui-component="ChatMessageScrollContainer"]::-webkit-scrollbar-thumb:hover, [data-ui-component="SideNavBar"]::-webkit-scrollbar-thumb:hover { background-color: var(--acc-sc-accent) !important; border-color: #fff; }
                [data-ui-component="ChatHeaderBar"] { background: var(--acc-sc-bg-panel) !important; border: 2px solid var(--acc-sc-border) !important; box-shadow: 0 2px 5px rgba(0,0,0,0.5); }
                [data-ui-component="SideNavBar"] { background: var(--acc-sc-bg-panel) !important; border: 2px solid var(--acc-sc-border) !important; box-shadow: 2px 0 5px rgba(0,0,0,0.5); }
                [data-ui-component^="SideNav"] button { border: 2px solid transparent; padding: 10px 15px !important; font-weight: bold !important; }
                [data-ui-component^="SideNav"] button:hover { background-color: var(--acc-sc-accent) !important; color: #000 !important; border: 2px solid var(--acc-sc-accent) !important; }
                [data-ui-component^="SideNav"] button:hover svg { stroke: #000 !important; }
                [data-ui-component="ChatHeaderCharacterName"], [data-ui-component="ChatHeaderCreatorName"] { color: var(--acc-sc-text) !important; font-weight: bold; }
                [data-ui-component="ChatHeaderShareButton"] svg, [data-ui-component="ChatHeaderMoreOptionsButton"] svg, [data-ui-component="ChatHeaderLikeButton"] svg { stroke: var(--acc-sc-sender) !important; width: 22px; height: 22px; filter: drop-shadow(0 0 1px black); }
                [data-ui-component="ChatHeaderShareButton"]:hover svg, [data-ui-component="ChatHeaderMoreOptionsButton"]:hover svg, [data-ui-component="ChatHeaderLikeButton"]:hover svg { stroke: var(--acc-sc-accent-hover) !important; filter: drop-shadow(0 0 2px var(--acc-sc-accent-hover)); }
                [data-ui-component="BotMessageContainer"], [data-ui-component="UserMessageBackgroundContainer"], [data-ui-component="ChatHeroInnerContainer"] {
                    background-color: var(--acc-sc-bg) !important; border: 2px solid var(--acc-sc-border) !important;
                    padding: 1.5rem 1.8rem !important; margin-bottom: 1.5rem !important; box-shadow: none !important; border-radius: 4px;
                }
                [data-ui-component="UserMessageBackgroundContainer"] { background-color: var(--acc-sc-bg-alt) !important; border-color: #888; }
                [data-ui-component="BotMessageContainer"]:hover, [data-ui-component="UserMessageBackgroundContainer"]:hover { border-color: var(--acc-sc-border-focus) !important; }
                [data-ui-component="MessageSenderName"] { color: var(--acc-sc-sender) !important; font-weight: bold; font-size: 1.1em; }
                [data-ui-component="MessageTextSpan"] { color: var(--acc-sc-text) !important; font-size: var(--dynamic-font-size) !important; line-height: var(--dynamic-line-height) !important; font-weight: bold !important; }
                [data-ui-component="MessageTextSpan"] > q { color: var(--acc-sc-quote-text) !important; font-weight: bold !important; font-style: normal !important; background: transparent !important; border-left: 4px solid var(--acc-sc-quote-text); padding: 0.2em 0.6em; display: inline-block; margin: 0.2em 0; border-radius: 3px; }
                [data-ui-component="MessageTextSpan"] > em { color: var(--acc-sc-action-text) !important; font-style: italic !important; font-weight: bold !important; text-decoration: underline; text-decoration-color: var(--acc-sc-action-text); }
                [data-ui-component="MessageAvatarImage"] { border: 3px solid var(--acc-sc-border); width: 52px !important; height: 52px !important; border-radius: 50%; }
                [data-ui-component="MessageActionsContainer"] button svg { stroke: var(--acc-sc-sender) !important; width: 26px; height: 26px; }
                [data-ui-component="MessageActionsContainer"] button:hover svg { stroke: var(--acc-sc-accent-hover) !important; filter: drop-shadow(0 0 2px var(--acc-sc-accent-hover)); }
                [data-ui-component="BotMessageRateButton"][aria-label*='Star-button'].opacity-100 svg { fill: var(--acc-sc-accent) !important; stroke: var(--acc-sc-accent) !important; filter: drop-shadow(0 0 3px var(--acc-sc-accent)); }
                [data-ui-component="TextInputAreaWrapper"] { background-color: var(--acc-sc-bg-alt) !important; border: 2px solid var(--acc-sc-border) !important; box-shadow: none; padding: 8px 12px !important; border-radius: 6px;}
                [data-ui-component="TextInputAreaWrapper"]:focus-within { border-color: var(--acc-sc-border-focus) !important; box-shadow: 0 0 0 3px var(--acc-sc-accent); }
                [data-ui-component="MessageInputTextarea"] {
                    color: var(--acc-sc-text) !important; caret-color: var(--acc-sc-accent);
                    font-size: var(--dynamic-font-size) !important; line-height: 1.7 !important; padding: 12px 10px !important; font-weight: bold;
                 }
                [data-ui-component="MessageInputTextarea"]::placeholder { color: var(--acc-sc-sender) !important; opacity: 0.9; font-style: normal; font-weight: normal; }
                [data-ui-component="SendButtonContainer"] { background-color: var(--acc-sc-accent) !important; border-radius: 6px !important; border: 2px solid #000; padding: 10px !important; }
                [data-ui-component="SendButtonContainer"]:hover { background-color: var(--acc-sc-accent-hover) !important; box-shadow: 0 0 5px var(--acc-sc-accent-hover); }
                [data-ui-component="SendButtonIcon"] { stroke: #000 !important; width: 30px; height: 30px; }
                *:focus-visible { outline: 3px solid var(--acc-sc-link) !important; outline-offset: 2px !important; box-shadow: none !important; }
                [data-ui-component="TextInputAreaWrapper"]:focus-within { outline: none !important; }
                a[href] { text-decoration: underline !important; color: var(--acc-sc-link) !important; font-weight: bold; }
                a[href]:hover { color: var(--acc-sc-link-hover) !important; }
            `
        }
    };

    let logoElement, popupElement, dynamicStyleElement, themeStyleElement, settingsView, themesView,
        fontSlider, fontValue, themeDisplay,
        changeThemeBtn, resetBtn, themeListContainer, backBtn;
    let currentThemeKey = DEFAULT_THEME_KEY;
    let currentFontSize = DEFAULT_FONT_SIZE;
    let isInitialized = false;

     const popupHTML = `
        <div id="${VIEW_SETTINGS_ID}" style="display: block;">
            <div class="customizer-header">Accessibility Enhancer v${GM_info.script.version}</div>
            <div class="customizer-section">
                <label for="${FONT_SLIDER_ID}">Message Font Size</label>
                <div class="slider-container">
                     <input type="range" id="${FONT_SLIDER_ID}" min="10" max="36" step="1">
                     <span id="${FONT_VALUE_ID}"></span>
                </div>
            </div>
            <div class="customizer-section theme-section">
                <span>Current Theme: <strong id="${THEME_DISPLAY_ID}"></strong></span>
                <button id="${CHANGE_THEME_BTN_ID}" class="customizer-button">Change Theme</button>
            </div>
            <div class="customizer-footer">
                 <button id="${RESET_BTN_ID}" class="customizer-button secondary">Reset Font Size</button>
            </div>
        </div>
        <div id="${VIEW_THEMES_ID}" style="display: none;">
             <div class="customizer-header">Choose Accessibility Theme</div>
            <div id="${THEME_LIST_ID}" class="theme-list"></div>
            <div class="customizer-footer">
                <button id="${BACK_BTN_ID}" class="customizer-button secondary">Back</button>
            </div>
        </div>
    `;

     const guiStyles = `
        #${POPUP_ID} { display: none !important; position: fixed !important; z-index: 100005 !important; top: 15px !important; right: 15px !important; bottom: auto !important; left: auto !important; background-color: rgba(44, 48, 56, 0.92) !important; color: #d8dee9 !important; border: 1px solid rgba(216, 222, 233, 0.15) !important; border-radius: 8px !important; width: 300px !important; padding: 0px !important; font-size: 13px !important; font-family: 'Inter', sans-serif !important; box-shadow: 0 6px 25px rgba(0,0,0,0.5) !important; backdrop-filter: blur(7px) !important; transition: opacity 0.2s ease, transform 0.2s ease; opacity: 0; transform: translateY(10px) scale(0.98); }
        #${POPUP_ID}.visible { display: block !important; opacity: 1; transform: translateY(0) scale(1); }
        #${POPUP_ID} .customizer-header { font-size: 15px; font-weight: 600; text-align: center; margin: 0; padding: 12px 18px 10px 18px; border-bottom: 1px solid rgba(216, 222, 233, 0.1); background-color: rgba(59, 66, 82, 0.6); border-radius: 8px 8px 0 0; color: #eceff4; }
        #${POPUP_ID} .customizer-section { margin-bottom: 18px; padding: 0 18px; }
        #${POPUP_ID} .customizer-section:first-of-type { margin-top: 18px; }
        #${POPUP_ID} label { display: block; margin-bottom: 6px; font-weight: 500; color: #d8dee9; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; }
        #${POPUP_ID} .slider-container { display: flex; align-items: center; gap: 12px; }
        #${POPUP_ID} input[type="range"] { flex-grow: 1; cursor: pointer; -webkit-appearance: none; appearance: none; height: 6px; background: #434c5e; border-radius: 3px; outline: none; transition: background-color 0.15s ease; }
        #${POPUP_ID} input[type="range"]:hover { background: #4c566a; }
        #${POPUP_ID} input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; background: #88c0d0; border-radius: 50%; cursor: pointer; border: 2px solid #3b4252; transition: background-color 0.15s ease, transform 0.1s ease; }
        #${POPUP_ID} input[type="range"]::-moz-range-thumb { width: 16px; height: 16px; background: #88c0d0; border-radius: 50%; cursor: pointer; border: 2px solid #3b4252; transition: background-color 0.15s ease, transform 0.1s ease; }
        #${POPUP_ID} input[type="range"]:active::-webkit-slider-thumb { transform: scale(1.1); }
        #${POPUP_ID} input[type="range"]:active::-moz-range-thumb { transform: scale(1.1); }
        #${POPUP_ID} span[id*="-value"] { min-width: 40px; text-align: right; font-family: monospace; font-size: 14px; font-weight: bold; color: #eceff4; background: rgba(59, 66, 82, 0.4); padding: 2px 5px; border-radius: 4px; }
        #${POPUP_ID} .theme-section { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding-top: 15px; border-top: 1px solid rgba(216, 222, 233, 0.1); margin-top: 18px; }
        #${POPUP_ID} .theme-section span { color: #d8dee9; font-size: 12px; }
        #${POPUP_ID} .theme-section strong { color: #eceff4; font-weight: 600; }
        #${POPUP_ID} .customizer-button { background-color: #5e81ac; color: #eceff4; border: none; border-radius: 5px; padding: 8px 15px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.2); width: 100%; text-align: center; }
        #${POPUP_ID} .customizer-button:hover { background-color: #81a1c1; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        #${POPUP_ID} .customizer-button:active { transform: translateY(1px); }
        #${POPUP_ID} .customizer-button.secondary { background-color: #4c566a; color: #d8dee9; }
        #${POPUP_ID} .customizer-button.secondary:hover { background-color: #5e6a7e; }
        #${POPUP_ID} .customizer-footer { margin-top: 0; padding: 15px 18px; border-top: 1px solid rgba(216, 222, 233, 0.1); }
        #${POPUP_ID} #${THEME_LIST_ID} { max-height: 280px; overflow-y: auto; margin: 10px 0; padding: 0 18px 10px 18px; scrollbar-width: thin; scrollbar-color: #5e6a7e #3b4252; }
        #${POPUP_ID} #${THEME_LIST_ID}::-webkit-scrollbar { width: 8px; }
        #${POPUP_ID} #${THEME_LIST_ID}::-webkit-scrollbar-track { background: #3b4252; border-radius: 4px;}
        #${POPUP_ID} #${THEME_LIST_ID}::-webkit-scrollbar-thumb { background-color: #5e6a7e; border-radius: 4px; border: 2px solid #3b4252;}
        #${POPUP_ID} .theme-item { padding: 10px 12px; margin-bottom: 8px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(76, 86, 106, 0.5); background-color: rgba(59, 66, 82, 0.4); transition: background-color 0.2s ease, border-color 0.2s ease; }
        #${POPUP_ID} .theme-item:hover { background-color: rgba(76, 86, 106, 0.7); border-color: #5e81ac; }
        #${POPUP_ID} .theme-item-name { font-weight: 600; display: block; margin-bottom: 4px; color: #eceff4; font-size: 14px; }
        #${POPUP_ID} .theme-item-desc { font-size: 12px; color: #d8dee9; opacity: 0.8; line-height: 1.4; }
        #${LOGO_ID} { cursor: pointer !important; pointer-events: auto !important; transition: transform 0.2s ease, opacity 0.2s ease !important; opacity: 0.7 !important; }
        #${LOGO_ID}:hover { transform: scale(1.1) !important; opacity: 1 !important; }
    `;

    function applyDynamicStyles() {
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

     function applyTheme(themeKey) {
         currentThemeKey = themes[themeKey] ? themeKey : DEFAULT_THEME_KEY;
         const theme = themes[currentThemeKey];
         console.log(`Accessibility Enhancer: Applying theme: "${theme.name}" (Key: ${currentThemeKey})`);
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
         document.documentElement.classList.add('dark');
         document.documentElement.style.colorScheme = 'dark';
     }

     async function saveSettings() {
         try { await GM_setValue(STORAGE_FONT_SIZE_KEY, currentFontSize); console.log(`Accessibility Enhancer: Saved FontSize: ${currentFontSize}`); } catch (e) { console.error("Error saving font size:", e); }
     }
     async function saveTheme() {
         try { await GM_setValue(STORAGE_THEME_KEY, currentThemeKey); console.log(`Accessibility Enhancer: Saved Theme: ${currentThemeKey}`); } catch (e) { console.error("Error saving theme:", e); }
     }
     async function loadSettings() {
          try {
              currentThemeKey = await GM_getValue(STORAGE_THEME_KEY, DEFAULT_THEME_KEY);
              currentFontSize = await GM_getValue(STORAGE_FONT_SIZE_KEY, DEFAULT_FONT_SIZE);
              currentFontSize = Math.max(10, Math.min(36, parseInt(currentFontSize, 10) || DEFAULT_FONT_SIZE));
              if (!themes[currentThemeKey]) {
                  console.warn(`Accessibility Enhancer: Loaded theme key "${currentThemeKey}" not found. Using default (${DEFAULT_THEME_KEY}).`);
                  currentThemeKey = DEFAULT_THEME_KEY;
                  await saveTheme();
              }
          } catch (e) {
              console.error("Accessibility Enhancer: Error loading settings:", e);
              currentThemeKey = DEFAULT_THEME_KEY;
              currentFontSize = DEFAULT_FONT_SIZE;
          }
          console.log(`Accessibility Enhancer: Loaded Settings: Theme=${currentThemeKey}, Font=${currentFontSize}px`);
     }

     function resetSettings() {
         console.log("Accessibility Enhancer: Resetting font size to default...");
         currentFontSize = DEFAULT_FONT_SIZE;
         if (fontSlider) fontSlider.value = currentFontSize;
         applyDynamicStyles();
         saveSettings();
     }
     function populateThemeList() {
         if (!themeListContainer) return;
         themeListContainer.innerHTML = '';
         for (const key in themes) {
             const theme = themes[key];
             const item = document.createElement('div');
             item.className = 'theme-item';
             item.dataset.themeKey = key;
             item.innerHTML = `<span class="theme-item-name">${theme.name}</span> <span class="theme-item-desc">${theme.description}</span>`;
             item.addEventListener('click', () => { applyTheme(key); saveTheme(); switchView('settings'); });
             themeListContainer.appendChild(item);
         }
          console.log("Accessibility Enhancer: Theme list populated.");
     }
     function switchView(viewName) {
         if (!settingsView || !themesView || !popupElement) return;
         settingsView.style.display = (viewName === 'settings') ? 'block' : 'none';
         themesView.style.display = (viewName === 'themes') ? 'block' : 'none';
     }
     function togglePopup() {
          if (!popupElement) return;
          const isVisible = popupElement.classList.contains('visible');
          if (!isVisible) {
              positionPopup();
              void popupElement.offsetWidth;
              popupElement.classList.add('visible');
          } else {
              popupElement.classList.remove('visible');
          }
     }
     function positionPopup() {
          if (!popupElement) return;
          popupElement.style.top = '15px';
          popupElement.style.right = '15px';
          popupElement.style.bottom = 'auto';
          popupElement.style.left = 'auto';
     }

    async function initialize() {
        if (isInitialized) { return; }
        logoElement = document.getElementById(LOGO_ID);
        if (!logoElement) {
            console.warn("Accessibility Enhancer: Logic Core's logo element not found. Retrying in 1.5s...");
            setTimeout(initialize, 1500);
            return;
        }
        isInitialized = true;
        await loadSettings();
        if (!document.getElementById(POPUP_ID)) {
             popupElement = document.createElement('div');
             popupElement.id = POPUP_ID;
             document.body.appendChild(popupElement);
        } else {
             popupElement = document.getElementById(POPUP_ID);
        }
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
            console.error("Accessibility Enhancer: Initialization failed: Could not find all essential GUI elements!");
            if (popupElement) popupElement.remove(); isInitialized = false; return;
        }
        GM_addStyle(guiStyles);
        populateThemeList();
        fontSlider.value = currentFontSize;
        applyTheme(currentThemeKey);
        applyDynamicStyles();

        if (!logoElement.dataset.customizerListener) { logoElement.addEventListener('click', (e) => { e.stopPropagation(); togglePopup(); }); logoElement.dataset.customizerListener = 'true'; }
        if (!fontSlider.dataset.listenerAdded) { fontSlider.addEventListener('input', () => { currentFontSize = fontSlider.value; applyDynamicStyles(); }); fontSlider.addEventListener('change', saveSettings); fontSlider.dataset.listenerAdded = 'true'; }
        if (!resetBtn.dataset.listenerAdded) { resetBtn.addEventListener('click', resetSettings); resetBtn.dataset.listenerAdded = 'true'; }
        if (!changeThemeBtn.dataset.listenerAdded) { changeThemeBtn.addEventListener('click', () => switchView('themes')); changeThemeBtn.dataset.listenerAdded = 'true'; }
        if (!backBtn.dataset.listenerAdded) { backBtn.addEventListener('click', () => switchView('settings')); backBtn.dataset.listenerAdded = 'true'; }
        if (!document.body.dataset.customizerPopupListener) { document.addEventListener('click', (event) => { if (popupElement && popupElement.classList.contains('visible')) { if (!popupElement.contains(event.target) && !logoElement.contains(event.target)) { togglePopup(); } } }, true); document.body.dataset.customizerPopupListener = 'true'; }

        console.log(`Accessibility Enhancer v${GM_info.script.version}: Initialization complete. Applied theme: ${currentThemeKey}, Font size: ${currentFontSize}px`);
    }

    const INITIALIZATION_DELAY = 4500;
    setTimeout(initialize, INITIALIZATION_DELAY);

})();
