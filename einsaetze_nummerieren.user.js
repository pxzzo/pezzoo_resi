// ==UserScript==
// @name         Einsatznummerierung im MissionPanel
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Zeigt laufende Einsatznummern im MissionPanel
// @author       pesooo
// @match        *://rettungssimulator.online/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==


(function () {
    'use strict';

    const einsatzSelector = '.mission-list-mission[usermissionid]';

    function isVerbandseinsatz(einsatz) {
        return einsatz.closest('#sharedMissions') !== null;
    }

    function nummeriereMissionen() {
        const einsaetze = document.querySelectorAll(einsatzSelector);
        let eigene = 1;
        let verband = 1;

        einsaetze.forEach((einsatz) => {
            einsatz.style.position = 'relative';

            // Einsatznummer
            let nummer = einsatz.querySelector('.einsatzNummer');
            if (!nummer) {
                nummer = document.createElement('div');
                nummer.className = 'einsatzNummer';
                nummer.style.position = 'relative';
                nummer.style.left = '12px';
                nummer.style.bottom = '6px';
                nummer.style.fontWeight = 'bold';
                nummer.style.fontSize = '1.1em';
                nummer.style.color = '#FFA500';
                einsatz.appendChild(nummer);
            }
            nummer.textContent = isVerbandseinsatz(einsatz) ? `V${verband++}` : `${eigene++}`;

            // Fortschrittsbalken sauber positionieren
            const balken = einsatz.querySelector('.mission-list-progress');
            if (balken) {
                balken.style.position = 'absolute';
                balken.style.left = '0';
                balken.style.right = '0';
                balken.style.bottom = '0'; // ganz unten
                balken.style.height = '6px';
                balken.style.zIndex = '0';
            }
        });
    }

    function debounce(func, delay) {
        let timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(func, delay);
        };
    }

    function initObserver() {
        const container = document.querySelector('#missions') || document.body;
        nummeriereMissionen();

        const observer = new MutationObserver(debounce(() => {
            nummeriereMissionen();
        }, 300));

        observer.observe(container, {
            childList: true,
            subtree: true,
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initObserver);
    } else {
        initObserver();
    }
})();
