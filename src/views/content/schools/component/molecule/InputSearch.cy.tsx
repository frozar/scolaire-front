import InputSearch from "./InputSearch";

describe("InputSearch component", () => {
  const props = {
    onInput: () => {
      console.log("onInput");
    },
  };

  it("InputSearch empty", () => {
    cy.mount(() => <InputSearch {...props} />);

    cy.get(".input-search-logo").should("exist");
    cy.get(".input").should("exist");

    cy.get(".input").compareSnapshot("empty", 0.01);
  });

  it("InputSearch check writen", () => {
    cy.mount(() => <InputSearch {...props} />);

    cy.get(".input").type("onInput");
    cy.get(".input").compareSnapshot("typed", 0.01);
  });
});
