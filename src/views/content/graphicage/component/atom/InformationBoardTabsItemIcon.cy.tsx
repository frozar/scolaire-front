import { InformationBoardTabsItemIcon } from "./InformationBoardTabsItemIcon";
import SettingsIcon from "./SettingsIcon";

describe("InformationBoardTabsItemIcon atom", () => {
  const icon = SettingsIcon;

  it("Active icon", () => {
    cy.mount(() => (
      <InformationBoardTabsItemIcon isActive={true} icon={icon} />
    ));
    // TODO Cypresse don't produce snapshot
    cy.get("span").compareSnapshot("active", 0.01);
  });

  it("Nominal icon", () => {
    cy.mount(() => (
      <InformationBoardTabsItemIcon isActive={false} icon={icon} />
    ));
    // TODO Cypresse don't produce snapshot
    cy.get("span").compareSnapshot("inactive", 0.01);
  });

  it("Active icon", () => {
    cy.mount(() => (
      <InformationBoardTabsItemIcon isActive={true} icon={icon} />
    ));
    // TODO Cypresse don't produce snapshot
    cy.get("span").compareSnapshot("toto", 0.01);
  });
});
