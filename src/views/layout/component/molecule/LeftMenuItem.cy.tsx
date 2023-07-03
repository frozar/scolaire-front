import LeftMenuItem from "./LeftMenuItem";

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
    const onclick = cy.spy(props.onClick).as("onclickListener");
    cy.mount(() => (
      <LeftMenuItem
        isDisabled={props.isDisabled}
        label={props.label}
        displayedLabel={props.displayedLabel}
        isSelected={props.isSelected}
        Logo={props.Logo}
        onClick={onclick}
      />
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("li").compareSnapshot("LeftMenuItem-selected", 0.01);
  });

  it("Check snapshot when not selected", () => {
    const onclick = cy.spy(props.onClick).as("onclickListener");
    cy.mount(() => (
      <LeftMenuItem
        isDisabled={props.isDisabled}
        label={props.label}
        displayedLabel={props.displayedLabel}
        isSelected={!props.isSelected}
        Logo={props.Logo}
        onClick={onclick}
      />
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("li").compareSnapshot("LeftMenuItem-not-selected", 0.01);
  });

  it("Check snapshot when disabled", () => {
    const onclick = cy.spy(props.onClick).as("onclickListener");
    cy.mount(() => (
      <LeftMenuItem
        isDisabled={!props.isDisabled}
        label={props.label}
        displayedLabel={props.displayedLabel}
        isSelected={!props.isSelected}
        Logo={props.Logo}
        onClick={onclick}
      />
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("li").compareSnapshot("LeftMenuItem-disabled", 0.01);
  });

  it("Check snapshot when label not displayed", () => {
    const onclick = cy.spy(props.onClick).as("onclickListener");
    cy.mount(() => (
      <LeftMenuItem
        isDisabled={props.isDisabled}
        label={props.label}
        displayedLabel={!props.displayedLabel}
        isSelected={props.isSelected}
        Logo={props.Logo}
        onClick={onclick}
      />
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("li").compareSnapshot("LeftMenuItem-no-label-displayed", 0.01);
  });
});
