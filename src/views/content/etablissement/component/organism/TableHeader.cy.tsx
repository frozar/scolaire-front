import { createSignal } from "solid-js";
import Checkbox from "../atom/Checkbox";
import TableHeaderCell from "../molecule/TableHeaderCell";
import TableHeader from "./TableHeader";

const [refCheckbox, setRefCheckbox] = createSignal<HTMLInputElement>(
  document.createElement("input")
);
describe("TableHeader component", () => {
  beforeEach(() => {
    cy.mount(() => (
      <TableHeader>
        <TableHeaderCell>
          <Checkbox
            ref={setRefCheckbox}
            name="checkbox"
            ariaDescribedby="checkbox"
            onChange={() =>
              console.log("checkbox checked: ", refCheckbox().checked)
            }
          />
        </TableHeaderCell>
        <TableHeaderCell>Cell 1</TableHeaderCell>
        <TableHeaderCell>Cell 2</TableHeaderCell>
        <TableHeaderCell>Cell 3</TableHeaderCell>
        <TableHeaderCell>Cell 4</TableHeaderCell>
      </TableHeader>
    ));
  });

  it("TableHeader snapshot", () => {
    cy.get("thead").should("exist");
    cy.get("tr").should("exist");
    cy.get("th").should("have.length", 5);

    cy.get("thead").compareSnapshot("columns", 0.01);
  });
});
