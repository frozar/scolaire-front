import "leaflet/dist/leaflet.css";
import schools from "../../../../../../cypress/fixtures/getAllSchools.json";
import stops from "../../../../../../cypress/fixtures/getAllStops.json";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import { SchoolService } from "../../../../../_services/school.service";
import { StopService } from "../../../../../_services/stop.service";
import { Points } from "./Points";

describe("PointsEtablissement component", () => {
  beforeEach(() => {
    cy.stub(SchoolService, "getAll").resolves(schools);
    cy.stub(StopService, "getAll").resolves(stops);
  });

  it("Points snapshot", () => {
    cy.mount(() => {
      return (
        <div id="map-container" style={{ width: "100%", height: "500px" }}>
          <Points leafletMap={initialiseMap("map-container", false)} />
        </div>
      );
    });

    cy.get("#map-container").compareSnapshot("Points", 0.01);
  });
});
