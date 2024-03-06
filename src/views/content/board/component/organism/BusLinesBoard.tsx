import { BiRegularExport } from "solid-icons/bi";
import { createSignal } from "solid-js";
import { getLines } from "../../../../../_stores/line.store";
import PlusIcon from "../../../../../icons/PlusIcon";
import { displayAddTripMessage } from "../../../../../userInformation/utils";
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
import { DialogToDisplayEnum, setDialogToDisplay } from "./Dialogs";
import { DrawTripStep, setCurrentStep } from "./DrawTripBoard";

export default function () {
  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  // TODO corriger
  // const filteredLines = () =>
  //   getTrips.filter((trip) => trip.name?.includes(searchKeyword()));

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

function displayExportDialog() {
  setDialogToDisplay(DialogToDisplayEnum.exportSelection);
}
