import { SelectedMenuType } from "../../../../type";
import LeftMenuItemList from "./LeftMenuItemList";

describe("LeftMenuItemList component", () => {
  const props = {
    displayedLabel: true,
    getSelectedMenu: () => "dashboard" as SelectedMenuType,
  };

  it("LeftMenuItemList check snapshot with displayed labels", () => {
    cy.mount(() => (
      <LeftMenuItemList
        displayedLabel={props.displayedLabel}
        getSelectedMenu={props.getSelectedMenu}
      />
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("ul").compareSnapshot("LeftMenuItemList-displayed-labels", 0.01);
  });

  it("LeftMenuItemList check snapshot without displayed labels", () => {
    cy.mount(() => (
      <LeftMenuItemList
        displayedLabel={!props.displayedLabel}
        getSelectedMenu={props.getSelectedMenu}
      />
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("ul").compareSnapshot("LeftMenuItemList-no-labels-displayed", 0.01);
  });

  it("LeftMenuItemList check if only one item is selected, item: graphicage", () => {
    props.getSelectedMenu = () => "graphicage";

    cy.mount(() => (
      <LeftMenuItemList
        displayedLabel={props.displayedLabel}
        getSelectedMenu={props.getSelectedMenu}
      />
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("ul").compareSnapshot("LeftMenuItemList-one-selected", 0.01);
  });
});
