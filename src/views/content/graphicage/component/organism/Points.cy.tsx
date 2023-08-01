import "leaflet/dist/leaflet.css";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import Points from "./Points";

describe("PointsEtablissement component", () => {
  beforeEach(() => {
    // Change fixtures to real corresponding data ?
    cy.intercept("http://localhost:8000/map/2/dashboard/etablissement", {
      fixture: "getEtablissements.json",
    }).as("getDataEtablissement");

    cy.intercept("http://localhost:8000/map/2/dashboard/ramassage", {
      fixture: "getRamassages.json",
    }).as("getDataRamassage");

    cy.intercept("http://localhost:8000/map/2/eleve_vers_etablissement", {
      fixture: "eleveVersEtablissement.json",
    }).as("eleveVersEtablissementData");
  });

  it("Points snapshot", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <Points mapId={2} map={initialiseMap("map-container", false)} />
      </div>
    )).as("component"); // ?

    cy.get("#map-container").compareSnapshot("Points", 0.01);
    // test isBlinking
  });
});
