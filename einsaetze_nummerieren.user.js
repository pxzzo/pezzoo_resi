// ==UserScript==
// @name         Einsatznummerierung im MissionPanel (Tabs-Menü korrekt platziert)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Zeigt Einsatznummern im MissionPanel.
// @author       pesooo
// @match        *://rettungssimulator.online/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const einsatzSelector = '.mission-list-mission[usermissionid]';
    const einstellungsKey = 'einsatznummer_position_seite';

    let seite = localStorage.getItem(einstellungsKey) || 'left';

    function isVerbandseinsatz(einsatz) {
        return einsatz.closest('#sharedMissions') !== null;
    }

    function nummeriereMissionen() {
        const einsaetze = document.querySelectorAll(einsatzSelector);
        let eigene = 1;
        let verband = 1;

        einsaetze.forEach((einsatz) => {
            einsatz.style.position = 'relative';

            let nummer = einsatz.querySelector('.einsatzNummer');
            if (!nummer) {
                nummer = document.createElement('div');
                nummer.className = 'einsatzNummer';
                nummer.style.position = 'absolute';
                nummer.style.fontWeight = 'bold';
                nummer.style.fontSize = '1.1em';
                nummer.style.color = '#FFA500';
                einsatz.appendChild(nummer);
            }

            nummer.style.bottom = '6px';
            nummer.style.left = seite === 'left' ? '5px' : '';
            nummer.style.right = seite === 'right' ? '30px' : '';

            nummer.textContent = isVerbandseinsatz(einsatz) ? `V${verband++}` : `${eigene++}`;
        });
    }

    function erstelleEinstellungsmenü() {
        const tabsContainer = document.querySelector('#missions .panel-headline .tabs.tabs-horizotal') ||
                              document.querySelector('#missions .panel-headline .tabs.tabs-horizontal');
        if (!tabsContainer) return;

        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.style.marginLeft = '10px';

        const button = document.createElement('button');
        button.textContent = '⚙️';
        button.title = 'Einsatznummern-Position';
        button.style.background = '#444';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.padding = '4px 8px';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';

        const menü = document.createElement('div');
        menü.style.position = 'absolute';
        menü.style.top = '36px';
        menü.style.left = '0';
        menü.style.background = '#222';
        menü.style.color = '#fff';
        menü.style.padding = '8px';
        menü.style.borderRadius = '6px';
        menü.style.boxShadow = '0 0 6px rgba(0,0,0,0.4)';
        menü.style.display = 'none';
        menü.style.zIndex = '10000';
        menü.style.minWidth = '120px';

        const label = document.createElement('div');
        label.textContent = 'Nummernposition:';
        label.style.marginBottom = '6px';
        menü.appendChild(label);

        ['left', 'right'].forEach(opt => {
            const option = document.createElement('div');
            option.textContent = opt === 'left' ? 'Links' : 'Rechts';
            option.style.padding = '4px 6px';
            option.style.cursor = 'pointer';
            option.style.borderRadius = '4px';
            option.style.background = seite === opt ? '#666' : '#333';
            option.addEventListener('click', () => {
                seite = opt;
                localStorage.setItem(einstellungsKey, seite);
                nummeriereMissionen();
                [...menü.querySelectorAll('div')].forEach(div => {
                    if (div.textContent === 'Links' || div.textContent === 'Rechts') {
                        div.style.background = div.textContent === (opt === 'left' ? 'Links' : 'Rechts') ? '#666' : '#333';
                    }
                });
            });
            menü.appendChild(option);
        });

        button.addEventListener('click', () => {
            menü.style.display = menü.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                menü.style.display = 'none';
            }
        });

        wrapper.appendChild(button);
        wrapper.appendChild(menü);
        tabsContainer.appendChild(wrapper);
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
        observer.observe(container, { childList: true, subtree: true });
    }

    function init() {
        initObserver();
        erstelleEinstellungsmenü();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
