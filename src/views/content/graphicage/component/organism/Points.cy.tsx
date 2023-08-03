import "leaflet/dist/leaflet.css";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import Points from "./Points";

describe("PointsEtablissement component", () => {
  beforeEach(() => {
    // TODO: Fix fixtures, data must be coherent with eleveVersEtablissement.json
    // to test blinking
    cy.intercept("http://localhost:8000/map/2/dashboard/etablissement", {
      fixture: "getEtablissements.json",
    });

    cy.intercept("http://localhost:8000/map/2/dashboard/ramassage", {
      fixture: "getRamassages.json",
    });

    cy.intercept("http://localhost:8000/map/2/eleve_vers_etablissement", {
      fixture: "eleveVersEtablissement.json",
    });
  });

  it("Points snapshot", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <Points mapId={2} leafletMap={initialiseMap("map-container", false)} />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("Points", 0.01);
    // TODO: Add blinking test
  });
});
