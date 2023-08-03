import L, { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import PointEtablissement from "./PointsEtablissement";

describe("PointsEtablissement component", () => {
  beforeEach(() => {
    cy.intercept("http://localhost:8000/map/2/dashboard/etablissement", {
      fixture: "getEtablissements.json",
    }).as("getData");
  });

  it("EtablissementPoints snapshot", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <PointEtablissement
          mapId={2}
          leafletMap={initialiseMap("map-container", false)}
          onDBLClick={(event: LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(event);
          }}
        />
      </div>
    )).as("component");

    cy.get("#map-container").compareSnapshot("EtablissementPoints", 0.01);
  });
});
