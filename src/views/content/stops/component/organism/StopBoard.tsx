import { For, createSignal } from "solid-js";
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
      <header class="stop-board-header">
        <InputSearch onInput={onInputSearch} />

        <p>{getStops().length + " "} arrêts enregistrer</p>
      </header>

      <div class="stop-board-content">
        <For each={filteredStops()}>
          {(fields) => <StopItem stop={fields} />}
        </For>
      </div>
    </section>
  );
}
