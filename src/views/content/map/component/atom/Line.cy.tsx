import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import Line from "./Line";

describe("Line component", () => {
  beforeEach(() => {
    cy.viewport(500, 500);
  });

  it("Default Line", () => {
    cy.mount(() => {
      return (
        <div id="map-container" style={{ width: "100%", height: "500px" }}>
          <Line
            latlngs={[
              L.latLng(-20.9466588303741, 55.5343806753509),
              L.latLng(-20.9466588303743, 55.56),
              L.latLng(-20.942, 55.57),
            ]}
            leafletMap={initialiseMap("map-container", false)}
            color={"orange"}
            opacity={1}
          />
        </div>
      );
    });
    cy.get("#map-container").compareSnapshot("default", 0.01);
  });

  it("Change color", () => {
    cy.mount(() => {
      return (
        <div id="map-container" style={{ width: "100%", height: "500px" }}>
          <Line
            latlngs={[
              L.latLng(-20.9466588303741, 55.5343806753509),
              L.latLng(-20.9466588303743, 55.56),
              L.latLng(-20.942, 55.57),
            ]}
            leafletMap={initialiseMap("map-container", false)}
            color={"red"}
            opacity={1}
          />
        </div>
      );
    });
    cy.get("#map-container").compareSnapshot("color", 0.01);
  });

  it("Change Opacity", () => {
    cy.mount(() => {
      return (
        <div id="map-container" style={{ width: "100%", height: "500px" }}>
          <Line
            latlngs={[
              L.latLng(-20.9466588303741, 55.5343806753509),
              L.latLng(-20.9466588303743, 55.56),
              L.latLng(-20.942, 55.57),
            ]}
            leafletMap={initialiseMap("map-container", false)}
            color={"orange"}
            opacity={0.5}
          />
        </div>
      );
    });
    cy.get("#map-container").compareSnapshot("opacity", 0.01);
  });

  it("Change Latlngs", () => {
    cy.mount(() => {
      return (
        <div id="map-container" style={{ width: "100%", height: "500px" }}>
          <Line
            latlngs={[
              L.latLng(-20.9466588303741, 55.5343806753509),
              L.latLng(-20.9466588303743, 55.56),
            ]}
            leafletMap={initialiseMap("map-container", false)}
            color={"orange"}
            opacity={1}
          />
        </div>
      );
    });
    cy.get("#map-container").compareSnapshot("latlng", 0.01);
  });
});
