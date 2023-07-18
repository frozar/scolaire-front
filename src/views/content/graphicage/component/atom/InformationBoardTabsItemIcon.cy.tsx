import { InformationBoardTabsItemIcon } from "./InformationBoardTabsItemIcon";
import SettingsIcon from "./SettingsIcon";

describe("InformationBoardTabsItemIcon atom", () => {
  const icon = SettingsIcon;

  it("Active icon", () => {
    cy.mount(() => (
      <InformationBoardTabsItemIcon isActive={true} icon={icon} />
    ));
    cy.get("span").should("satisfy", ($el) => {
      const classList = Array.from($el[0].classList);
      return classList.includes("active"); // passes
    });
    cy.get("span").compareSnapshot("active", 0.01);
  });

  it("Nominal icon", () => {
    cy.mount(() => (
      <InformationBoardTabsItemIcon isActive={false} icon={icon} />
    ));
    cy.get("span").compareSnapshot("inactive", 0.01);
  });
});
