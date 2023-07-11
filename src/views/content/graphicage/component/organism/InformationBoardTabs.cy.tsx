import { InformationBoardTabType } from "../../../../../type";
import InformationContent from "../../informationBoard/InformationContent";
import InformationCircleIcon from "../atom/InformationCircleIcon";
import SettingsIcon from "../atom/SettingsIcon";
import { InformationBoardTabs } from "./InformationBoardTabs";

describe("InformationBoardTabs organisme", () => {
  const tabs: InformationBoardTabType[] = [
    {
      content: InformationContent,
      icon: InformationCircleIcon,
      label: "Informations",
    },
    {
      content: InformationContent,
      icon: SettingsIcon,
      label: "Paramètres",
    },
  ];

  it("Nominal Tabs", () => {
    cy.mount(() => <InformationBoardTabs tabs={tabs} />);
    //TODO have to fix the Cypress SnapShot : don't take the first snap
    cy.get("nav").compareSnapshot("nominal", 0.01);
  });

  it("Nominal Tabs", () => {
    cy.mount(() => <InformationBoardTabs tabs={tabs} />);
    cy.get("nav").compareSnapshot("nominal", 0.01);
  });

  it("Second Tab selected", () => {
    cy.mount(() => <InformationBoardTabs tabs={tabs} />);
    cy.get(".information-board-tabs-item").eq(1).click();
    cy.wait(1000);
    cy.get("nav").compareSnapshot("second", 0.01);
  });
});
