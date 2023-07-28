import "leaflet/dist/leaflet.css";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import RamassagePoints from "./PointsRamassage";

describe("RamassagePoints component", () => {
  beforeEach(() => {
    cy.intercept("http://localhost:8000/map/2/dashboard/ramassage", {
      fixture: "getRamassages.json",
    }).as("getData");
  });

  it("RamassagePoints snapshot", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <RamassagePoints
          mapId={2}
          map={initialiseMap("map-container", false)}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("RamassagePoints", 0.01);
  });
});
