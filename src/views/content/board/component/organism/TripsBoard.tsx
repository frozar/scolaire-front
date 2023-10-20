import { createSignal } from "solid-js";
import { LineType } from "../../../../../_entities/line.entity";
import { BusLineService } from "../../../../../_services/line.service";
import PencilIcon from "../../../../../icons/PencilIcon";
import PlusIcon from "../../../../../icons/PlusIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import { displayAddTripMessage } from "../../../../../userInformation/utils";
import { getLines, setLines } from "../../../map/component/organism/BusLines";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import {
  deselectAllTrips,
  getTrips,
} from "../../../map/component/organism/Trips";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import { TripsList } from "../../../schools/component/organism/TripsList";
import BoardTitle from "../atom/BoardTitle";
import ButtonIcon from "../molecule/ButtonIcon";
import {
  changeBoard,
  onBoard,
  toggleDrawMod,
} from "../template/ContextManager";
import { DrawTripStep, setCurrentStep } from "./DrawTripBoard";
import "./TripsBoard.css";

export function TripsBoard(props: { line: LineType }) {
  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  const filteredTrips = () =>
    getTrips().filter((line) => line.name?.includes(searchKeyword()));

  function addTrip() {
    if (onBoard() == "trip-draw") {
      toggleDrawMod();
      setCurrentStep(DrawTripStep.initial);
    } else {
      deselectAllPoints();
      deselectAllTrips();
      toggleDrawMod();

      setCurrentStep(DrawTripStep.schoolSelection);
      displayAddTripMessage();
    }
  }

  function onInputSearch(key: string) {
    setSearchKeyword(key);
  }

  function onClickUpdateLine() {
    console.log("update line");
  }

  function onClickDeleteLine() {
    setRemoveConfirmation({
      textToDisplay: "Êtes-vous sûr de vouloir supprimer la line : ",
      itemName: props.line ? props.line.name ?? "Undefined" : "Undefined",
      validate: DeleteLine,
    });
  }

  async function DeleteLine() {
    const responseId: number = await BusLineService.delete(
      props.line.id as number
    );
    if (!responseId) return false;
    setLines(getLines().filter((line) => line.id != responseId));
    changeBoard("line");
    return true;
  }

  return (
    <section>
      <header class="trips-board-header">
        <div class="flex justify-between">
          <BoardTitle
            title={
              props.line != undefined
                ? props.line.name ?? "Undefined"
                : "Undefined"
            }
          />

          <div class="actions flex gap-5 items-center">
            <ButtonIcon icon={<TrashIcon />} onClick={onClickDeleteLine} />
            <ButtonIcon icon={<PencilIcon />} onClick={onClickUpdateLine} />
          </div>
        </div>
        <div class="trips-board-header-infos">
          <p>Total des trips: {getTrips().length}</p>
          <ButtonIcon icon={<PlusIcon />} onClick={addTrip} />
        </div>

        <InputSearch onInput={onInputSearch} />
      </header>

      <TripsList trips={filteredTrips()} />
    </section>
  );
}