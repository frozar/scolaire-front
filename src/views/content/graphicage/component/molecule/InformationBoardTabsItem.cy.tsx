import SettingsIcon from "../atom/SettingsIcon";
import { InformationBoardTabsItem } from "./InformationBoardTabsItem";

describe("InformationBoardTabsItemLabel atom", () => {
  const myLabel = "My Label";
  const icon = SettingsIcon;

  it("Active label", () => {
    cy.mount(() => (
      //TODO manque le test du void onClick
      <InformationBoardTabsItem isActive={true} label={myLabel} icon={icon} />
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
      <InformationBoardTabsItem isActive={false} label={myLabel} icon={icon} />
    ));
    cy.get("span").contains(myLabel);
    cy.get("span").compareSnapshot("inactive", 0.01);
  });

  it("Active label", () => {
    cy.mount(() => (
      <InformationBoardTabsItem isActive={true} label={myLabel} icon={icon} />
    ));
    cy.get("span").contains(myLabel);
    cy.get("span").compareSnapshot("active", 0.01);
  });
});
