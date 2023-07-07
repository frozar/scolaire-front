import { AiOutlineSearch } from "solid-icons/ai";
import { createSignal } from "solid-js";
import ExportCsvButton from "../../../../../component/ExportCsvButton";
import ImportCsvButton from "../../../../../component/ImportCsvButton";
import ActionSelector from "../../../../../component/atom/ActionSelector";
import Button from "../../../../../component/atom/Button";
import { setDataToEdit, toggleEditStop } from "../../EditEtablissement";
import InputSearch from "../molecule/InputSearch";

export const [etablissementKeywordSearch, setEtablissementKeywordSearch] =
  createSignal("");

export default function () {
  return (
    <header>
      <h1>Etablissements</h1>
      <div id="filters">
        <div class="left">
          <ActionSelector isDisabled={true} />
          <Button
            label="Ajouter"
            onClickHandler={() => {
              setDataToEdit();
              toggleEditStop();
            }}
          />

          <InputSearch
            onInput={setEtablissementKeywordSearch}
            placeholder="Recherche"
            name="search"
            haveIcon={true}
            icon={<AiOutlineSearch />}
          />
        </div>
        <div class="right">
          <ExportCsvButton exportRoute="/export/etablissement_input" />
          <ImportCsvButton />
        </div>
      </div>
    </header>
  );
}
