import { createSignal } from "solid-js";
import Checkbox from "../atom/Checkbox";
import TableHeaderColumn from "../molecule/TableHeaderCell";
import TableHeader from "./TableHeader";

const [refCheckbox, setRefCheckbox] = createSignal<HTMLInputElement>(
  document.createElement("input")
);
describe("TableHeader component", () => {
  beforeEach(() => {
    cy.mount(() => (
      <TableHeader>
        <TableHeaderColumn>
          <Checkbox
            ref={setRefCheckbox}
            name="checkbox"
            ariaDescribedby="checkbox"
            onChange={() =>
              console.log("checkbox checked: ", refCheckbox().checked)
            }
          />
        </TableHeaderColumn>
        <TableHeaderColumn>Nom</TableHeaderColumn>
        <TableHeaderColumn>Nombre d'élèves</TableHeaderColumn>
        <TableHeaderColumn>Nombre de lignes</TableHeaderColumn>
        <TableHeaderColumn>Actions</TableHeaderColumn>
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
