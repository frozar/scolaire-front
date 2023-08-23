// TODO: see to set filters component on global component, rework it to filtering schools and stops depending on its location

import { createSignal } from "solid-js";
import { useStateGui } from "../../../../../StateGui";
import ExportCsvButton from "../../../../../component/ExportCsvButton";
import ImportCsvButton from "../../../../../component/ImportCsvButton";
import ActionSelector from "../../../../../component/atom/ActionSelector";
import Button from "../../../../../component/atom/Button";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import { setDataToEdit, toggleEditStop } from "../../EditStop";
import "./Filters.css";
// import InputSearch from "../molecule/InputSearch";

const [, { getActiveMapId }] = useStateGui();

export const [searchInputKeyword, setSearchInputKeyword] = createSignal("");

export default function () {
  return (
    <div id="filters">
      <div class="left">
        <ActionSelector isDisabled={true} />
        <Button
          label="Ajouter"
          onClick={() => {
            setDataToEdit();
            toggleEditStop();
          }}
        />
        <InputSearch
          onInput={(key: string) => {
            setSearchInputKeyword(key);
          }}
        />
      </div>

      <div class="right">
        <ExportCsvButton
          exportRoute={`/map/${getActiveMapId()}/export/csv_etablissement`}
          filename="etablissement"
        />
        <ImportCsvButton />
      </div>
    </div>
  );
}
