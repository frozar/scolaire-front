import { createSignal } from "solid-js";
import EtablissementItem from "../../EtablissementItem";
import TableBody from "./TableBody";

describe("TableBody component", () => {
  const [items, setItems] = createSignal({
    id: 1,
    name: "Ecole DE BEAUMONT",
    quantity: 149,
    nbLine: 0,
    lon: 1,
    lat: 1,
    selected: false,
  });

  beforeEach(() => {
    cy.mount(() => (
      <TableBody>
        <EtablissementItem item={items()} setEtablissements={setItems} />
      </TableBody>
    ));
  });

  it("TableBody check elements", () => {
    cy.get("tbody").find("tr").find("td").should("exist");
    cy.get("tbody").compareSnapshot("body", 0.01);
  });
});
