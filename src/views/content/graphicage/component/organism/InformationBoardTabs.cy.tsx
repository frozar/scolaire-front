import InformationCircleIcon from "../atom/InformationCircleIcon";
import SettingsIcon from "../atom/SettingsIcon";
import {
  InformationBoardTabType,
  InformationBoardTabs,
} from "./InformationBoardTabs";

describe("InformationBoardTabs organisme", () => {
  const tabs: InformationBoardTabType[] = [
    {
      id: "information",
      label: "Informations",
      icon: InformationCircleIcon,
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: SettingsIcon,
    },
  ];

  it("Nominal Tabs", () => {
    cy.mount(() => <InformationBoardTabs tabs={tabs} />);
    cy.get("nav").compareSnapshot("nominal", 0.01);
  });

  it("Nominal Tabs", () => {
    cy.mount(() => <InformationBoardTabs tabs={tabs} />);
    cy.get("nav").compareSnapshot("nominal", 0.01);
  });

  it("Second Tab selected", () => {
    cy.mount(() => <InformationBoardTabs tabs={tabs} />);
    cy.get(".information-board-tabs-item").eq(1).click();
    cy.get("nav").compareSnapshot("second", 0.01);
  });
});
