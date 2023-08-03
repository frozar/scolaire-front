import "leaflet/dist/leaflet.css";
import { createPoint } from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import PointRamassage from "./PointRamassage";

describe("StopPoint component", () => {
  function onDBLClick() {
    console.log("onDBLClick");
  }
  it("StopPoint snapshot", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <PointRamassage
          point={createPoint({
            id: 1,
            idPoint: 1,
            lat: -20.9466588303741,
            lon: 55.5343806753509,
            name: "name",
            quantity: 4,
          })}
          onDBLClick={onDBLClick}
          map={initialiseMap("map-container", false)}
          minQuantity={3}
          maxQuantity={25}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("stopPoint", 0.01);
  });

  it("StopPoint snapshot 2", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <PointRamassage
          point={createPoint({
            id: 1,
            idPoint: 1,
            lat: -20.9466588303741,
            lon: 55.5343806753509,
            name: "name",
            quantity: 48,
          })}
          onDBLClick={onDBLClick}
          map={initialiseMap("map-container", false)}
          minQuantity={1}
          maxQuantity={50}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("stopPoint-2", 0.01);
  });
});
