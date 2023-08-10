// ==UserScript==
// @name         RealFunk
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Deine Fahrzeuge werden nun mit dir kommunizieren!
// @author       dorpeso
// @match        https://rettungssimulator.online/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rettungssimulator.online
// @grant        none
// ==/UserScript==

socket.on("vehicleFMS", (vehicleFMSObject) =>{

 createRadioMessage(vehicleFMSObject);
 console.log(`
    ${vehicleFMSObject.userVehicleName}
    changed Status to ${vehicleFMSObject.userVehicleFMS}
    (ID: ${vehicleFMSObject.userVehicleID})
 `);
    $.ajax({
        url: "/api/userBuildings",
        dataType: "json",
        type : "GET",
        id : vehicleFMSObject.userDepartmentID,
    }).then((department) => {
    new Audio(`http://api.voicerss.org/?key=bb4962bbfef84781841b9824d5ad6137&hl=de-de&v=Lina&f=16khz_16bit_stereo&src=${department[0].userBuildingName}%20für%20${vehicleFMSObject.userVehicleName},%20wir%20gehen%20in%20den%20Status%20${vehicleFMSObject.userVehicleFMS}`).play()
    });

 //Change Status in department List
});