// ==UserScript==
// @name         ETA-Countdown
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Zeigt Countdown bis zur Ankunft basierend auf der ETA zum Alarmierungszeitpunkt
// @author       pesooo
// @match        *://rettungssimulator.online/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const GESCHWINDIGKEIT_KMH = 71.15;
    const UPDATE_INTERVAL_MS = 1000;
    const STORAGE_KEY = 'pesoooETAStore';

    function saveETAsToStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(window.pesoooETAs));
    }

    function loadETAsFromStorage() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    }

    function cleanupOldETAs() {
        const now = Math.floor(Date.now() / 1000);
        let changed = false;

        for (const [id, timestamp] of Object.entries(window.pesoooETAs)) {
            if (timestamp < now - 10) {
                delete window.pesoooETAs[id];
                changed = true;
            }
        }

        if (changed) saveETAsToStorage();
    }

    window.pesoooETAs = loadETAsFromStorage();

    function berechneETA(distKm) {
        const sekunden = (distKm / GESCHWINDIGKEIT_KMH) * 3600;
        return Math.floor(Date.now() / 1000 + sekunden);
    }

    function formatCountdown(zielTimestamp) {
        const now = Math.floor(Date.now() / 1000);
        const diff = zielTimestamp - now;
        if (diff <= 0) return '00:00';
        const min = String(Math.floor(diff / 60)).padStart(2, '0');
        const sec = String(diff % 60).padStart(2, '0');
        return `${min}:${sec}`;
    }

    function formatCountdown1(zielTimestamp, time) {
        const diff = zielTimestamp - time;
        if (diff <= 0) return '00:00';
        const min = String(Math.floor(diff / 60)).padStart(2, '0');
        const sec = String(diff % 60).padStart(2, '0');
        return `${min}:${sec}`;
    }

    function erweitereAlarmierungsfenster() {
        const fahrzeuge = document.querySelectorAll('.mission-vehicles .vehicle');
        fahrzeuge.forEach(fz => {
            const distEl = fz.querySelector('.vehicle-distance');
            if (!distEl || distEl.textContent.includes('⏱')) return;
            const match = distEl.textContent.match(/~([\d.,]+)\s*km/);
            if (match) {
                const dist = parseFloat(match[1].replace(',', '.'));
                const etaTimestamp = berechneETA(dist);
                const id = fz.getAttribute('vehicleid') || fz.getAttribute('uservehicleid') || fz.dataset.vehicleid;
                if (id) {
                    window.pesoooETAs[id] = etaTimestamp;
                    saveETAsToStorage();
                }
                const countdown = formatCountdown(etaTimestamp);
                distEl.textContent += ` ⏱ ${countdown}`;
            }
        });
    }

    function erweitereAufAnfahrtBereich() {
        const zeilen = document.querySelectorAll('.card.enroute tr[uservehicleid]');
        const now = Math.floor(Date.now() / 1000);

        zeilen.forEach(tr => {
            const id = tr.getAttribute('uservehicleid');
            const eta = window.pesoooETAs[id];
            if (!id || !eta) return;

            const zielzelle = tr.querySelector('td:nth-child(2)');
            if (!zielzelle) return;

            let etaSpan = zielzelle.querySelector('.eta-display');
            if (!etaSpan) {
                etaSpan = document.createElement('span');
                etaSpan.className = 'eta-display';
                etaSpan.style.marginLeft = '10px';
                etaSpan.style.color = 'orange';
                zielzelle.appendChild(etaSpan);
            }

            etaSpan.textContent = `⏱ ${formatCountdown1(eta, now)}`;
        });
    }

    function startLiveUpdate() {
        setInterval(() => {
            cleanupOldETAs();
            erweitereAufAnfahrtBereich();
        }, UPDATE_INTERVAL_MS);
    }

    const observer = new MutationObserver(() => {
        erweitereAlarmierungsfenster();
        erweitereAufAnfahrtBereich();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    window.addEventListener('load', () => {
        setTimeout(() => {
            erweitereAlarmierungsfenster();
            erweitereAufAnfahrtBereich();
            startLiveUpdate();
        }, 1000);
    });
})();
