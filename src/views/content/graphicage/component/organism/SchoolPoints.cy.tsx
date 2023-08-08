// import "leaflet/dist/leaflet.css";
// import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
// import { SchoolPoints } from "./SchoolPoints";

// describe("PointsEtablissement component", () => {
//   beforeEach(() => {
//     //TODO Have to Mock the fetch - first have to setup the MapId
//     cy.intercept("http://localhost:8000/map/2/dashboard/etablissement", {
//       //TODO have to update the fixture JSON
//       fixture: "getEtablissements.json",
//     }).as("getData");
//   });

//   it("EtablissementPoints snapshot", () => {
//     cy.mount(() => (
//       <div id="map-container" style={{ width: "100%", height: "500px" }}>
//         <SchoolPoints leafletMap={initialiseMap("map-container", false)} />
//       </div>
//     )).as("component");

//     cy.get("#map-container").compareSnapshot("EtablissementPoints", 0.01);
//   });
// });
