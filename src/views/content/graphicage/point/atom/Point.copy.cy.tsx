import "leaflet/dist/leaflet.css";
import { initialiseMap } from "../../../../../../.storybook/utils/mapWrapper";
import Point from "./Point";

describe("Checkbox component", () => {
  const retryOptions = {
    limit: 5, // max number of retries
    delay: 500, // delay before next iteration, ms
  };

  beforeEach(() => {
    cy.viewport(1000, 1000);
  });

  it("Etablissement Point", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <Point
          map={initialiseMap("map-container")}
          idPoint={1}
          onIsLast={() => console.log("ok")}
          lat={-20.9466588303741}
          lon={55.5343806753509}
          onClick={() => console.log("onClick")}
          borderColor="green"
          fillColor="white"
          isLast={false}
          onDBLClick={() => console.log("onDBLClick")}
          onMouseOut={() => console.log("onMouseOut")}
          onMouseOver={() => console.log("onMouseOver")}
          radius={12}
          weight={4}
          isBlinking={false}
        />
      </div>
    ));

    cy.wait(1000);
    cy.get("#map-container").compareSnapshot("school", 0.01, retryOptions);
  });

  it("Ramassage Point", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <Point
          map={initialiseMap("map-container")}
          idPoint={1}
          onIsLast={() => console.log("ok")}
          lat={-20.9466588303741}
          lon={55.5343806753509}
          onClick={() => console.log("onClick")}
          borderColor="red"
          fillColor="white"
          isLast={false}
          onDBLClick={() => console.log("onDBLClick")}
          onMouseOut={() => console.log("onMouseOut")}
          onMouseOver={() => console.log("onMouseOver")}
          radius={8}
          weight={4}
          isBlinking={false}
        />
      </div>
    ));

    cy.wait(1000);
    cy.get("#map-container").compareSnapshot("stop", 0.01, retryOptions);
  });

  it("Check blinking", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <Point
          map={initialiseMap("map-container")}
          idPoint={1}
          onIsLast={() => console.log("ok")}
          lat={-20.9466588303741}
          lon={55.5343806753509}
          onClick={() => console.log("onClick")}
          borderColor="green"
          fillColor="white"
          isLast={false}
          onDBLClick={() => console.log("onDBLClick")}
          onMouseOut={() => console.log("onMouseOut")}
          onMouseOver={() => console.log("onMouseOver")}
          radius={12}
          weight={4}
          isBlinking={true}
        />
      </div>
    ));

    cy.get(".map-point").should("have.class", "circle-animation-green");
  });
});
