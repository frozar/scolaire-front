import "leaflet/dist/leaflet.css";

import { createPoint } from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import Point from "./Point";

function voidFunction() {
  return;
}

describe("Point component", () => {
  it("Point", () => {
    const onIsLastSpied = cy
      .spy(() => console.log("onIsLast"))
      .as("onIsLastListener");

    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <Point
          point={createPoint({
            id: 1,
            idPoint: 1,
            lat: -20.9466588303741,
            lon: 55.5343806753509,
            name: "name",
            quantity: 5,
          })}
          map={initialiseMap("map-container", false)}
          onIsLast={onIsLastSpied}
          isLast={false}
          onClick={voidFunction}
          borderColor="green"
          fillColor="white"
          onDBLClick={voidFunction}
          onMouseOut={voidFunction}
          onMouseOver={voidFunction}
          radius={12}
          weight={4}
          isBlinking={false}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("point-1", 0.01);
    cy.get("@onIsLastListener").should("not.have.been.called");
  });

  it("Point with different color and check onIsLast", () => {
    const onIsLastSpied = cy
      .spy(() => console.log("onIsLast"))
      .as("onIsLastListener");

    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <Point
          map={initialiseMap("map-container", false)}
          point={createPoint({
            id: 1,
            idPoint: 1,
            lat: -20.9466588303742,
            lon: 55.5343806753508,
            name: "name",
            quantity: 5,
          })}
          onIsLast={onIsLastSpied}
          isLast={false}
          onClick={() => console.log("onClick")}
          borderColor="red"
          fillColor="gray"
          onDBLClick={voidFunction}
          onMouseOut={voidFunction}
          onMouseOver={voidFunction}
          radius={9}
          weight={5}
          isBlinking={false}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("point-2", 0.01);
    cy.get("@onIsLastListener").should("not.have.been.called");
  });

  it("Check blinking and onIsLast", () => {
    const onIsLastSpied = cy
      .spy(() => console.log("onIsLast"))
      .as("onIsLastListener");

    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <Point
          point={createPoint({
            id: 1,
            idPoint: 1,
            lat: -20.9466588303742,
            lon: 55.5343806753508,
            name: "name",
            quantity: 5,
          })}
          map={initialiseMap("map-container", false)}
          onIsLast={onIsLastSpied}
          isLast={true}
          onClick={voidFunction}
          borderColor="green"
          fillColor="white"
          onDBLClick={voidFunction}
          onMouseOut={voidFunction}
          onMouseOver={voidFunction}
          radius={12}
          weight={4}
          isBlinking={true}
        />
      </div>
    ));

    cy.get(".map-point").should("have.class", "circle-animation");
    cy.get("@onIsLastListener").should("have.been.calledOnce");
  });
});
