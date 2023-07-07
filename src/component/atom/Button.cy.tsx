import Button from "./Button";

describe("LeftMenuItemLabel component", () => {
  const props = {
    onClick: () => {
      console.log("clicked");
    },
    label: "Graphicage",
  };

  it("When enabled", () => {
    cy.mount(() => (
      <Button
        onClickHandler={props.onClick}
        label={props.label}
        isDisabled={false}
      />
    ));

    cy.get("button").contains(props.label);
    cy.get("button").compareSnapshot("enabled", 0.01);
  });

  it("When disabled", () => {
    cy.mount(() => (
      <Button
        onClickHandler={props.onClick}
        label={props.label}
        isDisabled={true}
      />
    ));

    cy.get("button").contains(props.label);
    cy.get("button").compareSnapshot("disabled", 0.01);
  });
});
