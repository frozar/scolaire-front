import Layout from "./Layout";

describe("Layout template", () => {
  beforeEach(() => {
    cy.viewport(1000, 1000);
    cy.mount(() => <Layout />);

    cy.get("#left-nav-btn-colapse").then((closeLateralNavBtn) => {
      cy.wrap(closeLateralNavBtn).invoke("css", "outline", "none");
    });

    cy.get("#login-btn").then((loginButton) => {
      cy.wrap(loginButton).invoke("css", "outline", "none");
    });
  });

  it("Default check of selected menu", () => {
    cy.get(".left-menu-item").eq(0).click();
    cy.get("#layout").compareSnapshot("Layout-dashbaord-selected", 0.01);

    cy.get(".left-menu-item").eq(1).click();
    cy.get("#layout").compareSnapshot("Layout-graphicage-selected", 0.01);

    cy.get(".left-menu-item").eq(2).click();
    cy.get("#layout").compareSnapshot("Layout-etablissement-selected", 0.01);

    cy.get(".left-menu-item").eq(3).click();
    cy.get("#layout").compareSnapshot("Layout-arrets-selected", 0.01);

    cy.get(".left-menu-item").eq(4).click();
    cy.get("#layout").compareSnapshot("Layout-voiri-selected-disabled", 0.01);
  });

  it("Layout check login dropdown menu", () => {
    cy.get("#login-btn").click();
    cy.get("#layout").compareSnapshot("Layout-check-login-menu", 0.01);
  });

  it("Layout check lateral nav is open", () => {
    cy.get("#left-nav-btn-colapse").click();
    cy.wait(400);

    cy.get("#layout").compareSnapshot("Layout-check-lateralnav-open", 0.01);
  });
});
