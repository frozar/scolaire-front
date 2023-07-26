import "leaflet/dist/leaflet.css";
import {
  createPointEtablissement,
  createPointRamassage,
} from "../../../../../../testing/utils/StoryBookUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import { useStateAction } from "../../../../../StateAction";
import LineUnderConstruction from "./LineUnderConstruction";
const [, { getLineUnderConstruction }] = useStateAction();

describe("Line component", () => {
  it("Default Line", () => {
    cy.mount(() => {
      return (
        <div id="map-container" style={{ width: "100%", height: "500px" }}>
          {createPointRamassage(
            "map-container",
            51,
            -20.9466588303741,
            55.5343806753509
          )}
          ,
          {createPointEtablissement(
            "map-container",
            50,
            -20.9566588304741,
            55.5344806754509
          )}
          <LineUnderConstruction
            stops={getLineUnderConstruction().stops}
            leafletMap={initialiseMap("map-container", false)}
          />
        </div>
      );
    });

    cy.get(".map-point").eq(0).click();
    cy.get(".map-point").eq(1).click();

    cy.get("#map-container").compareSnapshot("default", 0.01);
  });
});
