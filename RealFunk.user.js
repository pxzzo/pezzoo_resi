// ==UserScript==
// @name         RealFunk
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Deine Fahrzeuge werden nun mit dir kommunizieren!
// @author       dorpeso
// @match        https://rettungssimulator.online/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rettungssimulator.online
// @grant        none
// ==/UserScript==
const apiKey = "YOUR_API_KEY";

let timeOut = 0;

socket.on("vehicleFMS", (vehicleFMSObject) => {
  if (timeOut === 1) {
    console.log("Wird bereits ausgeführt, warte auf Beendigung.");
    return;
  } else {
    doThis(vehicleFMSObject);
  }
});

function doThis(vehicleFMSObject) {
  let timeOut = 1;
  console.log(`
      ${vehicleFMSObject.userVehicleName}
      changed Status to ${vehicleFMSObject.userVehicleFMS}
      (ID: ${vehicleFMSObject.userVehicleID})
      and DepartmentID
   `);
  const departmentID = vehicleFMSObject.userDepartmentID;
  $.ajax({
    url: "/api/userBuildings",
    dataType: "json",
    type: "GET",
  }).then((department) => {
    function findBuildingByID(dpID) {
      return department.find((building) => building.userBuildingID === dpID);
    }

    const foundBuilding = findBuildingByID(departmentID);

    if (foundBuilding) {
      console.log("Found building:", foundBuilding);
      new Audio(
        `http://api.voicerss.org/?key=${apiKey}&hl=de-de&v=Lina&f=16khz_16bit_stereo&src=${foundBuilding.userBuildingName}%20für%20${vehicleFMSObject.userVehicleName}!`
      ).play();
      setTimeout(() => {
        new Audio(
          `http://api.voicerss.org/?key=${apiKey}&hl=de-de&v=Jonas&f=16khz_16bit_stereo&src=${foundBuilding.userBuildingName} hört!`
        ).play();
      }, 6000);
      setTimeout(() => {
        new Audio(
          `http://api.voicerss.org/?key=${apiKey}&hl=de-de&v=Lina&f=16khz_16bit_stereo&src=Wir gehen in den Status ${vehicleFMSObject.userVehicleFMS}!`
        ).play();
        return (timeOut = 0);
      }, 10000);
    } else {
      console.log("Building not found.");
      return;
    }
  });
}
