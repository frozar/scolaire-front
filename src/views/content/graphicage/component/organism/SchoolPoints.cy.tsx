import "leaflet/dist/leaflet.css";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import { SchoolService } from "../../../../../_services/school.service";

import schools from "../../../../../../cypress/fixtures/getAllSchools.json";
import { SchoolPoints } from "./SchoolPoints";

describe("PointsEtablissement component", () => {
  beforeEach(() => {
    cy.stub(SchoolService, "getAll").resolves(schools);
  });

  it("EtablissementPoints snapshot", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <SchoolPoints leafletMap={initialiseMap("map-container", false)} />
      </div>
    )).as("component");

    cy.get("#map-container").compareSnapshot("SchoolPoints", 0.01);
  });
});
