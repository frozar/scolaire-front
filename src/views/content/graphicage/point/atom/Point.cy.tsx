import Point from "./Point.mapWrapper.story";

describe("Checkbox component", () => {
  it("Etablissement Point", () => {
    cy.mount(() => (
      <Point radius={12} weight={4} borderColor="green" fillColor="white" />
    ));
    const retryOptions = {
      limit: 5, // max number of retries
      delay: 500, // delay before next iteration, ms
    };

    cy.get("#map-container").compareSnapshot("school", 0.01, retryOptions);
  });
});
