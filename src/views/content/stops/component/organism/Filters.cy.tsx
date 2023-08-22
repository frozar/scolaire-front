import Filters from "./Filters";

describe("Filters component", () => {
  beforeEach(() => {
    cy.viewport(1000, 1000);
    cy.mount(Filters);
  });

  it("Filters check elements", () => {
    cy.get("#action-selector").should("exist");
    cy.get("button").eq(0).contains("Ajouter");
    cy.get("button").eq(1).contains("Exporter");
    cy.get("button").eq(2).contains("Importer");
    cy.get(".input-field").find(".input-search-logo").should("exist");
    cy.get(".input-field")
      .find(".input")
      .should("have.attr", "placeholder", "Recherche");
  });

  it("Filters snapshot", () => {
    cy.get("#filters").compareSnapshot("filters", 0.01);
  });
});
