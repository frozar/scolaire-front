/* eslint-disable @typescript-eslint/ban-ts-comment */
import InputText from "./InputText";

describe("InputText component", () => {
  const props = {
    onInput: () => {
      console.log("onInput");
    },
    name: "name",
    placeholder: "placeholder",
  };

  it("InputText check props", () => {
    cy.mount(() => <InputText {...props} />);

    cy.get("input[type='text']").should(
      "have.attr",
      "placeholder",
      "placeholder"
    );
    cy.get("input[type='text']").should("have.attr", "name", "name");

    //@ts-ignore
    cy.get(".input").compareSnapshot("empty", 0.01);
  });

  it("InputText check write", () => {
    cy.mount(() => <InputText {...props} />);

    cy.get(".input").type("onInput");
    //@ts-ignore
    cy.get(".input").compareSnapshot("typed", 0.01);
  });
});
