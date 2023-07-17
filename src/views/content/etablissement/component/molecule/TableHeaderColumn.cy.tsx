import TableHeaderColumn from "./TableHeaderColumn";

describe("TableHeaderColumn component", () => {
  it("TableHeaderColumn snapshot", () => {
    cy.mount(() => <TableHeaderColumn>Custom Label</TableHeaderColumn>);

    cy.get("th").should("exist");
    cy.get("th").contains("Custom Label");
    cy.get("th").compareSnapshot("column", 0.01);
  });
});
