import "leaflet/dist/leaflet.css";
import { createPoint } from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import { NatureEnum } from "../../../../../type";
import {StopPoint} from "./StopPoint";

describe("StopPoint component", () => {
  it("StopPoint snapshot", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <StopPoint
          point={createPoint(
            {
              id: 1,
              leafletId: 1,
              lat: -20.9466588303741,
              lon: 55.5343806753509,
              name: "name",
              nature: NatureEnum.stop,
            },
            4
          )}
          map={initialiseMap("map-container", false)}
          minQuantity={3}
          maxQuantity={9}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("stopPoint", 0.01);
  });

  it("StopPoint snapshot 2", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <StopPoint
          point={createPoint({
            id: 1,
            leafletId: 1,
            lat: -20.9466588303741,
            lon: 55.5343806753509,
            name: "name",
            nature: NatureEnum.stop,
          })}
          map={initialiseMap("map-container", false)}
          minQuantity={3}
          maxQuantity={5}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("stopPoint-2", 0.01);
  });
});
