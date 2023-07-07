import LeftMenuItem from "./LeftMenuItem";

/* eslint-disable @typescript-eslint/ban-ts-comment */

describe("LeftMenuItem component", () => {
  const props = {
    isDisabled: false,
    label: "Dashboard",
    displayedLabel: true,
    isSelected: true,
    Logo: () => <p>Logo content</p>,
    onClick: () => console.log("ok"),
  };

  it("Check props onClick called once", () => {
    const onClickSpy = cy.spy(props.onClick).as("onclickListener");
    cy.mount(() => (
      <LeftMenuItem
        isDisabled={props.isDisabled}
        label={props.label}
        displayedLabel={props.displayedLabel}
        isSelected={props.isSelected}
        Logo={props.Logo}
        onClick={onClickSpy}
      />
    ));
    // Click on element
    cy.get("li").click();

    // Check if callback onClick was been called one time
    cy.get("@onclickListener").should("have.been.calledOnce");
  });

  it("Check snapshot when selected", () => {
    cy.mount(() => (
      <LeftMenuItem
        isDisabled={props.isDisabled}
        label={props.label}
        displayedLabel={props.displayedLabel}
        isSelected={props.isSelected}
        Logo={props.Logo}
        onClick={props.onClick}
      />
    ));

    //@ts-ignore
    cy.get("li").compareSnapshot("LeftMenuItem-selected", 0.01);
  });

  it("Check snapshot when not selected", () => {
    cy.mount(() => (
      <LeftMenuItem
        isDisabled={props.isDisabled}
        label={props.label}
        displayedLabel={props.displayedLabel}
        isSelected={!props.isSelected}
        Logo={props.Logo}
        onClick={props.onClick}
      />
    ));

    //@ts-ignore
    cy.get("li").compareSnapshot("LeftMenuItem-not-selected", 0.01);
  });

  it("Check snapshot when disabled", () => {
    cy.mount(() => (
      <LeftMenuItem
        isDisabled={!props.isDisabled}
        label={props.label}
        displayedLabel={props.displayedLabel}
        isSelected={!props.isSelected}
        Logo={props.Logo}
        onClick={props.onClick}
      />
    ));

    //@ts-ignore
    cy.get("li").compareSnapshot("LeftMenuItem-disabled", 0.01);
  });

  it("Check snapshot when label not displayed", () => {
    cy.mount(() => (
      <LeftMenuItem
        isDisabled={props.isDisabled}
        label={props.label}
        displayedLabel={!props.displayedLabel}
        isSelected={props.isSelected}
        Logo={props.Logo}
        onClick={props.onClick}
      />
    ));

    //@ts-ignore
    cy.get("li").compareSnapshot("LeftMenuItem-no-label-displayed", 0.01);
  });
});
