import BuildLineButton from "./BuildLineButton";

describe("BuildLineButton component", () => {
  const props = {
    clickHandler: () => {
      console.log("clicked");
    },
  };

  beforeEach(() => {
    cy.viewport(1000, 1000);
  });

  it("build-line-button", () => {
    cy.mount(() => <BuildLineButton clickHandler={props.clickHandler} />);

    cy.get(".build-line-button").compareSnapshot("build-line-button", 0.01);
  });
});
