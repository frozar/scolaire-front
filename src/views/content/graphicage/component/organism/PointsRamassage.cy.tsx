import "leaflet/dist/leaflet.css";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import RamassagePoints from "./PointsRamassage";

describe("RamassagePoints component", () => {
  it("RamassagePoints snapshot", () => {
    cy.intercept("/dashboard/ramassage", (req) => {
      req.reply({ status: 200, body: { message: "Mocked API response" } });
    });
    // cy.fixture()
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <RamassagePoints
          mapId={4}
          map={initialiseMap("map-container", false)}
        />
      </div>
    ));
    cy.wait(5000);
    cy.get("#map-container").compareSnapshot("RamassagePoints", 0.01);
  });
});
