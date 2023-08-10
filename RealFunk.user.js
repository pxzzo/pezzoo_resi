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
        new Audio(`http://api.voicerss.org/?key=bb4962bbfef84781841b9824d5ad6137&hl=de-de&v=Lina&f=16khz_16bit_stereo&src=${department[0].userBuildingName}%20für%20${vehicleFMSObject.userVehicleName}!`).play()
        setTimeout(() => {
            new Audio(`http://api.voicerss.org/?key=bb4962bbfef84781841b9824d5ad6137&hl=de-de&v=Jonas&f=16khz_16bit_stereo&src=${department[0].userBuildingName} hört!`).play()
        }, 8000)
        setTimeout(() => {
            new Audio(`http://api.voicerss.org/?key=bb4962bbfef84781841b9824d5ad6137&hl=de-de&v=Lina&f=16khz_16bit_stereo&src=Wir gehen in den Status ${vehicleFMSObject.userVehicleFMS}!`).play()
        }, 13000)
    })

    //Change Status in department List
});
