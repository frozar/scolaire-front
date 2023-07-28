import "leaflet/dist/leaflet.css";
import {
  createPointEtablissement,
  createPointRamassage,
} from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import { useStateAction } from "../../../../../StateAction";
import LineUnderConstruction from "./LineUnderConstruction";
const [, { getLineUnderConstruction }] = useStateAction();

describe("Line component", () => {
  it("Default Line", () => {
    cy.mount(() => {
      return (
        <div id="map-container" style={{ width: "100%", height: "500px" }}>
          {createPointRamassage({
            fullId: "map-container",
            id: 1,
            idPoint: 51,
            lat: -20.9465588303741,
            lon: 55.5323806753509,
            name: "name",
            quantity: 30,
          })}
          ,
          {createPointEtablissement({
            fullId: "map-container",
            id: 1,
            idPoint: 51,
            lat: -20.9486587304741,
            lon: 55.5544806754509,
            name: "name",
          })}
          <LineUnderConstruction
            stops={getLineUnderConstruction().stops}
            leafletMap={initialiseMap("map-container", false)}
          />
        </div>
      );
    });

    cy.get(".map-point").eq(1).click({ force: true });
    cy.get(".map-point").eq(0).click({ force: true });

    cy.get("#map-container").compareSnapshot("default", 0.01);
  });
});
