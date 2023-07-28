import BuildLineButton from "./BuildLineButton";

describe("BuildLineButton component", () => {
  const props = {
    clickHandler: () => {
      console.log("clicked");
    },
  };

  it("build-line-button", () => {
    cy.mount(() => (
      <BuildLineButton clickHandler={props.clickHandler} disabled={false} />
    ));

    cy.get(".build-line-button").compareSnapshot("build-line-button", 0.01);
  });
});
