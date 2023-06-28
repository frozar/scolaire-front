import LeftMenuItemLabel from "./LeftMenuItemLabel";
describe("LeftMenuItemLabel component", () => {
  const props = {
    isActive: false,
    isDisabled: false,
    label: "Se connecter",
  };

  it("When not authenticated", () => {
    cy.mount(() => (
      <LeftMenuItemLabel
        isActive={props.isActive}
        isDisabled={props.isDisabled}
        label={props.label}
      />
    ));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    cy.get("span").compareSnapshot("defaultTestButton", 0.01);
    cy.get("span").contains(props.label);
  });

  it("When authenticated", () => {
    props.label = "Se déconnecter";

    cy.mount(() => (
      <LeftMenuItemLabel
        isActive={props.isActive}
        isDisabled={props.isDisabled}
        label={props.label}
      />
    ));

    cy.get("span").contains(props.label);
  });
});
