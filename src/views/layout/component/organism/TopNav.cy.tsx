import TopNav from "./TopNav";
describe("TopNav component", () => {
  it("TopNav check snapshot", () => {
    cy.mount(() => <TopNav />);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("button").compareSnapshot("TopNav", 0.01);
  });

  it("TopNav check login dropdown children", () => {
    cy.mount(() => <TopNav />);

    cy.get("#nav-top").find("button#login-btn").as("loginButton");

    cy.get("@loginButton").click();
    cy.get("#login-menu-container").should("exist");

    cy.get("@loginButton").click();
    cy.wait(500);

    cy.get("#login-menu-container").should("not.exist");
  });
});
