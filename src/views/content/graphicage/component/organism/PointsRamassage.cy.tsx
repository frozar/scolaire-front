import L, { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import PointsRamassage from "./PointsRamassage";

describe("PointsRamassage component", () => {
  beforeEach(() => {
    cy.intercept("http://localhost:8000/map/2/dashboard/ramassage", {
      fixture: "getRamassages.json",
    }).as("getData");
  });

  it("PointsRamassage snapshot", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <PointsRamassage
          mapId={2}
          leafletMap={initialiseMap("map-container", false)}
          onDBLClick={(event: LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(event);
          }}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("PointsRamassage", 0.01);
  });
});
