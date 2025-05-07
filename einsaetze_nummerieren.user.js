// ==UserScript==
// @name         Einsatznummerierung im MissionPanel
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Zeigt laufende Einsatznummern im MissionPanel.
// @author       pesooo
// @match        *://rettungssimulator.online/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const einsatzSelector = '.mission-list-mission[usermissionid]';

    function isVerbandseinsatz(einsatz) {
        // Alle Einsätze unterhalb von #sharedMissions sind Verbandseinsätze
        return einsatz.closest('#sharedMissions') !== null;
    }

    function nummeriereMissionen() {
        const einsaetze = document.querySelectorAll(einsatzSelector);
        let eigene = 1;
        let verband = 1;

        einsaetze.forEach((einsatz) => {
            let nummer = einsatz.querySelector('.einsatzNummer');
            if (!nummer) {
                nummer = document.createElement('div');
                nummer.className = 'einsatzNummer';
                nummer.style.position = 'absolute';
                nummer.style.bottom = '10px';
                nummer.style.right = '30px';
                nummer.style.fontWeight = 'bold';
                nummer.style.fontSize = '1.1em';
                nummer.style.color = '#FFD700';
                einsatz.style.position = 'relative';
                einsatz.appendChild(nummer);
            }

            if (isVerbandseinsatz(einsatz)) {
                nummer.textContent = `V${verband++}`;
            } else {
                nummer.textContent = `${eigene++}`;
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
