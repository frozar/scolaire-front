import LeftNav from "./LeftNav";

describe("LeftNav component", () => {
  const props = {
    getDisplayedLeftMenu: () => false,
  };

  it("LeftNav check snapshot when nav is closed", () => {
    cy.mount(() => (
      <LeftNav getDisplayedLeftMenu={props.getDisplayedLeftMenu} />
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#lateral-nav").compareSnapshot("LeftNav-closed", 0.01);
  });

  it("LeftNav check snapshot when nav is closed", () => {
    cy.mount(() => (
      <LeftNav getDisplayedLeftMenu={() => !props.getDisplayedLeftMenu()} />
    ));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("#lateral-nav").compareSnapshot("LeftNav-open", 0.01);
  });

  it("LeftNav checking toggle working", () => {
    cy.mount(() => (
      <LeftNav getDisplayedLeftMenu={props.getDisplayedLeftMenu} />
    ));

    // Tried to test it with snapshot but when userAgent click on #lateral-close the item children have displayedLabel to false.

    cy.get("#lateral-nav").should("not.have.class", "active");

    cy.get("#lateral-close").click();

    cy.get("#lateral-nav").should("have.class", "active");

    cy.get("#lateral-close").click();

    cy.get("#lateral-nav").should("not.have.class", "active");
  });
});
