import { For } from "solid-js";
import { EtablissementItemType } from "../../../../../type";
import { setEtablissements } from "../../Etablissement";
import EtablissementItem from "./EtablissementTableRow";

import "./tableBody.css";

interface TableBodyProps {
  items: EtablissementItemType[];
}

export default function (props: TableBodyProps) {
  return (
    <tbody id="table-body">
      <For each={props.items}>
        {(fields) => {
          return (
            <EtablissementItem
              item={fields}
              setEtablissements={setEtablissements}
            />
          );
        }}
      </For>
    </tbody>
  );
}
