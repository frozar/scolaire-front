// import "leaflet/dist/leaflet.css";

// describe("StopPoints component", () => {
//   beforeEach(() => {
//     //TODO Have to Mock the fetch - first have to setup the MapId
//     cy.intercept("http://localhost:8000/map/2/dashboard/ramassage", {
//       //TODO have to update the fixture JSON
//       fixture: "getRamassages.json",
//     }).as("getData");
//   });

//   it("StopPoints snapshot", () => {
//     // cy.mount(() => (
//     //   <div id="map-container" style={{ width: "100%", height: "500px" }}>
//     //     <StopPoints
//     //       mapId={2}
//     //       leafletMap={initialiseMap("map-container", false)}
//     //     />
//     //   </div>
//     // ));

//     // cy.get("#map-container").compareSnapshot("stops", 0.01);
//   });
// });
