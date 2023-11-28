import { BiRegularExport } from "solid-icons/bi";
import { For, createSignal } from "solid-js";
import { CsvUtils } from "../../../../../utils/csv.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { CsvEnum } from "../../../board/component/molecule/ImportSelection";
import { getStops } from "../../../map/component/organism/StopPoints";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import StopItem from "../molecul/StopItem";
import "./StopBoard.css";

export default function () {
  const [keywordSearch, setKeyWordSearch] = createSignal<string>("");

  const filteredStops = () =>
    getStops().filter((stop) =>
      stop.name.toLowerCase().includes(keywordSearch().toLowerCase())
    );

  function onInputSearch(key: string) {
    setKeyWordSearch(key);
  }

  return (
    <section class="stop-board">
      <header>
        <div class="stop-board-header">
          <p>{getStops().length + " "} Arrêts</p>
          <ButtonIcon
            icon={<BiRegularExport class="fill-green-base" />}
            onClick={exportCsv}
          />
        </div>
        <InputSearch onInput={onInputSearch} />
      </header>

      <div class="stop-board-content">
        <For each={filteredStops()}>
          {(fields) => <StopItem stop={fields} />}
        </For>
      </div>
    </section>
  );
}

function exportCsv() {
  CsvUtils.exportCsv(CsvEnum.stops);
  // TODO: Move
  CsvUtils.exportStudentsCsv();
}
