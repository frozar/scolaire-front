import "leaflet/dist/leaflet.css";
import { initialiseMap } from "../../../../../../.storybook/utils/mapWrapper";
import PointEtablissement from "./PointEtablissement";

describe("Checkbox component", () => {
  const retryOptions = {
    limit: 5, // max number of retries
    delay: 500, // delay before next iteration, ms
  };

  it("Etablissement Point snapshot", () => {
    cy.mount(() => (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <PointEtablissement
          map={initialiseMap("map-container")}
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

    cy.wait(1000);
    cy.get("#map-container").compareSnapshot("schoolPoint", 0.01, retryOptions);
  });
});
