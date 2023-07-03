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
    // Cliquez sur le menu item
    cy.get("li").click();

    // Vérifiez que le callback onClick a été appelé une fois
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
        isSelected={props.isSelected}
        Logo={props.Logo}
        onClick={onclick}
      />
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("li").compareSnapshot("LeftMenuItem-disabled", 0.01);
  });

  it("Check snapshot when not display label", () => {
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
    cy.get("li").compareSnapshot("LeftMenuItem-no-label-display", 0.01);
  });
});
