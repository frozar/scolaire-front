import L from "leaflet";
import { layerTilesList } from "../../constant";
import Point from "./Point.mapWrapper.story";

describe("Checkbox component", () => {
  const retryOptions = {
    limit: 5, // max number of retries
    delay: 500, // delay before next iteration, ms
  };

  beforeEach(() => {
    cy.viewport(1000, 1000);
  });

  // TODO: replace with initMap
  const buildMap = (idDiv: string) => {
    const map = L.map(idDiv).setView([-20.9466588303741, 55.5343806753509], 15);
    layerTilesList[0].tileContent.addTo(map);
    return map;
  };

  it("Etablissement Point", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <Point
          map={buildMap("map-container")}
          radius={12}
          weight={4}
          borderColor="green"
          fillColor="white"
          isBlinking={false}
        />
      </div>
    ));

    cy.wait(1000);
    cy.get("#map-container").compareSnapshot("school", 0.01, retryOptions);
  });

  it("Ramassage Point", () => {
    cy.mount(() => (
      <Point
        radius={8}
        weight={4}
        borderColor="red"
        fillColor="white"
        isBlinking={false}
      />
    ));

    cy.wait(1000);
    cy.get("#map-container").compareSnapshot("stop", 0.01, retryOptions);
  });

  it("Check blinking", () => {
    cy.mount(() => (
      <Point
        radius={12}
        weight={4}
        borderColor="green"
        fillColor="white"
        isBlinking={true}
      />
    ));

    cy.get(".map-point").should("have.class", "circle-animation-green");
  });
});
