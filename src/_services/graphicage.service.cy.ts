import { createSignal } from "solid-js";
import { NatureEnum } from "../type";
import { GraphicageService } from "./graphicage.service";

describe("OSRMService", () => {
  const host = import.meta.env.VITE_BACK_URL;
  const interceptURL = host + "/generator/draw-helper";
  const [selected, setSelected] = createSignal<boolean>(false);

  const drawHelperData = {
    schools: [
      {
        id: 1,
        name: "name",
        lon: 1,
        lat: 1,
        nature: NatureEnum.school,
        leafletId: 1,
        setSelected: setSelected,
        selected: selected,
        associated: [{ id: 7, name: "BENJOINS", quantity: 4 }],
      },
    ],
    selected: [
      {
        id: 1,
        name: "name",
        lon: 1,
        lat: 1,
        nature: NatureEnum.school,
        leafletId: 1,
        setSelected: setSelected,
        selected: selected,
        associated: [{ id: 7, name: "BENJOINS", quantity: 4 }],
      },
    ],
    stops: [
      {
        id: 1,
        name: "name",
        lon: 1,
        lat: 1,
        nature: NatureEnum.school,
        leafletId: 1,
        selected: selected,
        setSelected: setSelected,
        associated: [{ id: 7, name: "BENJOINS", quantity: 4 }],
      },
    ],
    capacity: 1,
    timeLimitSeconds: 1,
    nbLimitSolution: 1,
  };

  it("getRoadPolyline, URL check ", () => {
    cy.intercept("POST", interceptURL, drawHelperData).as("intercept");

    cy.wrap(GraphicageService.drawHelper(drawHelperData));
    GraphicageService.drawHelper(drawHelperData);

    cy.wait("@intercept").then((interception) => {
      expect(interception.request.method).to.eq("POST");
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.request.url).to.eq(interceptURL);
    });
  });
});
