import Layout from "./Layout";

describe("Layout template", () => {
  it("Layout snapshot", () => {
    cy.mount(() => <Layout />);
    cy.get("#layout").then((topNav) => {
      cy.wrap(topNav).invoke("css", "height", "550px");
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#layout").compareSnapshot("Layout-default", 0.01);
  });

  it("Layout ceck login dropdown menu", () => {
    cy.mount(() => <Layout />);
    cy.get("#layout").then((topNav) => {
      cy.wrap(topNav).invoke("css", "height", "550px");
    });

    cy.get("#login-btn").click();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#layout").compareSnapshot("Layout-check-login-menu", 0.01);
  });

  it("Default check of selected menu", () => {
    cy.mount(() => <Layout />);
    cy.get("#layout").then((topNav) => {
      cy.wrap(topNav).invoke("css", "height", "550px");
    });

    cy.get(".lateral-nav-item").eq(0).click();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#layout").compareSnapshot("Layout-dashbaord-selected", 0.01);

    cy.get(".lateral-nav-item").eq(1).click();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#layout").compareSnapshot("Layout-graphicage-selected", 0.01);

    cy.get(".lateral-nav-item").eq(4).click();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#layout").compareSnapshot("Layout-voiri-selected-disabled", 0.01);
  });
});
