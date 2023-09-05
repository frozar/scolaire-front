import SettingsIcon from "../atom/SettingsIcon";
import { InformationBoardTabsItem } from "./InformationBoardTabsItem";

describe("InformationBoardTabsItemLabel atom", () => {
  const props = {
    isActive: true,
    label: "My Label",
    icon: SettingsIcon,
    onClick: () => console.log("ok"),
  };

  it("Active button", () => {
    cy.mount(() => (
      <InformationBoardTabsItem
        isActive={props.isActive}
        label={props.label}
        icon={props.icon}
        onClick={props.onClick}
      />
    ));
    cy.get("button.information-board-tabs-item").should("satisfy", ($el) => {
      const classList = Array.from($el[0].classList);
      return classList.includes("active");
    });
    cy.get(".information-board-tabs-item-label").contains(props.label);
    cy.get("button.information-board-tabs-item").compareSnapshot(
      "active",
      0.01
    );
  });

  it("Inactive button", () => {
    const onClickSpy = cy.spy(props.onClick).as("onclickListener");
    cy.mount(() => (
      <InformationBoardTabsItem
        isActive={!props.isActive}
        label={props.label}
        icon={props.icon}
        onClick={onClickSpy}
      />
    ));

    cy.get(".information-board-tabs-item-label").contains(props.label);
    cy.get("button.information-board-tabs-item").compareSnapshot(
      "inactive",
      0.01
    );
  });

  it("Button onClick", () => {
    const onClickSpy = cy.spy(props.onClick).as("onclickListener");
    cy.mount(() => (
      <InformationBoardTabsItem
        isActive={props.isActive}
        label={props.label}
        icon={props.icon}
        onClick={onClickSpy}
      />
    ));
    cy.get("button.information-board-tabs-item").click();
    cy.get("@onclickListener").should("have.been.calledOnce");
  });
});
