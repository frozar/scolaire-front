import LeftMenuItemList from "./LeftMenuItemList";

describe("LeftMenuItemList component", () => {
  const props = {
    displayedLabel: true,
  };

  it("LeftMenuItemList check snapshot with displayed labels", () => {
    cy.mount(() => <LeftMenuItemList displayedLabel={props.displayedLabel} />);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("ul").compareSnapshot("LeftMenuItemList-displayed-labels", 0.01);
  });

  it("LeftMenuItemList check snapshot without displayed labels", () => {
    cy.mount(() => <LeftMenuItemList displayedLabel={!props.displayedLabel} />);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("ul").compareSnapshot("LeftMenuItemList-no-labels-displayed", 0.01);
  });
});
