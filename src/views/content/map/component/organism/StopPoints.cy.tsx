import "leaflet/dist/leaflet.css";
import stops from "../../../../../../cypress/fixtures/getAllStops.json";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import { StopService } from "../../../../../_services/stop.service";
import { StopPoints } from "./StopPoints";

describe("StopPoints component", () => {
  beforeEach(() => {
    cy.stub(StopService, "getAll").resolves(stops);
  });

  it("StopPoints snapshot", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <StopPoints leafletMap={initialiseMap("map-container", false)} />
      </div>
    ));
    cy.get("#map-container").compareSnapshot("stops", 0.01);
  });
});
