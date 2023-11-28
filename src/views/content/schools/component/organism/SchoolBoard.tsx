import { BiRegularExport } from "solid-icons/bi";
import { FaSolidPlus } from "solid-icons/fa";

import Papa from "papaparse";
import { For, createSignal } from "solid-js";
import { download } from "../../../../../utils";
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

  function exportCsv() {
    type SchoolExportType = {
      name: string;
      lat: number;
      lon: number;
    };
    const schools: SchoolExportType[] = [];
    getSchools().forEach((school) =>
      schools.push({ name: school.name, lat: school.lat, lon: school.lon })
    );

    const csv = Papa.unparse(schools);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8," });

    download("schools.csv", blob);
  }

  return (
    <section>
      <header>
        <div class="school-board-header">
          <p>Nombre total d'établissements : {getSchools().length}</p>
          <ButtonIcon
            icon={<BiRegularExport class="fill-green-base" />}
            onClick={exportCsv}
          />
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
