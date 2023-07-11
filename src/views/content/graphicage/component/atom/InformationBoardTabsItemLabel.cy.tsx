import { InformationBoardTabsItemLabel } from "./InformationBoardTabsItemLabel";

describe("InformationBoardTabsItemLabel atom", () => {
  const myLabel = "My Label";

  it("Active label", () => {
    cy.mount(() => (
      <InformationBoardTabsItemLabel isActive={true} label={myLabel} />
    ));
    cy.get("span").should("satisfy", ($el) => {
      const classList = Array.from($el[0].classList);
      return classList.includes("active");
    });
    cy.get("span").contains(myLabel);
    //TODO have to fix the Cypress SnapShot : don't take the first snap
    cy.get("span").compareSnapshot("active", 0.01);
  });

  it("Inactive label", () => {
    cy.mount(() => (
      <InformationBoardTabsItemLabel isActive={false} label={myLabel} />
    ));
    cy.get("span").contains(myLabel);
    cy.get("span").compareSnapshot("inactive", 0.01);
  });

  it("Active label", () => {
    cy.mount(() => (
      <InformationBoardTabsItemLabel isActive={true} label={myLabel} />
    ));
    cy.get("span").contains(myLabel);
    cy.get("span").compareSnapshot("active", 0.01);
  });
});
