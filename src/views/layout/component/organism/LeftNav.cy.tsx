import LeftNav from "./LeftNav";

describe("LeftNav component", () => {
  let displayedMenu = false;
  const props = {
    getDisplayedLeftMenu: () => displayedMenu,
    toggleDisplayedLeftMenu: () => (displayedMenu = !displayedMenu),
  };

  it("LeftNav check props working", () => {
    cy.mount(() => (
      <LeftNav
        getDisplayedLeftMenu={props.getDisplayedLeftMenu}
        toggleDisplayedLeftMenu={props.toggleDisplayedLeftMenu}
      />
    ));

    cy.get(".left-menu-button-logo")
      .should("have.class", "active")
      .should("not.have.class", "disabled")
      .get("div")
      .contains("Logo content");
  });
});
