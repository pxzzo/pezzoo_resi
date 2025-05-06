// ==UserScript==
// @name         Einsatznummer im MissionPanel
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Zeigt die laufende Einsatznummer unten rechts im Einsatzkasten an (class=mission-list-mission), mit automatischer Nachnummerierung bei neuen Einsätzen im Mission-Panel.
// @author       pesooo
// @match        *://rettungssimulator.online/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const einsatzSelector = '.mission-list-mission[usermissionid]';

    function nummeriereMissionen() {
        const einsaetze = document.querySelectorAll(einsatzSelector);
        einsaetze.forEach((einsatz, index) => {
            let nummer = einsatz.querySelector('.einsatzNummer');
            if (!nummer) {
                nummer = document.createElement('div');
                nummer.className = 'einsatzNummer';
                nummer.style.position = 'absolute';
                nummer.style.bottom = '4px';
                nummer.style.right = '6px';
                nummer.style.fontWeight = 'bold';
                nummer.style.fontSize = '1.1em';
                nummer.style.color = '#FFD700';
                einsatz.style.position = 'relative';
                einsatz.appendChild(nummer);
            }
            nummer.textContent = (index + 1).toString();
        });
    }

    // Debounce-Funktion: führt eine Funktion verzögert aus und verhindert Mehrfachausführung
    function debounce(func, delay) {
        let timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(func, delay);
        };
    }

    function initObserver() {
        const missionsContainer = document.querySelector('#missions');
        if (!missionsContainer) {
            setTimeout(initObserver, 1000);
            return;
        }

        nummeriereMissionen();

        const observer = new MutationObserver(debounce(() => {
            nummeriereMissionen();
        }, 300)); // nur max. 1x alle 300ms ausführen

        observer.observe(missionsContainer, {
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

