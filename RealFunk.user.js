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

socket.on("vehicleFMS", (vehicleFMSObject) => {
  createRadioMessage(vehicleFMSObject);
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
    const foundBuilding = department.find(
      (building) => building.userBuildingID === findBuildingByID(departmentID)
    );

    if (foundBuilding) {
      console.log("Found building:", foundBuilding);
      new Audio(
        `http://api.voicerss.org/?key=${apiKey}&hl=de-de&v=Lina&f=16khz_16bit_stereo&src=${foundBuilding.userBuildingName}%20für%20${vehicleFMSObject.userVehicleName}!`
      ).play();
      setTimeout(() => {
        new Audio(
          `http://api.voicerss.org/?key=${apiKey}&hl=de-de&v=Jonas&f=16khz_16bit_stereo&src=${foundBuilding.userBuildingName} hört!`
        ).play();
      }, 8000);
      setTimeout(() => {
        new Audio(
          `http://api.voicerss.org/?key=${apiKey}&hl=de-de&v=Lina&f=16khz_16bit_stereo&src=Wir gehen in den Status ${vehicleFMSObject.userVehicleFMS}!`
        ).play();
      }, 13000);
    } else {
      console.log("Building not found.");
      return;
    }
  });
});
