import Filters from "./Filters";

describe("Filters component", () => {
  // describe("Filters component", { viewportWidth: 1000 }, () => {
  // Cypress.config("viewportWidth", 1000);

  beforeEach(() => {
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
    // TODO Check why only 500px width image is generated and not more
    // https://github.com/uktrade/cypress-image-diff/issues/100
    cy.viewport(1000, 700);
    cy.get("#filters").compareSnapshot("filters", 0.01, {});
  });
});
