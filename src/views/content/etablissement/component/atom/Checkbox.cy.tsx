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
      <div id="checkbox-container">
        <Checkbox
          ariaDescribedby="etablissement-item"
          onChange={props.onChange}
          name="etablissement"
          ref={props.ref}
        />
      </div>
    ));
    cy.get("#checkbox-container").then((checkboxContainer) => {
      cy.wrap(checkboxContainer).invoke("css", "width", "35px");
      cy.wrap(checkboxContainer).invoke("css", "display", "flex");
      cy.wrap(checkboxContainer).invoke("css", "justify-content", "center");
    });
    cy.get(".checkbox").should("have.prop", "name", "etablissement");
    cy.get(".checkbox").should("have.prop", "type", "checkbox");

    //@ts-ignore
    cy.get("#checkbox-container").compareSnapshot("Checkbox: unchecked", 0.01);
  });

  it("Checkbox checked", () => {
    cy.mount(() => (
      <div id="checkbox-container">
        <Checkbox
          ariaDescribedby="etablissement-item"
          onChange={props.onChange}
          name="etablissement"
          ref={props.ref}
        />
      </div>
    ));

    cy.get("#checkbox-container").then((checkboxContainer) => {
      cy.wrap(checkboxContainer).invoke("css", "width", "35px");
      cy.wrap(checkboxContainer).invoke("css", "display", "flex");
      cy.wrap(checkboxContainer).invoke("css", "justify-content", "center");
    });

    cy.get(".checkbox").then((checkbox) => {
      cy.wrap(checkbox).invoke("css", "outline", "none");
    });

    cy.get(".checkbox").click();
    //@ts-ignore
    cy.get("#checkbox-container").compareSnapshot("Checkbox checked", 0.01);
  });
});
