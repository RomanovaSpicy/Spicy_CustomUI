// ==UserScript==
// @name         SpicyChat Logic Core
// @namespace    http://tampermonkey.net/
// @version      1.9
// @author       Discord: @encode_your, SpicyChat: @sophieaaa
// @description  Adds component labels to SpicyChat UI elements.
// @match        https://spicychat.ai/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spicychat.ai
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_notification
// @connect      raw.githubusercontent.com
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    console.log("SpicyChat Logic Core: Скрипт запущен.");

    const SCRIPT_UPDATE_URL = 'https://github.com/RomanovaSpicy/Spicy_CustomUI/raw/refs/heads/main/Logic_Core/SpicyChat_Logic_Core.user.js';
    const CHECK_INTERVAL_HOURS = 1;
    const LAST_CHECK_TIMESTAMP_KEY = "scLogicCore_lastUpdateCheck";

    const logoUrl = "https://i.postimg.cc/d1pB83jc/LIBRARY-LOGO-for-discord-1.png";

    async function checkForUpdates() {
        const localVersion = GM_info.script.version;
        const scriptName = GM_info.script.name;
        console.log(`SpicyChat Logic Core: Текущая версия ${localVersion}`);

        const lastCheckTimestamp = await GM_getValue(LAST_CHECK_TIMESTAMP_KEY, 0);
        const now = Date.now();

        if (now - lastCheckTimestamp < CHECK_INTERVAL_HOURS * 60 * 60 * 1000) {
            return;
        }

        console.log("SpicyChat Logic Core: Проверка наличия обновлений на GitHub...");

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
                            console.log(`SpicyChat Logic Core: Последняя версия на GitHub: ${remoteVersion}`);

                            if (compareVersions(remoteVersion, localVersion) > 0) {
                                const githubFileURL = SCRIPT_UPDATE_URL
                                    .replace('raw.githubusercontent.com/', 'github.com/')
                                    .replace('/refs/heads/main/', '/blob/main/');

                                const notificationTitle = `${scriptName}: Доступно обновление!`;
                                const notificationText = `Найдена новая версия ${remoteVersion} (у вас ${localVersion}). Нажмите, чтобы перейти на страницу обновления.`;

                                console.warn(`%c${notificationTitle}`, 'color: orange; font-weight: bold;');
                                console.warn(`%cСсылка для обновления: ${githubFileURL}`, 'color: orange;');

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
                                console.log("SpicyChat Logic Core: У вас установлена последняя версия.");
                            }
                            await GM_setValue(LAST_CHECK_TIMESTAMP_KEY, now);

                        } else {
                            console.warn("SpicyChat Logic Core: Не удалось найти @version в удаленном скрипте.");
                            await GM_setValue(LAST_CHECK_TIMESTAMP_KEY, now);
                        }
                    } else {
                        console.warn(`SpicyChat Logic Core: Ошибка загрузки данных для проверки обновления. Статус: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    console.error("SpicyChat Logic Core: Сетевая ошибка при проверке обновления:", error);
                },
                ontimeout: function() {
                     console.error("SpicyChat Logic Core: Таймаут при проверке обновления.");
                },
                timeout: 15000
            });
        } catch (error) {
            console.error("SpicyChat Logic Core: Исключение при попытке проверки обновления:", error);
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
    let logoElement = null;
    let animationTimeoutId = null;

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
        if (!logoElement || logoElement.classList.contains('logo-rotating')) {
            if (!logoElement) console.warn("Logic Core Logo: Элемент лого не найден для trigger.");
            return;
        }
        logoElement.classList.add('logo-rotating');
        setTimeout(() => {
            if (logoElement) {
                logoElement.classList.remove('logo-rotating');
                scheduleNextAnimation();
            }
        }, animationDurationMs);
    }

    function scheduleNextAnimation() {
        if (animationTimeoutId) clearTimeout(animationTimeoutId);
        if (!logoElement) {
             console.warn("Logic Core Logo: Элемент лого не найден для schedule.");
             return;
        }
        const randomDelay = (minIntervalSeconds + Math.random() * (maxIntervalSeconds - minIntervalSeconds)) * 1000;
        animationTimeoutId = setTimeout(() => {
             if (document.getElementById(LOGO_ID)) {
                 triggerLogoAnimation();
             } else {
                 console.warn("Logic Core Logo: Элемент лого исчез перед запланированной анимацией.");
                 logoElement = null;
             }
        }, randomDelay);
    }

    function createLogoElement() {
        if (document.getElementById(LOGO_ID)) {
             logoElement = document.getElementById(LOGO_ID);
             console.log("Logic Core Logo: Элемент лого уже существует.");
             return;
        }
        logoElement = document.createElement('div');
        logoElement.id = LOGO_ID;
        logoElement.title = "SpicyChat Logic Core Active";
        document.body.appendChild(logoElement);
        console.log("Logic Core Logo: Элемент лого создан и добавлен.");
        scheduleNextAnimation();
    }

    const CACHE_KEY_DICTIONARY = "spicyChatCore_dictionary";
    const CACHE_KEY_TIMESTAMP = "spicyChatCore_lastCheckTimestamp";
    const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000;

    function markElement(el, label) {
      if (!el || typeof el.matches !== 'function') return;
      if (el.dataset.uiComponent !== label) {
        el.dataset.uiComponent = label;
      }
    }

    function markOnce(selector, label) {
      if (!label) return;
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (!el.dataset.uiComponent) {
              markElement(el, label);
          }
        });
      } catch (e) {
        console.error(`SpicyChat Logic Core: Ошибка при поиске селектора в markOnce: "${selector}"`, e);
      }
    }

    let componentDictionary = {};
    const dictionaryUrl = 'https://raw.githubusercontent.com/RomanovaSpicy/Spicy_CustomUI/refs/heads/main/Dictionary/Dictionary4.json'; // URL СЛОВАРЯ

    async function loadDictionary(callback) {
        console.log("SpicyChat Logic Core: Загрузка словаря...");
        if (!dictionaryUrl) {
            console.warn("SpicyChat Logic Core: URL словаря не указан. Маркировка не будет работать.");
            callback();
            return;
        }

        const lastCheckTimestamp = await GM_getValue(CACHE_KEY_TIMESTAMP, 0);
        const now = Date.now();
        let dictionaryFromCache = null;
        try {
             dictionaryFromCache = await GM_getValue(CACHE_KEY_DICTIONARY, null);
        } catch (e) {
            console.error("SpicyChat Logic Core: Ошибка чтения словаря из GM_getValue!", e);
        }


        if (now - lastCheckTimestamp > CACHE_EXPIRY_MS || !dictionaryFromCache) {
            console.log("SpicyChat Logic Core: Время обновления кэша словаря или кэш пуст. Загрузка с URL...");
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
                                console.log("SpicyChat Logic Core: Словарь успешно загружен с URL и сохранен в кэш.");
                             } catch (parseError) {
                                console.error("SpicyChat Logic Core: Не удалось разобрать JSON словаря:", parseError);
                                if (dictionaryFromCache) {
                                    console.warn("SpicyChat Logic Core: Используется словарь из кэша из-за ошибки разбора JSON.");
                                    componentDictionary = dictionaryFromCache;
                                } else {
                                    console.error("SpicyChat Logic Core: Кэш пуст, разбор JSON не удался. Маркировка не будет работать.");
                                    componentDictionary = {};
                                }
                             }
                        } else {
                             console.error(`SpicyChat Logic Core: Не удалось загрузить словарь с URL. Статус: ${response.status}`);
                             if (dictionaryFromCache) {
                                console.warn("SpicyChat Logic Core: Используется словарь из кэша из-за ошибки загрузки.");
                                componentDictionary = dictionaryFromCache;
                             } else {
                                console.error("SpicyChat Logic Core: Кэш пуст, загрузка не удалась. Маркировка не будет работать.");
                                componentDictionary = {};
                             }
                        }
                        callback();
                    },
                    onerror: function(error) {
                        console.error("SpicyChat Logic Core: Сетевая ошибка при загрузке словаря:", error);
                        if (dictionaryFromCache) {
                            console.warn("SpicyChat Logic Core: Используется словарь из кэша из-за сетевой ошибки.");
                            componentDictionary = dictionaryFromCache;
                        } else {
                            console.error("SpicyChat Logic Core: Кэш пуст, сетевая ошибка. Маркировка не будет работать.");
                            componentDictionary = {};
                        }
                        callback();
                    },
                    ontimeout: function() {
                        console.error("SpicyChat Logic Core: Таймаут при загрузке словаря.");
                        if (dictionaryFromCache) {
                            console.warn("SpicyChat Logic Core: Используется словарь из кэша из-за таймаута.");
                            componentDictionary = dictionaryFromCache;
                        } else {
                            console.error("SpicyChat Logic Core: Кэш пуст, таймаут. Маркировка не будет работать.");
                            componentDictionary = {};
                        }
                        callback();
                    },
                    timeout: 15000
                 });

            } catch (error) {
                console.error("SpicyChat Logic Core: Исключение при попытке загрузить словарь:", error);
                if (dictionaryFromCache) {
                    console.warn("SpicyChat Logic Core: Используется словарь из кэша из-за исключения.");
                    componentDictionary = dictionaryFromCache;
                } else {
                    console.error("SpicyChat Logic Core: Кэш пуст, исключение. Маркировка не будет работать.");
                    componentDictionary = {};
                }
                callback();
            }
        } else {
            console.log("SpicyChat Logic Core: Словарь загружен из кэша.");
            componentDictionary = dictionaryFromCache;
            callback();
        }
    }

    let attempts = 0;
    const MAX_ATTEMPTS = 30;
    function tryInitialize() {
        console.log("SpicyChat Logic Core: Попытка инициализации ядра...");
        attempts++;
        const scrollContainerSelector = 'div.grow.flex.flex-col.w-full.left-0.items-center.absolute.h-full.overflow-auto';
        let scrollContainer = null;
        try {
            scrollContainer = document.querySelector(scrollContainerSelector);
        } catch(e) {
             console.error("SpicyChat Logic Core: Ошибка при поиске scrollContainer", e);
        }


        if (!scrollContainer) {
          if (attempts < MAX_ATTEMPTS) {
            console.warn(`Logic Core: Критический элемент (scrollContainer) не найден. Попытка ${attempts}/${MAX_ATTEMPTS} через 500мс.`);
            setTimeout(tryInitialize, 500);
          } else {
            console.error("Логика SpicyChat Core: Не найден критичный DOM элемент (scrollContainer), прекращаем попытки инициализации MutationObserver.");
          }
          return;
        }

        console.log("SpicyChat Logic Core: Критический DOM элемент (scrollContainer) найден.");

        if (Object.keys(componentDictionary).length === 0) {
            console.warn("SpicyChat Logic Core: Словарь компонентов пуст. Первоначальная маркировка и наблюдение не будут выполнены.");
        } else {
            console.log("SpicyChat Logic Core: Выполнение первоначальной маркировки...");
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
                    console.error(`SpicyChat Logic Core: Ошибка при поиске селектора в начальной маркировке: "${selector}"`, e);
                }
              } else if (typeof config !== 'object' || config === null) {
                 console.warn(`SpicyChat Logic Core: Некорректная запись для селектора "${selector}" в словаре (ожидался объект).`);
              } else if (!label) {
                 console.warn(`SpicyChat Logic Core: Отсутствует 'label' для селектора "${selector}" в словаре.`);
              }
            }
            console.log(`SpicyChat Logic Core: Первоначальная маркировка завершена (помечено ~${markedCount} элементов).`);

            const observer = new MutationObserver(mutations => {
              let mutationMarkedCount = 0;
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
                                   mutationMarkedCount++;
                               }
                             }
                             if (node.querySelectorAll) {
                                 const descendants = node.querySelectorAll(selector);
                                 descendants.forEach(el => {
                                   if (!el.dataset.uiComponent) {
                                       markElement(el, label);
                                       mutationMarkedCount++;
                                   }
                                 });
                             }
                           } catch (e) {
                               if (!window.invalidSelectorsLogged) { window.invalidSelectorsLogged = new Set(); }
                               if (!window.invalidSelectorsLogged.has(selector)) {
                                   console.error(`SpicyChat Logic Core: Ошибка при проверке селектора в MutationObserver: "${selector}"`, e);
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

            observer.observe(scrollContainer, { childList: true, subtree: true });
            console.log("SpicyChat Logic Core: Наблюдение за изменениями в scrollContainer активировано.");
        }

        console.log("SpicyChat Logic Core: Инициализация ядра завершена.");
      }

    checkForUpdates();
    GM_addStyle(logoCssStyles);
    console.log("SpicyChat Logic Core: Стили логотипа добавлены.");

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createLogoElement, { once: true });
    } else {
        createLogoElement();
    }
    console.log("SpicyChat Logic Core: Создание логотипа запланировано/выполнено.");

    console.log("SpicyChat Logic Core: Запуск загрузки словаря...");
    loadDictionary(tryInitialize);
    console.log("SpicyChat Logic Core: Вызов loadDictionary инициирован (асинхронно).");

})();
