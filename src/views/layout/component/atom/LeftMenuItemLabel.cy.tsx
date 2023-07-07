import LeftMenuItemLabel from "./LeftMenuItemLabel";

describe("LeftMenuItemLabel component", () => {
  const props = {
    isActive: true,
    isDisabled: true,
    label: "Graphicage",
  };

  it("When not active and not disabled", () => {
    cy.mount(() => (
      <LeftMenuItemLabel
        isActive={!props.isActive}
        isDisabled={!props.isDisabled}
        label={props.label}
      />
    ));

    cy.get("span").contains(props.label);
    cy.get("span").compareSnapshot("not-active-and-not-disabled", 0.01);
  });

  it("When active", () => {
    cy.mount(() => (
      <LeftMenuItemLabel
        isActive={props.isActive}
        isDisabled={!props.isDisabled}
        label={props.label}
      />
    ));

    cy.get("span").contains(props.label);
    cy.get("span").compareSnapshot("active", 0.01);
  });

  it("When disabled", () => {
    cy.mount(() => (
      <LeftMenuItemLabel
        isActive={!props.isActive}
        isDisabled={props.isDisabled}
        label={props.label}
      />
    ));

    cy.get("span").then((span) => {
      cy.wrap(span).invoke("css", "background-color", "black");
    });

    cy.get("span").contains(props.label);
    cy.get("span").compareSnapshot("disabled", 0.01);
  });
});
