import TopNav from "./TopNav";

describe("TopNav component", () => {
  beforeEach(() => {
    cy.viewport(1000, 1000);
  });

  it("TopNav check snapshot", () => {
    cy.mount(() => <TopNav />);

    cy.get("#top-nav").compareSnapshot("TopNav", 0.01);
  });

  it("TopNav check login dropdown children", () => {
    // cy.mount(() => <TopNav />);
    cy.mount(() => (
      <div class="h-28" id="to-screenshot">
        <TopNav />
      </div>
    )); // h-max ; h-28

    cy.get("#login-btn").then((topNav) => {
      cy.wrap(topNav).invoke("css", "outline", "none");
    });

    // cy.get("#top-nav").then((topNav) => {
    //   cy.wrap(topNav).invoke("css", "height", "150px");
    // });

    cy.get("#to-screenshot").compareSnapshot("TopNav-login-menu-close", 0.01);

    // Open the login menu
    cy.get("#login-btn").click();
    // cy.get("#top-nav").compareSnapshot("TopNav-login-menu-open", 0.01);
    cy.get("#to-screenshot").compareSnapshot("TopNav-login-menu-open", 0.01);

    // Close the menu login
    cy.get("#login-btn").click();
    cy.get("#top-nav").compareSnapshot("TopNav-login-menu-close", 0.01);
  });
});
