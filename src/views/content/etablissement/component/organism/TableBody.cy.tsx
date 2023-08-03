import { createSignal, For } from "solid-js";
import EtablissementItem from "../../EtablissementItem";
import TableBody from "./TableBody";

describe("TableBody component with etablissement item row", () => {
  const [items, setItems] = createSignal([
    {
      id: 1,
      name: "Ecole DE BEAUMONT",
      lon: 1,
      lat: 1,
      selected: false,
      associated: [
        {
          id: 2,
          name: "Stop 2",
          quantity: 3,
        },
      ],
    },
    {
      id: 2,
      name: "Ecole DE BEAUMONT",
      lon: 1,
      lat: 1,
      selected: false,
      associated: [
        {
          id: 1,
          name: "Stop 1",
          quantity: 4,
        },
        {
          id: 2,
          name: "Stop 2",
          quantity: 9,
        },
      ],
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
