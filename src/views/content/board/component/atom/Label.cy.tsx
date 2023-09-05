import "leaflet/dist/leaflet.css";
import Label from "./Label";

describe("PointsEtablissement component", () => {
  it("Points snapshot", () => {
    cy.mount(() => {
      return <Label label="Label text" for="input-id" />;
    });

    cy.get("label").contains("Label text");
    cy.get("label").invoke("attr", "for").should("eq", "input-id");
    cy.get("label").compareSnapshot("Label", 0.01);
  });
});
