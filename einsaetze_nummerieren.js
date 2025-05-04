// ==UserScript==
// @name         Einsatznummer im MissionPanel
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Zeigt die laufende Einsatznummer unten rechts im Einsatzkasten an (class=mission-list-mission), mit automatischer Nachnummerierung bei neuen Einsätzen im Mission-Panel.
// @author       pesooo
// @match        *://rettungssimulator.online/*
// @grant        none
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
                einsatz.style.position = 'relative'; // für absolute Positionierung wichtig
                einsatz.appendChild(nummer);
            }
            nummer.textContent = (index + 1).toString();
        });
    }

    window.addEventListener('load', () => {
        setTimeout(nummeriereMissionen, 1000); // Initial warten

        const missionsContainer = document.querySelector('#missions');
        if (!missionsContainer) return;

        const observer = new MutationObserver(() => {
            nummeriereMissionen();
        });

        observer.observe(missionsContainer, {
            childList: true,
            subtree: true,
        });
    });
})();
