import "leaflet/dist/leaflet.css";
import { createPoint } from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import PointEtablissement from "./PointEtablissement";

describe("Checkbox component", () => {
  it("Etablissement Point snapshot", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <PointEtablissement
          point={createPoint({
            id: 1,
            idPoint: 1,
            lat: -20.9466588303741,
            lon: 55.5343806753509,
            name: "name",
            quantity: 5,
          })}
          map={initialiseMap("map-container", false)}
          isLast={false}
          onIsLast={() => console.log("onIsLast")}
          onClick={() => console.log("onClick")}
          onMouseOut={() => console.log("onMouseOut")}
          onDBLClick={() => console.log("onDBLClick")}
          onMouseOver={() => console.log("onMouseOver")}
        />
      </div>
    ));

    cy.get("#map-container").compareSnapshot("schoolPoint", 0.01);
  });
});
