import Button from "./Button";

describe("LeftMenuItemLabel component", () => {
  const props = {
    onClick: () => {
      console.log("clicked");
    },
    label: "Graphicage",
  };

  it("primary: when enabled", () => {
    cy.mount(() => (
      <Button onClick={props.onClick} label={props.label} isDisabled={false} />
    ));

    cy.get("button").should("have.class", "btn-primary").contains(props.label);
    cy.get("button").compareSnapshot("primary-enabled", 0.01);
  });

  it("primary: when disabled", () => {
    cy.mount(() => (
      <Button onClick={props.onClick} label={props.label} isDisabled={true} />
    ));

    cy.get("button").should("have.class", "btn-primary").contains(props.label);
    cy.get("button").compareSnapshot("primary-disabled", 0.01);
  });

  it("borderless: when enabled", () => {
    cy.mount(() => (
      <Button
        onClick={props.onClick}
        label={props.label}
        isDisabled={false}
        variant="borderless"
      />
    ));

    cy.get("button")
      .should("have.class", "btn-borderless")
      .contains(props.label);
    cy.get("button").compareSnapshot("borderless-enabled", 0.01);
  });

  it("borderless: when disabled", () => {
    cy.mount(() => (
      <Button
        onClick={props.onClick}
        label={props.label}
        isDisabled={true}
        variant="borderless"
      />
    ));

    cy.get("button")
      .should("have.class", "btn-borderless")
      .contains(props.label);
    cy.get("button").compareSnapshot("borderless-disabled", 0.01);
  });
});
