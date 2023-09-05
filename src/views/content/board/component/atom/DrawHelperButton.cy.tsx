import { DrawHelperButton } from "./DrawHelperButton";

// TODO improve the test
describe("DrawHelperButton component", () => {
  it("Nominal test", () => {
    cy.mount(() => <DrawHelperButton schools={[]} />);

    cy.get(".graphicage-draw-helper-button").compareSnapshot("nominal", 0.01);
  });
});
