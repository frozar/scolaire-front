//TODO to Fix
// import "leaflet/dist/leaflet.css";
// import {
//   createSchoolPoint,
//   createStopPoint,
// } from "../../../../../../testing/utils/TestUtils";
// import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
// import { useStateAction } from "../../../../../StateAction";
// import CourseUnderConstruction from "./CourseUnderConstruction";

// const [
//   ,
//   { getCourseUnderConstruction, confirmEtablissementSelection, setModeAddCourse },
// ] = useStateAction();

// setModeAddCourse();
// confirmEtablissementSelection();

// describe("Course component", () => {
//   it("Default Course", () => {
//     cy.mount(() => {
//       return (
//         <div id="map-container" style={{ width: "100%", height: "500px" }}>
//           {createStopPoint({
//             fullId: "map-container",
//             withTiles: false,
//             id: 1,
//             leafletId: 51,
//             lat: -20.9465588303741,
//             lon: 55.5323806753509,
//             name: "name",
//           })}
//           ,
//           {createSchoolPoint({
//             fullId: "map-container",
//             withTiles: false,
//             id: 2,
//             leafletId: 52,
//             lat: -20.9486587304741,
//             lon: 55.5544806754509,
//             name: "name",
//           })}
//           <CourseUnderConstruction
//             stops={getCourseUnderConstruction().stops}
//             leafletMap={initialiseMap("map-container", false)}
//           />
//         </div>
//       );
//     });

//     cy.get(".map-point").eq(1).click({ force: true });
//     cy.get(".map-point").eq(0).click({ force: true });

//     cy.get("#map-container").compareSnapshot("default", 0.01);
//   });
// });
