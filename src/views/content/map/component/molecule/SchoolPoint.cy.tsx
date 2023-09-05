import "leaflet/dist/leaflet.css";
import { createPoint } from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import { NatureEnum } from "../../../../../type";
import { SchoolPoint } from "./SchoolPoint";

describe("Checkbox component", () => {
  it("Etablissement Point snapshot", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <SchoolPoint
          point={createPoint({
            id: 1,
            leafletId: 1,
            lat: -20.9466588303741,
            lon: 55.5343806753509,
            name: "name",
            nature: NatureEnum.school,
          })}
          map={initialiseMap("map-container", false)}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("schoolPoint", 0.01);
  });

  it("School Point - display not depende of quantity", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <SchoolPoint
          point={createPoint(
            {
              id: 1,
              leafletId: 1,
              lat: -20.9466588303741,
              lon: 55.5343806753509,
              name: "name",
              nature: NatureEnum.school,
            },
            4
          )}
          map={initialiseMap("map-container", false)}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("schoolPoint", 0.01);
  });
});
