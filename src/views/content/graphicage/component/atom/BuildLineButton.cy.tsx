import BuildLineButtonComponent from "./BuildLineButton";

describe("BuildLineButtonComponent component", () => {
  const props = {
    clickHandler: () => {
      console.log("clicked");
    },
  };

  beforeEach(() => {
    cy.viewport(1000, 1000);
  });

  it("build-line-button", () => {
    cy.mount(() => (
      <BuildLineButtonComponent clickHandler={props.clickHandler} />
    ));

    cy.get(".build-line-button").compareSnapshot("build-line-button", 0.01);
  });
});
