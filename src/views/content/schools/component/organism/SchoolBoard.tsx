import { FaSolidPlus } from "solid-icons/fa";

import { For, createSignal } from "solid-js";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getSchools } from "../../../map/component/organism/SchoolPoints";
import InputSearch from "../molecule/InputSearch";
import SchoolItem from "../molecule/SchoolItem";
import "./SchoolBoard.css";

export default function () {
  const [keywordSearch, setKeyWordSearch] = createSignal<string>("");
  const filteredSchools = () =>
    getSchools().filter((e) =>
      e.name.toLowerCase().includes(keywordSearch().toLowerCase())
    );

  async function addSchool() {
    // TODO can really add school from here ? add school is disponible only with import no ?
    console.log("add school");
  }

  return (
    <section>
      <header>
        <div class="school-board-header">
          <p>{getSchools().length} Établissements</p>
          <ButtonIcon
            icon={<FaSolidPlus class="fill-green-base" />}
            onClick={addSchool}
            class="rounded-full"
          />
        </div>

        <InputSearch
          onInput={(key: string) => {
            setKeyWordSearch(key);
          }}
        />
      </header>

      <div class="school-board-content">
        <For each={filteredSchools()}>
          {(fields) => <SchoolItem school={fields} />}
        </For>
      </div>
    </section>
  );
}
