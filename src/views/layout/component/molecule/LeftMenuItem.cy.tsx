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
      <div id="lateral-nav" class="active">
        <LeftMenuItem
          isDisabled={props.isDisabled}
          label={props.label}
          isSelected={props.isSelected}
          Logo={props.Logo}
          onClick={props.onClick}
        />
      </div>
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("li").compareSnapshot("LeftMenuItem-selected", 0.01);
  });

  it("Check snapshot hidden label", () => {
    cy.mount(() => (
      <LeftMenuItem
        isDisabled={props.isDisabled}
        label={props.label}
        isSelected={!props.isSelected}
        Logo={props.Logo}
        onClick={props.onClick}
      />
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("li").compareSnapshot("LeftMenuItem-label-hidden", 0.01);
  });

  it("Check snapshot when not selected", () => {
    cy.mount(() => (
      <div id="lateral-nav" class="active">
        <LeftMenuItem
          isDisabled={props.isDisabled}
          label={props.label}
          isSelected={!props.isSelected}
          Logo={props.Logo}
          onClick={props.onClick}
        />
      </div>
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("li").compareSnapshot("LeftMenuItem-not-selected", 0.01);
  });

  it("Check snapshot when disabled", () => {
    cy.mount(() => (
      <div id="lateral-nav" class="active">
        <LeftMenuItem
          isDisabled={!props.isDisabled}
          label={props.label}
          isSelected={!props.isSelected}
          Logo={props.Logo}
          onClick={props.onClick}
        />
      </div>
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("li").compareSnapshot("LeftMenuItem-disabled", 0.01);
  });

  it("Check snapshot when label not displayed", () => {
    cy.mount(() => (
      <LeftMenuItem
        isDisabled={props.isDisabled}
        label={props.label}
        isSelected={props.isSelected}
        Logo={props.Logo}
        onClick={props.onClick}
      />
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("li").compareSnapshot("LeftMenuItem-no-label-displayed", 0.01);
  });
});
