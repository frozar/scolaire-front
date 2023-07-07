import { createEffect } from "solid-js";
import { etablissements, setEtablissements } from "../../Etablissement";
import { getTableCheckboxRef } from "../molecule/TableHeaderCol";
import { etablissementKeywordSearch } from "./EtablissementHeader";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

export default function () {
  const filteredEtablissements = () =>
    etablissements().filter((e) =>
      e.name.toLowerCase().includes(etablissementKeywordSearch().toLowerCase())
    );

  const selectedEtablissements = () =>
    etablissements().filter((eta) => eta.selected);

  createEffect(() => {
    getTableCheckboxRef().checked =
      filteredEtablissements().length != 0 &&
      selectedEtablissements().length == filteredEtablissements().length;
  });

  return (
    <table class="app-table">
      <TableHeader
        checkBoxHandler={(checked) => {
          setEtablissements((etablissements) =>
            etablissements.map((etablissement) => ({
              ...etablissement,
              selected: checked,
            }))
          );
        }}
      />

      <TableBody items={filteredEtablissements()} />
    </table>
  );
}
