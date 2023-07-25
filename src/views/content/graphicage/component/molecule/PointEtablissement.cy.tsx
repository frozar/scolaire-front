import "leaflet/dist/leaflet.css";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import PointEtablissement from "./PointEtablissement";

describe("Checkbox component", () => {
  it("Etablissement Point snapshot", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <PointEtablissement
          map={initialiseMap("map-container", false)}
          lat={-20.9466588303741}
          lon={55.5343806753509}
          isBlinking={false}
          isLast={false}
          idPoint={1}
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
