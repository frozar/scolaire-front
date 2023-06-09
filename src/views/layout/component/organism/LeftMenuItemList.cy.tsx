import { SelectedMenuType } from "../../../../type";
import LeftMenuItemList from "./LeftMenuItemList";

describe("LeftMenuItemList component", () => {
  const props = {
    displayedLabel: true,
    getSelectedMenu: () => "dashboard" as SelectedMenuType,
  };

  it("LeftMenuItemList check snapshot with displayed labels", () => {
    cy.mount(() => (
      <div id="left-nav" class="active">
        <LeftMenuItemList getSelectedMenu={props.getSelectedMenu} />
      </div>
    ));

    cy.get("ul").compareSnapshot("LeftMenuItemList-displayed-labels", 0.01);
  });

  it("LeftMenuItemList check snapshot without displayed labels", () => {
    cy.mount(() => (
      <LeftMenuItemList getSelectedMenu={props.getSelectedMenu} />
    ));

    cy.get("ul").compareSnapshot("LeftMenuItemList-no-labels-displayed", 0.01);
  });

  it("LeftMenuItemList check if only one item is selected, item: graphicage", () => {
    props.getSelectedMenu = () => "graphicage";

    cy.mount(() => (
      <div id="left-nav" class="active">
        <LeftMenuItemList getSelectedMenu={props.getSelectedMenu} />
      </div>
    ));

    cy.get("ul").compareSnapshot("LeftMenuItemList-one-selected", 0.01);
  });
});
