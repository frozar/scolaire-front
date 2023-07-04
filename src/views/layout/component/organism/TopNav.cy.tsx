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

    cy.get("#login-btn").click();
    cy.get("#login-menu-container").should("exist");

    cy.get("#login-btn").click();

    // Todo: Can't get screenshot of login menu in snap of top nav, watch if not possible to translate login menu inside de top nav to get it

    // cy.get("#login-menu-container").then((component) => {
    //   cy.wrap(component).invoke("css", "transform", "translateX(-10px)");
    //   cy.wrap(component).invoke("css", "transform", "translateY(-30px)");
    //   cy.wrap(component).invoke("css", "z-index", "5000");

    //   cy.wait(500);
    //   cy.task("log", "test snapshot here");
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   //@ts-ignore
    //   cy.get("#nav-top").compareSnapshot("TopNav-2", 0.01);
    // });

    cy.get("#login-menu-container").should("not.exist");
  });
});
