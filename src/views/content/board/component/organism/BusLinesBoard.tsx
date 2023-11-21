import { createSignal } from "solid-js";
import { GtfsService } from "../../../../../_services/gtfs.service";
import PlusIcon from "../../../../../icons/PlusIcon";
import { displayAddTripMessage } from "../../../../../userInformation/utils";
import { getLines } from "../../../map/component/organism/BusLines";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import { deselectAllTrips } from "../../../map/component/organism/Trips";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import BusLinesList from "../../../schools/component/organism/BusLinesList";
import ButtonIcon from "../molecule/ButtonIcon";
import {
  changeBoard,
  onBoard,
  toggleDrawMod,
} from "../template/ContextManager";
import { AddLineStep, setAddLineCurrentStep } from "./AddLineBoardContent";
import "./BusLines.css";
import { DrawTripStep, setCurrentStep } from "./DrawTripBoard";

export default function () {
  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  // TODO corriger
  // const filteredLines = () =>
  //   getTrips.filter((trip) => trip.name?.includes(searchKeyword()));

  function addLine() {
    if (onBoard() == "line-add") {
      toggleDrawMod();
      setCurrentStep(DrawTripStep.initial);
    } else {
      deselectAllPoints();
      deselectAllTrips();

      // TODO corriger
      // displayAddLineMessage();
      changeBoard("line-add");
      setAddLineCurrentStep(AddLineStep.schoolSelection);
      toggleDrawMod();
      displayAddTripMessage();
    }
  }

  function onInputSearch(key: string) {
    setSearchKeyword(key);
  }

  return (
    <section>
      <header class="line-board-header">
        <div class="line-board-header-infos">
          <p>Total des lignes: {getLines().length}</p>
          {/* TODO: Enhance visual */}
          <a
            class="cursor-pointer underline"
            onClick={() => {
              GtfsService.get();
            }}
          >
            Exporter
          </a>
          <ButtonIcon icon={<PlusIcon />} onClick={addLine} />
        </div>

        <InputSearch onInput={onInputSearch} />
      </header>
      <BusLinesList
        lines={
          getLines().filter((line) => line.name?.includes(searchKeyword()))
            .length == 0
            ? []
            : getLines().filter((line) => line.name?.includes(searchKeyword()))
        }
      />
    </section>
  );
}
