/* eslint-disable @typescript-eslint/ban-ts-comment */
import Checkbox from "./Checkbox";

describe("Checkbox component", () => {
  const props = {
    ref: document.createElement("input"),
    onChange: () => console.log("onChange checkbox"),
  };

  it("Checkbox unchecked", () => {
    cy.mount(() => (
      <Checkbox
        ariaDescribedby="etablissement-item"
        onChange={props.onChange}
        name="etablissement"
        ref={props.ref}
      />
    ));

    cy.get("input").should("have.prop", "name", "etablissement");
    cy.get("input").should("have.prop", "type", "checkbox");

    //@ts-ignore
    cy.get("input").compareSnapshot("Checkbox: unchecked", 0.01);
  });

  it("Checkbox checked", () => {
    cy.mount(() => (
      <Checkbox
        ariaDescribedby="etablissement-item"
        onChange={props.onChange}
        name="etablissement"
        ref={props.ref}
      />
    ));

    cy.get("input").click();
    //@ts-ignore
    cy.get("input").compareSnapshot("Checkbox checked", 0.01);
  });
});
