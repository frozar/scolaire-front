import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Line from "./Line";

describe("LeftMenuItemLabel component", () => {
  const retryOptions = {
    limit: 5, // max number of retries
    delay: 1000, // delay before next iteration, ms
  };

  beforeEach(() => {
    cy.viewport(1000, 1000);
  });

  const buildMap = (idDiv: string) => {
    const map = L.map(idDiv).setView([-20.9466588303741, 55.5343806753509], 15);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        // eslint-disable-next-line quotes
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    return map;
  };

  it("Default Line", () => {
    cy.mount(() => {
      return (
        <div id="map-container" style={{ width: "100%", height: "500px" }}>
          <Line
            latlngs={[
              L.latLng(-20.9466588303741, 55.5343806753509),
              L.latLng(-20.9466588303743, 55.54),
              L.latLng(-20.942, 55.535),
            ]}
            leafletMap={buildMap("map-container")}
            color={"orange"}
            opacity={1}
          />
        </div>
      );
    });
    cy.wait(1000);
    cy.get("#map-container").compareSnapshot("default", 0.01, retryOptions);
  });

  it("Change color", () => {
    cy.mount(() => {
      return (
        <div id="map-container" style={{ width: "100%", height: "500px" }}>
          <Line
            latlngs={[
              L.latLng(-20.9466588303741, 55.5343806753509),
              L.latLng(-20.9466588303743, 55.54),
              L.latLng(-20.942, 55.535),
            ]}
            leafletMap={buildMap("map-container")}
            color={"red"}
            opacity={1}
          />
        </div>
      );
    });
    cy.wait(1000);
    cy.get("#map-container").compareSnapshot("color", 0.01, retryOptions);
  });

  it("Change Opacity", () => {
    cy.mount(() => {
      return (
        <div id="map-container" style={{ width: "100%", height: "500px" }}>
          <Line
            latlngs={[
              L.latLng(-20.9466588303741, 55.5343806753509),
              L.latLng(-20.9466588303743, 55.54),
              L.latLng(-20.942, 55.535),
            ]}
            leafletMap={buildMap("map-container")}
            color={"orange"}
            opacity={0.5}
          />
        </div>
      );
    });
    cy.wait(1000);
    cy.get("#map-container").compareSnapshot("opacity", 0.01, retryOptions);
  });

  it("Change Latlngs", () => {
    cy.mount(() => {
      return (
        <div id="map-container" style={{ width: "100%", height: "500px" }}>
          <Line
            latlngs={[
              L.latLng(-20.9466588303741, 55.5343806753509),
              L.latLng(-20.9466588303743, 55.54),
            ]}
            leafletMap={buildMap("map-container")}
            color={"orange"}
            opacity={1}
          />
        </div>
      );
    });
    cy.wait(1000);
    cy.get("#map-container").compareSnapshot("latlng", 0.01, retryOptions);
  });
});
