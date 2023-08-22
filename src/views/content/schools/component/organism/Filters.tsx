import { createSignal } from "solid-js";
import { useStateGui } from "../../../../../StateGui";
import ExportCsvButton from "../../../../../component/ExportCsvButton";
import ImportCsvButton from "../../../../../component/ImportCsvButton";
import ActionSelector from "../../../../../component/atom/ActionSelector";
import Button from "../../../../../component/atom/Button";
import { setDataToEdit, toggleEditStop } from "../../EditSchool";
import InputSearch from "../molecule/InputSearch";
import "./Filters.css";

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
