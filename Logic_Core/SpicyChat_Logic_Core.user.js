// ==UserScript==
// @name         SpicyChat Logic Core
// @namespace    http://tampermonkey.net/
// @version      2.0
// @author       Discord: @encode_your, SpicyChat: @sophieaaa
// @description  Adds component labels to SpicyChat UI elements.
// @match        https://spicychat.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spicychat.ai
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_notification
// @connect      raw.githubusercontent.com
// @updateURL    https://github.com/RomanovaSpicy/Spicy_CustomUI/raw/refs/heads/main/Logic_Core/SpicyChat_Logic_Core.user.js
// @downloadURL  https://github.com/RomanovaSpicy/Spicy_CustomUI/raw/refs/heads/main/Logic_Core/SpicyChat_Logic_Core.user.js
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    console.log("SpicyChat Logic Core: Script loaded (v0.2.1).");

    const SCRIPT_UPDATE_URL = 'https://github.com/RomanovaSpicy/Spicy_CustomUI/raw/refs/heads/main/Logic_Core/SpicyChat_Logic_Core.user.js';
    const CHECK_INTERVAL_HOURS = 1;
    const LAST_CHECK_TIMESTAMP_KEY = "scLogicCore_lastUpdateCheck";

    const logoUrl = "https://i.postimg.cc/d1pB83jc/LIBRARY-LOGO-for-discord-1.png";

    let coreInitializedForChatPage = false;
    let pageMutationObserver = null;
    let logoElementRef = null;
    let animationTimeoutId = null;
    let dictionaryLoaded = false;
    let initialMarkingDone = false;

    async function checkForUpdates() {
        const localVersion = GM_info.script.version;
        const scriptName = GM_info.script.name;
        console.log(`SpicyChat Logic Core: Current version ${localVersion}`);

        const lastCheckTimestamp = await GM_getValue(LAST_CHECK_TIMESTAMP_KEY, 0);
        const now = Date.now();

        if (now - lastCheckTimestamp < CHECK_INTERVAL_HOURS * 60 * 60 * 1000 && lastCheckTimestamp !== 0) {
            console.log("SpicyChat Logic Core: Update check performed recently. Skipping.");
            return;
        }

        console.log("SpicyChat Logic Core: Checking for updates on GitHub...");

        try {
             GM_xmlhttpRequest({
                method: "GET",
                url: SCRIPT_UPDATE_URL,
                nocache: true,
                onload: async function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const remoteScriptContent = response.responseText;
                        const versionMatch = remoteScriptContent.match(/@version\s+([\d.]+)/);

                        if (versionMatch && versionMatch[1]) {
                            const remoteVersion = versionMatch[1];
                            console.log(`SpicyChat Logic Core: Latest version on GitHub: ${remoteVersion}`);

                            if (compareVersions(remoteVersion, localVersion) > 0) {
                                const githubFileURL = SCRIPT_UPDATE_URL
                                    .replace('raw.githubusercontent.com/', 'github.com/')
                                    .replace('/refs/heads/main/', '/blob/main/');

                                const notificationTitle = `${scriptName}: Update available!`;
                                const notificationText = `New version ${remoteVersion} found (you have ${localVersion}). Click to go to the update page.`;

                                console.warn(`%c${notificationTitle}`, 'color: orange; font-weight: bold;');
                                console.warn(`%cUpdate link: ${githubFileURL}`, 'color: orange;');

                                GM_notification({
                                    text: notificationText,
                                    title: notificationTitle,
                                    image: logoUrl,
                                    highlight: true,
                                    onclick: () => {
                                        window.open(githubFileURL, '_blank');
                                    },
                                    timeout: 0
                                });
                            } else {
                                console.log("SpicyChat Logic Core: You have the latest version.");
                            }
                            await GM_setValue(LAST_CHECK_TIMESTAMP_KEY, now);
                        } else {
                            console.warn("SpicyChat Logic Core: Could not find @version in remote script.");
                            await GM_setValue(LAST_CHECK_TIMESTAMP_KEY, now);
                        }
                    } else {
                        console.warn(`SpicyChat Logic Core: Error loading update data. Status: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    console.error("SpicyChat Logic Core: Network error during update check:", error);
                },
                ontimeout: function() {
                     console.error("SpicyChat Logic Core: Timeout during update check.");
                },
                timeout: 15000
            });
        } catch (error) {
            console.error("SpicyChat Logic Core: Exception during update check attempt:", error);
        }
    }

    function compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        const len = Math.max(parts1.length, parts2.length);
        for (let i = 0; i < len; i++) {
            const p1 = parts1[i] || 0;
            const p2 = parts2[i] || 0;
            if (p1 > p2) return 1;
            if (p1 < p2) return -1;
        }
        return 0;
    }

    const LOGO_ID = 'sc-persistent-logo';
    const animationDurationMs = 3500;
    const minIntervalSeconds = 60;
    const maxIntervalSeconds = 90;

    const logoCssStyles = `
        #${LOGO_ID} {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 65px;
            height: 65px;
            background-image: url(${logoUrl});
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 0.6;
            pointer-events: none;
            z-index: 99999;
            transform: rotate(0deg);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        @keyframes rotateLogo {
            from { transform: rotate(0deg); }
            to { transform: rotate(1080deg); }
        }

        #${LOGO_ID}.logo-rotating {
            animation: rotateLogo ${animationDurationMs / 1000}s ease-in-out 1;
        }
    `;

    function triggerLogoAnimation() {
        if (!logoElementRef || logoElementRef.classList.contains('logo-rotating')) {
            if (!logoElementRef) console.warn("Logic Core Logo: Logo element not found for trigger.");
            return;
        }
        logoElementRef.classList.add('logo-rotating');
        setTimeout(() => {
            if (logoElementRef) {
                logoElementRef.classList.remove('logo-rotating');
                scheduleNextAnimation();
            }
        }, animationDurationMs);
    }

    function scheduleNextAnimation() {
        if (animationTimeoutId) clearTimeout(animationTimeoutId);
        if (!logoElementRef) {
             console.warn("Logic Core Logo: Logo element not found for schedule.");
             return;
        }
        const randomDelay = (minIntervalSeconds + Math.random() * (maxIntervalSeconds - minIntervalSeconds)) * 1000;
        animationTimeoutId = setTimeout(() => {
             if (document.getElementById(LOGO_ID)) {
                 triggerLogoAnimation();
             } else {
                 console.warn("Logic Core Logo: Logo element disappeared before scheduled animation.");
                 logoElementRef = null;
             }
        }, randomDelay);
    }

    function createLogoElement() {
        if (document.getElementById(LOGO_ID)) {
             logoElementRef = document.getElementById(LOGO_ID);
             console.log("Logic Core Logo: Logo element already exists.");
             if (!logoElementRef.classList.contains('logo-rotating') && !animationTimeoutId) {
                scheduleNextAnimation();
             }
             return;
        }
        logoElementRef = document.createElement('div');
        logoElementRef.id = LOGO_ID;
        logoElementRef.title = "SpicyChat Logic Core Active";
        document.body.appendChild(logoElementRef);
        console.log("Logic Core Logo: Logo element created and added.");
        scheduleNextAnimation();
    }

    const CACHE_KEY_DICTIONARY = "spicyChatCore_dictionary";
    const CACHE_KEY_TIMESTAMP = "spicyChatCore_lastCheckTimestamp_dict";
    const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000;

    function markElement(el, label) {
      if (!el || typeof el.matches !== 'function') return;
      if (el.dataset.uiComponent !== label) {
        el.dataset.uiComponent = label;
      }
    }

    let componentDictionary = {};
    const dictionaryUrl = 'https://raw.githubusercontent.com/RomanovaSpicy/Spicy_CustomUI/refs/heads/main/Dictionary/Dictionary4.json';

    async function loadDictionary(callback) {
        console.log("SpicyChat Logic Core: Loading dictionary...");
        dictionaryLoaded = false;
        initialMarkingDone = false;

        if (!dictionaryUrl) {
            console.warn("SpicyChat Logic Core: Dictionary URL not specified. Marking will not work.");
            if (callback) callback();
            return;
        }

        const lastCheckTimestamp = await GM_getValue(CACHE_KEY_TIMESTAMP, 0);
        const now = Date.now();
        let dictionaryFromCache = null;
        try {
             dictionaryFromCache = await GM_getValue(CACHE_KEY_DICTIONARY, null);
        } catch (e) {
            console.error("SpicyChat Logic Core: Error reading dictionary from GM_getValue!", e);
        }

        if (now - lastCheckTimestamp > CACHE_EXPIRY_MS || !dictionaryFromCache) {
            console.log("SpicyChat Logic Core: Dictionary cache expired or empty. Loading from URL...");
            try {
                 GM_xmlhttpRequest({
                    method: "GET",
                    url: dictionaryUrl,
                    nocache: true,
                    onload: async function(response) {
                        if (response.status >= 200 && response.status < 300) {
                             try {
                                const data = JSON.parse(response.responseText);
                                componentDictionary = data.components || {};
                                await GM_setValue(CACHE_KEY_DICTIONARY, componentDictionary);
                                await GM_setValue(CACHE_KEY_TIMESTAMP, now);
                                console.log("SpicyChat Logic Core: Dictionary successfully loaded from URL and cached.");
                                dictionaryLoaded = true;
                             } catch (parseError) {
                                console.error("SpicyChat Logic Core: Failed to parse dictionary JSON:", parseError);
                                if (dictionaryFromCache) {
                                    console.warn("SpicyChat Logic Core: Using cached dictionary due to JSON parsing error.");
                                    componentDictionary = dictionaryFromCache;
                                    dictionaryLoaded = true;
                                } else {
                                    console.error("SpicyChat Logic Core: Cache empty, JSON parsing failed. Marking will not work.");
                                    componentDictionary = {};
                                }
                             }
                        } else {
                             console.error(`SpicyChat Logic Core: Failed to load dictionary from URL. Status: ${response.status}`);
                             if (dictionaryFromCache) {
                                console.warn("SpicyChat Logic Core: Using cached dictionary due to loading error.");
                                componentDictionary = dictionaryFromCache;
                                dictionaryLoaded = true;
                             } else {
                                console.error("SpicyChat Logic Core: Cache empty, loading failed. Marking will not work.");
                                componentDictionary = {};
                             }
                        }
                        if (callback) callback();
                    },
                    onerror: function(error) {
                        console.error("SpicyChat Logic Core: Network error while loading dictionary:", error);
                        if (dictionaryFromCache) {
                            console.warn("SpicyChat Logic Core: Using cached dictionary due to network error.");
                            componentDictionary = dictionaryFromCache;
                            dictionaryLoaded = true;
                        } else {
                            console.error("SpicyChat Logic Core: Cache empty, network error. Marking will not work.");
                            componentDictionary = {};
                        }
                        if (callback) callback();
                    },
                    ontimeout: function() {
                        console.error("SpicyChat Logic Core: Timeout while loading dictionary.");
                        if (dictionaryFromCache) {
                            console.warn("SpicyChat Logic Core: Using cached dictionary due to timeout.");
                            componentDictionary = dictionaryFromCache;
                            dictionaryLoaded = true;
                        } else {
                            console.error("SpicyChat Logic Core: Cache empty, timeout. Marking will not work.");
                            componentDictionary = {};
                        }
                        if (callback) callback();
                    },
                    timeout: 15000
                 });
            } catch (error) {
                console.error("SpicyChat Logic Core: Exception while trying to load dictionary:", error);
                if (dictionaryFromCache) {
                    console.warn("SpicyChat Logic Core: Using cached dictionary due to exception.");
                    componentDictionary = dictionaryFromCache;
                    dictionaryLoaded = true;
                } else {
                    console.error("SpicyChat Logic Core: Cache empty, exception. Marking will not work.");
                    componentDictionary = {};
                }
                if (callback) callback();
            }
        } else {
            console.log("SpicyChat Logic Core: Dictionary loaded from cache.");
            componentDictionary = dictionaryFromCache;
            dictionaryLoaded = true;
            if (callback) callback();
        }
    }

    let attempts = 0;
    const MAX_ATTEMPTS = 100;
    function tryInitializeChatPageLogic() {
        if (!dictionaryLoaded) {
            console.log("SpicyChat Logic Core: Dictionary not yet loaded, delaying chat page logic initialization.");
            return;
        }
        if (initialMarkingDone && pageMutationObserver) {
             console.log("SpicyChat Logic Core: Initial marking already done and MutationObserver active.");
             return;
        }

        console.log("SpicyChat Logic Core: Attempting to initialize chat page logic...");
        attempts++;
        const scrollContainerSelector = 'div.grow.flex.flex-col.w-full.left-0.items-center.absolute.h-full.overflow-auto';
        let scrollContainer = null;
        try {
            scrollContainer = document.querySelector(scrollContainerSelector);
        } catch(e) {
             console.error("SpicyChat Logic Core: Error querying for scrollContainer", e);
        }

        if (!scrollContainer) {
          if (attempts < MAX_ATTEMPTS) {
            console.warn(`Logic Core: Critical element (scrollContainer) not found. Attempt ${attempts}/${MAX_ATTEMPTS} in 500ms.`);
            setTimeout(tryInitializeChatPageLogic, 500);
          } else {
            console.error("SpicyChat Logic Core: Critical DOM element (scrollContainer) not found, aborting MutationObserver initialization attempts.");
            attempts = 0;
          }
          return;
        }

        console.log("SpicyChat Logic Core: Critical DOM element (scrollContainer) found.");
        attempts = 0;

        if (Object.keys(componentDictionary).length === 0) {
            console.warn("SpicyChat Logic Core: Component dictionary is empty. Initial marking and observation will not be performed.");
        } else {
            console.log("SpicyChat Logic Core: Performing initial marking...");
            let markedCount = 0;
            for (const selector in componentDictionary) {
              if (selector.startsWith('//')) { continue; }
              const config = componentDictionary[selector];
              const label = config?.label;
              if (label) {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                      if (!el.dataset.uiComponent) {
                          markElement(el, label);
                          markedCount++;
                      }
                    });
                } catch (e) {
                    console.error(`SpicyChat Logic Core: Error querying selector during initial marking: "${selector}"`, e);
                }
              } else if (typeof config !== 'object' || config === null) {
                 console.warn(`SpicyChat Logic Core: Invalid entry for selector "${selector}" in dictionary (object expected).`);
              } else if (!label) {
                 console.warn(`SpicyChat Logic Core: Missing 'label' for selector "${selector}" in dictionary.`);
              }
            }
            console.log(`SpicyChat Logic Core: Initial marking completed (approx. ${markedCount} elements marked).`);
            const event = new CustomEvent('LogicCoreReady', { detail: { status: 'initialized' } });
            document.dispatchEvent(event);
            initialMarkingDone = true;

            if (pageMutationObserver) {
                pageMutationObserver.disconnect();
            }

            pageMutationObserver = new MutationObserver(mutations => {
              mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                  mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                      for (const selector in componentDictionary) {
                         if (selector.startsWith('//')) { continue; }
                         const config = componentDictionary[selector];
                         const label = config?.label;
                         if (label) {
                           try {
                             if (node.matches(selector)) {
                               if (!node.dataset.uiComponent) {
                                   markElement(node, label);
                               }
                             }
                             if (node.querySelectorAll) {
                                 const descendants = node.querySelectorAll(selector);
                                 descendants.forEach(el => {
                                   if (!el.dataset.uiComponent) {
                                       markElement(el, label);
                                   }
                                 });
                             }
                           } catch (e) {
                               if (!window.invalidSelectorsLogged) { window.invalidSelectorsLogged = new Set(); }
                               if (!window.invalidSelectorsLogged.has(selector)) {
                                   console.error(`SpicyChat Logic Core: Error matching selector in MutationObserver: "${selector}"`, e);
                                   window.invalidSelectorsLogged.add(selector);
                               }
                           }
                         }
                      }
                    }
                  });
                }
              });
            });

            pageMutationObserver.observe(scrollContainer, { childList: true, subtree: true });
            console.log("SpicyChat Logic Core: MutationObserver activated for scrollContainer changes.");
        }
        console.log("SpicyChat Logic Core: Chat page logic initialization complete.");
      }

    function teardownChatPageFunctionality() {
        if (!coreInitializedForChatPage) return;
        console.log("SpicyChat Logic Core: Leaving chat page, cleaning up...");

        if (pageMutationObserver) {
            pageMutationObserver.disconnect();
            pageMutationObserver = null;
            console.log("SpicyChat Logic Core: MutationObserver stopped.");
        }

        const logo = document.getElementById(LOGO_ID);
        if (logo) {
            logo.remove();
            logoElementRef = null;
            if (animationTimeoutId) {
                clearTimeout(animationTimeoutId);
                animationTimeoutId = null;
            }
            console.log("SpicyChat Logic Core: Logo removed.");
        }
        attempts = 0;
        initialMarkingDone = false;
        coreInitializedForChatPage = false;
    }

    function handleLocationChange() {
        console.log(`SpicyChat Logic Core: URL changed to ${window.location.href}.`);
        const isOnChatPage = window.location.pathname.startsWith('/chat/');

        if (isOnChatPage) {
            if (coreInitializedForChatPage) {
                console.log("SpicyChat Logic Core: Already on chat page and initialized. Verifying state...");
                if (!document.getElementById(LOGO_ID)) createLogoElement();
                if (!dictionaryLoaded) {
                     loadDictionary(tryInitializeChatPageLogic);
                } else if (!initialMarkingDone || !pageMutationObserver) {
                     tryInitializeChatPageLogic();
                }
                return;
            }
            console.log("SpicyChat Logic Core: Entering chat page, initializing...");
            coreInitializedForChatPage = true;

            createLogoElement();
            loadDictionary(tryInitializeChatPageLogic);

        } else {
            teardownChatPageFunctionality();
        }
    }

    GM_addStyle(logoCssStyles);
    console.log("SpicyChat Logic Core: Logo styles added.");
    checkForUpdates();

    (function(history){
        const pushState = history.pushState;
        const replaceState = history.replaceState;
        let navigationTimeout;

        history.pushState = function() {
            const ret = pushState.apply(this, arguments);
            window.dispatchEvent(new Event('customPushstate_SLC'));
            return ret;
        };

        history.replaceState = function() {
            const ret = replaceState.apply(this, arguments);
            window.dispatchEvent(new Event('customReplacestate_SLC'));
            return ret;
        };

        const onLocationChange = () => {
            clearTimeout(navigationTimeout);
            navigationTimeout = setTimeout(handleLocationChange, 250);
        };

        window.addEventListener('popstate', onLocationChange);
        window.addEventListener('customPushstate_SLC', onLocationChange);
        window.addEventListener('customReplacestate_SLC', onLocationChange);

    })(window.history);

    if (document.readyState === 'complete') {
        setTimeout(handleLocationChange, 250);
    } else {
        window.addEventListener('load', () => {
            setTimeout(handleLocationChange, 250);
        }, { once: true });
    }

    console.log("SpicyChat Logic Core: SPA navigation tracking and initializer set up.");

})();
