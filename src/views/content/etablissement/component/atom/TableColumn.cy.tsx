/* eslint-disable @typescript-eslint/ban-ts-comment */
import Checkbox from "./Checkbox";
import TableColumn from "./TableColumn";

describe("TableColumn component", () => {
  const checkboxRef: HTMLInputElement = document.createElement("input");
  checkboxRef.setAttribute("type", "checkbox");

  const checkboxProps = {
    onChange: () => console.log("checkbox changed"),
    ariaDescribedby: "checkbox",
    ref: checkboxRef,
    name: "checkbox",
  };

  it("TableColumn body text", () => {
    cy.mount(() => <TableColumn>column</TableColumn>);
    cy.get("td").should("have.text", "column");

    //@ts-ignore
    cy.get("td").compareSnapshot("text", 0.01);
  });

  it("TableColumn body head text ", () => {
    cy.mount(() => (
      <TableColumn classVariant="table-head-col">column</TableColumn>
    ));

    //@ts-ignore
    cy.get("th").compareSnapshot("text-head", 0.01);
  });

  it("TableColumn checkbox checked", () => {
    cy.mount(() => (
      <TableColumn>
        <Checkbox {...checkboxProps} />
      </TableColumn>
    ));

    cy.get(".checkbox").then((checkbox) => {
      cy.wrap(checkbox).invoke("css", "outline", "none");
    });

    cy.get(".checkbox").click();
    //@ts-ignore
    cy.get("td").compareSnapshot("checkbox-checked", 0.01);
  });

  it("TableColumn checkbox unchecked", () => {
    cy.mount(() => (
      <TableColumn>
        <Checkbox {...checkboxProps} />
      </TableColumn>
    ));

    cy.get(".checkbox").then((checkbox) => {
      cy.wrap(checkbox).invoke("css", "outline", "none");
    });
    //@ts-ignore
    cy.get("td").compareSnapshot("checkbox-unchecked", 0.01);
  });
});
