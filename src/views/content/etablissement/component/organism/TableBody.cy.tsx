import { createSignal, For } from "solid-js";
import EtablissementItem from "../../EtablissementItem";
import TableBody from "./TableBody";

describe("TableBody component with etablissement item row", () => {
  const [items, setItems] = createSignal([
    {
      id: 1,
      name: "cell 1",
      quantity: 149,
      nbLine: 0,
      lon: 1,
      lat: 1,
      selected: false,
    },
    {
      id: 2,
      name: "cell 2",
      quantity: 149,
      nbLine: 0,
      lon: 1,
      lat: 1,
      selected: false,
    },
  ]);

  beforeEach(() => {
    cy.mount(() => (
      <TableBody>
        <For each={items()}>
          {(fields) => {
            return (
              <EtablissementItem item={fields} setEtablissements={setItems} />
            );
          }}
        </For>
      </TableBody>
    ));
  });

  it("TableBody check elements & snapshot", () => {
    cy.get("tbody").find("tr").find("td").eq(0).should("exist");
    cy.get("tbody").find("tr").find("td").eq(1).should("exist");
    cy.get("tbody").compareSnapshot("body", 0.01);
  });
});
