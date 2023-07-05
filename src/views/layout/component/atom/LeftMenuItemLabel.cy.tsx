import LeftMenuItemLabel from "./LeftMenuItemLabel";

describe("LeftMenuItemLabel component", () => {
  const props = {
    isActive: false,
    isDisabled: false,
    label: "Se connecter",
  };

  it("Check snapshot", () => {
    cy.mount(() => (
      <div id="lateral-nav" class="active">
        <LeftMenuItemLabel
          isActive={props.isActive}
          isDisabled={props.isDisabled}
          label={props.label}
        />
      </div>
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("span").compareSnapshot("label", 0.01);
    cy.get("span").contains(props.label);
  });

  it("Check snapshot hidden", () => {
    cy.mount(() => (
      <LeftMenuItemLabel
        isActive={props.isActive}
        isDisabled={props.isDisabled}
        label={props.label}
      />
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("span").compareSnapshot("label-hidden", 0.01);
  });
});
