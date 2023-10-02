import { NatureEnum } from "../type";
import { OsrmService } from "./osrm.service";

describe("OSRMService", () => {
  const host = import.meta.env.VITE_API_OSRM_URL;
  const interceptURL = host + "/1,1;2,2?geometries=geojson&overview=full";

  const coursePoint = [
    {
      id: 1,
      leafletId: 1,
      name: "name",
      lon: 1,
      lat: 1,
      quantity: 1,
      nature: NatureEnum.school,
    },
    {
      id: 2,
      leafletId: 1,
      name: "name",
      lon: 2,
      lat: 2,
      quantity: 1,
      nature: NatureEnum.school,
    },
  ];

  it("getRoadPolyline, URL check ", () => {
    cy.intercept("GET", interceptURL).as("intercept");

    OsrmService.getRoadPolyline(coursePoint);

    cy.wait("@intercept").then((interception) => {
      expect(interception.request.method).to.eq("GET");
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.request.url).to.eq(interceptURL);
    });
  });
});
