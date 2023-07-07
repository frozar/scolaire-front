import TopNav from "./TopNav";

/* eslint-disable @typescript-eslint/ban-ts-comment */

describe("TopNav component", () => {
  it("TopNav check snapshot", () => {
    cy.mount(() => <TopNav />);

    //@ts-ignore
    cy.get("#top-nav").compareSnapshot("TopNav", 0.01);
  });

  it("TopNav check login dropdown children", () => {
    cy.mount(() => <TopNav />);

    cy.get("#login-btn").then((topNav) => {
      cy.wrap(topNav).invoke("css", "outline", "none");
    });

    cy.get("#top-nav").then((topNav) => {
      cy.wrap(topNav).invoke("css", "height", "150px");
    });

    //@ts-ignore
    cy.get("#top-nav").compareSnapshot("TopNav-login-menu-close", 0.01);

    // Open the login menu
    cy.get("#login-btn").click();

    //@ts-ignore
    cy.get("#top-nav").compareSnapshot("TopNav-login-menu-open", 0.01);

    // Close the menu login
    cy.get("#login-btn").click();

    //@ts-ignore
    cy.get("#top-nav").compareSnapshot("TopNav-login-menu-close", 0.01);
  });
});
