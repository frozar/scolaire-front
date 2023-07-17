/* eslint-disable @typescript-eslint/ban-ts-comment */
import TableHeaderColumn from "../molecule/TableHeaderColumn";
import TableHeader from "./TableHeader";

describe("TableHeader component", () => {
  beforeEach(() => {
    cy.mount(() => (
      <TableHeader>
        <TableHeaderColumn>Column 1</TableHeaderColumn>
        <TableHeaderColumn>Column 2</TableHeaderColumn>
        <TableHeaderColumn>Column 3</TableHeaderColumn>
      </TableHeader>
    ));
  });

  it("TableHeader snapshot", () => {
    cy.get("thead").should("exist");
    cy.get("tr").should("exist");
    cy.get("th").should("have.length", 3);

    cy.get("thead").compareSnapshot("columns", 0.01);
  });
});
