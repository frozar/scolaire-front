import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import LineTip from "./LineTip";

describe("Line Tip component", () => {
  it("Line tip", () => {
    cy.mount(() => {
      return (
        <div id="map-container" style={{ width: "100%", height: "500px" }}>
          <LineTip
            latlng={L.latLng(-20.9466588303741, 55.5343806753509)}
            leafletMap={initialiseMap("map-container", false)}
            color={"orange"}
            opacity={1}
          />
        </div>
      );
    });

    const mapContainer = cy.get("#map-container");
    mapContainer.trigger("mousemove", { clientX: 250, clientY: 250 });
    mapContainer.compareSnapshot("line-tip", 0.01);
  });
});
