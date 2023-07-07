import Layout from "./Layout";

/* eslint-disable @typescript-eslint/ban-ts-comment */

describe("Layout template", () => {
  beforeEach(() => {
    cy.mount(() => <Layout />);

    cy.get("#left-nav-container").then((lateralNav) => {
      cy.wrap(lateralNav).invoke("css", "height", "700px");
    });

    cy.get("#left-nav").then((lateralNav) => {
      cy.wrap(lateralNav).invoke("css", "height", "700px");
    });

    cy.get("#layout").then((layout) => {
      cy.wrap(layout).invoke("css", "height", "700px");
    });

    cy.get("#left-close").then((closeLateralNavBtn) => {
      cy.wrap(closeLateralNavBtn).invoke("css", "outline", "none");
    });

    cy.get("#login-btn").then((loginButton) => {
      cy.wrap(loginButton).invoke("css", "outline", "none");
    });
  });

  it("Default check of selected menu", () => {
    cy.get(".left-menu-item").eq(0).click();

    //@ts-ignore
    cy.get("#layout").compareSnapshot("Layout-dashbaord-selected", 0.01);

    cy.get(".left-menu-item").eq(1).click();

    //@ts-ignore
    cy.get("#layout").compareSnapshot("Layout-graphicage-selected", 0.01);

    cy.get(".left-menu-item").eq(2).click();

    //@ts-ignore
    cy.get("#layout").compareSnapshot("Layout-etablissement-selected", 0.01);

    cy.get(".left-menu-item").eq(3).click();

    //@ts-ignore
    cy.get("#layout").compareSnapshot("Layout-arrets-selected", 0.01);

    cy.get(".left-menu-item").eq(4).click();

    //@ts-ignore
    cy.get("#layout").compareSnapshot("Layout-voiri-selected-disabled", 0.01);
  });

  it("Layout check login dropdown menu", () => {
    cy.get("#login-btn").click();

    //@ts-ignore
    cy.get("#layout").compareSnapshot("Layout-check-login-menu", 0.01);
  });

  it("Layout check lateral nav is open", () => {
    cy.get("#left-close").click();
    cy.wait(400);

    //@ts-ignore
    cy.get("#layout").compareSnapshot("Layout-check-lateralnav-open", 0.01);
  });
});
