import { BiRegularExport } from "solid-icons/bi";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { LineType } from "../../../../_entities/line.entity";
import { SchoolType } from "../../../../_entities/school.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { getLines } from "../../../../_stores/line.store";
import { getSchools } from "../../../../_stores/school.store";
import { getStops } from "../../../../_stores/stop.store";
import PlusIcon from "../../../../icons/PlusIcon";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayTrips } from "../../_component/organisme/Trips";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import {
  DialogToDisplayEnum,
  setDialogToDisplay,
} from "../../board/component/organism/Dialogs";
import InputSearch from "../../schools/component/molecule/InputSearch";
import BusLinesList from "../../schools/component/organism/BusLinesList";

export function Lines() {
  const [filteredLines, setFilteredLines] = createSignal<LineType[]>(
    getLines()
  );
  setMapData(getStops(), getSchools(), filteredLines());

  onCleanup(() => {
    setMapData([], [], []);
  });

  createEffect(() => {
    setMapData(getStops(), getSchools(), filteredLines());
  });

  createEffect(() => {
    if (searchKeyword() == "") {
      setFilteredLines([...getLines()]);
    } else {
      setFilteredLines([
        ...getLines().filter((line) =>
          line.name?.toLowerCase().includes(searchKeyword().toLowerCase())
        ),
      ]);
    }
  });

  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  function onInputSearch(key: string) {
    setSearchKeyword(key);
  }

  return (
    <section>
      <header class="line-board-header">
        <div class="line-board-header-infos">
          <p>Total des lignes: {getLines().length}</p>
          <ButtonIcon
            icon={<BiRegularExport class="fill-green-base" />}
            onClick={displayExportDialog}
          />
          <ButtonIcon icon={<PlusIcon />} onClick={addLine} />
        </div>

        <InputSearch onInput={onInputSearch} />
      </header>
      <BusLinesList lines={filteredLines()} />
    </section>
  );
}

function setMapData(
  stops: StopType[],
  schools: SchoolType[],
  lines: LineType[]
) {
  setDisplayStops(stops);
  setDisplaySchools(schools);

  let trips: TripType[] = [];
  for (const line of lines) {
    trips = trips.concat(line.trips);
  }

  setDisplayTrips(trips);
}

function addLine() {
  //TODO pointer sur la bonne vue
  //   if (onBoard() == "line-add") {
  //     toggleDrawMod();
  //     setCurrentStep(DrawTripStep.initial);
  //   } else {
  //     deselectAllPoints();
  //     deselectAllTrips();
  //     // TODO corriger
  //     // displayAddLineMessage();
  //     changeBoard("line-add");
  //     setAddLineCurrentStep(AddLineStep.schoolSelection);
  //     toggleDrawMod();
  //     displayAddTripMessage();
  //   }
}

function displayExportDialog() {
  setDialogToDisplay(DialogToDisplayEnum.exportSelection);
}
