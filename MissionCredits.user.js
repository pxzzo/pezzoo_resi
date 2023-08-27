// ==UserScript==
// @name         MissionCredits
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows the Credits you will get from the mission.
// @author       pezzoo
// @match        *://rettungssimulator.online/mission/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rettungssimulator.online
// @grant        none
// ==/UserScript==

var mission = document.querySelector (
    "body > div > div.detail-header > div.detail-title"
);

var missionid = mission.getAttribute('missionid')
var userMissionId = mission.getAttribute('usermissionid')

$.ajax({
    url: "/api/missions",
    dataType: "json",
    type : "GET",
    data: {
        "id": missionid
    },
    success : function(r) {
        var credits = r.credits
        if (parent.ControlCenter.missions[userMissionId].isShared) credits = credits*0.8
        $('#s5').after(`<span class='label label-info label-round'> Credits: ${credits}`)
    }
});
