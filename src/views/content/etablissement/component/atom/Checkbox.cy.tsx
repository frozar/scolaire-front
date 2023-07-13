/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Setter, createSignal } from "solid-js";
import Checkbox from "./Checkbox";

describe("Checkbox component", () => {
  const [refCheckbox] = createSignal<HTMLInputElement>(
    document.createElement("input")
  );

  const props = {
    ref: refCheckbox as Setter<HTMLInputElement>,
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

    cy.get(".checkbox").should("have.prop", "name", "etablissement");
    cy.get(".checkbox").should("have.prop", "type", "checkbox");

    cy.get(".checkbox").compareSnapshot("checkbox-unchecked", 0.01);
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

    cy.get(".checkbox").then((checkbox) => {
      cy.wrap(checkbox).invoke("css", "outline", "none");
    });

    cy.get(".checkbox").click();
    cy.get(".checkbox").compareSnapshot("checkbox-checked", 0.01);
  });
});
