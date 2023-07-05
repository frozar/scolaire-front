import TopNav from "./TopNav";

describe("TopNav component", () => {
  it("TopNav check snapshot", () => {
    cy.mount(() => <TopNav />);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#nav-top").compareSnapshot("TopNav", 0.01);
  });

  it("TopNav check login dropdown children", () => {
    cy.mount(() => <TopNav />);

    cy.get("#login-btn").then((topNav) => {
      cy.wrap(topNav).invoke("css", "outline", "none");
    });

    cy.get("#nav-top").then((topNav) => {
      cy.wrap(topNav).invoke("css", "height", "150px");
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#nav-top").compareSnapshot("TopNav-login-menu-close", 0.01);

    // Open the login menu
    cy.get("#login-btn").click();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#nav-top").compareSnapshot("TopNav-login-menu-open", 0.01);

    // Close the menu login
    cy.get("#login-btn").click();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#nav-top").compareSnapshot("TopNav-login-menu-close", 0.01);
  });
});
