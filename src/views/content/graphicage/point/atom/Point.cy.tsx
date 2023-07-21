import Point from "./Point.mapWrapper.story";

describe("Checkbox component", () => {
  const retryOptions = {
    limit: 5, // max number of retries
    delay: 500, // delay before next iteration, ms
  };

  it("Etablissement Point", () => {
    cy.mount(() => (
      <Point
        radius={12}
        weight={4}
        borderColor="green"
        fillColor="white"
        isBlinking={false}
      />
    ));
    cy.wait(1000);
    cy.get("#map-container").compareSnapshot("school", 0.01, retryOptions);
  });

  it("Ramassage Point", () => {
    cy.mount(() => (
      <Point
        radius={8}
        weight={4}
        borderColor="red"
        fillColor="white"
        isBlinking={false}
      />
    ));
    cy.wait(1000);
    cy.get("#map-container").compareSnapshot("stop", 0.01, retryOptions);
  });

  it("Check blinking", () => {
    cy.mount(() => (
      <Point
        radius={12}
        weight={4}
        borderColor="green"
        fillColor="white"
        isBlinking={true}
      />
    ));

    cy.get(".map-point").should("have.class", "circle-animation-green");
  });
});
