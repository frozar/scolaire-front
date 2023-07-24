import "leaflet/dist/leaflet.css";

import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import Point from "./Point";

describe("Checkbox component", () => {
  it("Etablissement Point", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <Point
          map={initialiseMap("map-container", false)}
          idPoint={1}
          onIsLast={() => console.log("ok")}
          lat={-20.9466588303741}
          lon={55.5343806753509}
          isLast={false}
          onClick={() => console.log("onClick")}
          borderColor="green"
          fillColor="white"
          onDBLClick={() => console.log("onDBLClick")}
          onMouseOut={() => console.log("onMouseOut")}
          onMouseOver={() => console.log("onMouseOver")}
          radius={12}
          weight={4}
          isBlinking={false}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("point-1", 0.01);
  });

  it("Ramassage Point", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <Point
          map={initialiseMap("map-container", false)}
          idPoint={1}
          onIsLast={() => console.log("onIsLast")}
          lat={-20.9466588303742}
          lon={55.5343806753508}
          isLast={false}
          onClick={() => console.log("onClick")}
          borderColor="red"
          fillColor="gray"
          onDBLClick={() => console.log("onDBLClick")}
          onMouseOut={() => console.log("onMouseOut")}
          onMouseOver={() => console.log("onMouseOver")}
          radius={9}
          weight={5}
          isBlinking={false}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("point-2", 0.01);
  });

  it("Check blinking and onIsLast", () => {
    const onIsLastSpied = cy
      .spy(() => console.log("onIsLast"))
      .as("onIsLastListener");

    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <Point
          map={initialiseMap("map-container", false)}
          idPoint={1}
          onIsLast={onIsLastSpied}
          lat={-20.9466588303749}
          lon={55.5343806753501}
          isLast={true}
          onClick={() => console.log("onClick")}
          borderColor="green"
          fillColor="white"
          onDBLClick={() => console.log("onDBLClick")}
          onMouseOut={() => console.log("onMouseOut")}
          onMouseOver={() => console.log("onMouseOver")}
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
