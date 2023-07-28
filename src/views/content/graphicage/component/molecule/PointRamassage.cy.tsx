import "leaflet/dist/leaflet.css";
import { createPoint } from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import PointRamassage from "./PointRamassage";

function voidFunction() {
  return;
}

describe("StopPoint component", () => {
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
            quantity: 5,
          })}
          map={initialiseMap("map-container", false)}
          isLast={false}
          quantity={6}
          minQuantity={3}
          maxQuantity={25}
          onIsLast={voidFunction}
          onClick={voidFunction}
          onDBLClick={voidFunction}
          onMouseOut={voidFunction}
          onMouseOver={voidFunction}
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
            quantity: 5,
          })}
          map={initialiseMap("map-container", false)}
          isLast={false}
          quantity={45}
          minQuantity={1}
          maxQuantity={50}
          onIsLast={voidFunction}
          onClick={voidFunction}
          onDBLClick={voidFunction}
          onMouseOut={voidFunction}
          onMouseOver={voidFunction}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("stopPoint-2", 0.01);
  });
});
