import TableCell from "./TableCell";

describe("TableCell component", () => {
  beforeEach(() => {
    cy.mount(() => <TableCell>Table Cell</TableCell>);
  });

  it("TableCell check elements & snapshot", () => {
    cy.get("td").should("exist");
    cy.get("td").compareSnapshot("cell", 0.01);
  });
});
