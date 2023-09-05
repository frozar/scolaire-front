import "leaflet/dist/leaflet.css";

import { createPoint } from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import { NatureEnum } from "../../../../../type";
import Point from "./Point";

function voidFunction() {
  return;
}

describe("Point component", () => {
  it("Point", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <Point
          point={createPoint({
            id: 1,
            leafletId: 1,
            lat: -20.9466588303741,
            lon: 55.5343806753509,
            name: "name",
            nature: NatureEnum.stop,
          })}
          map={initialiseMap("map-container", false)}
          onClick={voidFunction}
          borderColor="green"
          fillColor="white"
          onMouseOut={voidFunction}
          onMouseOver={voidFunction}
          onMouseUp={voidFunction}
          radius={12}
          weight={4}
          isBlinking={false}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("point-1", 0.01);
  });

  it("Point with different color and check onIsLast", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <Point
          map={initialiseMap("map-container", false)}
          point={createPoint({
            id: 1,
            leafletId: 1,
            lat: -20.9466588303742,
            lon: 55.5343806753508,
            name: "name",
            nature: NatureEnum.stop,
          })}
          onClick={() => console.log("onClick")}
          borderColor="red"
          fillColor="gray"
          onMouseOut={voidFunction}
          onMouseOver={voidFunction}
          onMouseUp={voidFunction}
          radius={9}
          weight={5}
          isBlinking={false}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("point-2", 0.01);
  });

  it("Check blinking and onIsLast", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <Point
          point={createPoint({
            id: 1,
            leafletId: 1,
            lat: -20.9466588303742,
            lon: 55.5343806753508,
            name: "name",
            nature: NatureEnum.stop,
          })}
          map={initialiseMap("map-container", false)}
          onClick={voidFunction}
          borderColor="green"
          fillColor="white"
          onMouseOut={voidFunction}
          onMouseOver={voidFunction}
          onMouseUp={voidFunction}
          radius={12}
          weight={4}
          isBlinking={true}
        />
      </div>
    ));

    cy.get(".map-point").should("have.class", "circle-animation");
  });
});
