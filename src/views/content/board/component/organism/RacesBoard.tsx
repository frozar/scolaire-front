import { createSignal } from "solid-js";
import { LineType } from "../../../../../_entities/line.entity";
import { BusLineService } from "../../../../../_services/line.service";
import PencilIcon from "../../../../../icons/PencilIcon";
import PlusIcon from "../../../../../icons/PlusIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import { displayAddRaceMessage } from "../../../../../userInformation/utils";
import { getLines, setLines } from "../../../map/component/organism/BusLines";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import {
  deselectAllRaces,
  getRaces,
} from "../../../map/component/organism/Races";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import { RacesList } from "../../../schools/component/organism/RacesList";
import BoardTitle from "../atom/BoardTitle";
import ButtonIcon from "../molecule/ButtonIcon";
import {
  changeBoard,
  onBoard,
  toggleDrawMod,
} from "../template/ContextManager";
import { DrawRaceStep, setCurrentStep } from "./DrawRaceBoard";
import "./RacesBoard.css";

export function RacesBoard(props: { line: LineType }) {
  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  const filteredRaces = () =>
    getRaces().filter((line) => line.name?.includes(searchKeyword()));

  function addRace() {
    if (onBoard() == "race-draw") {
      toggleDrawMod();
      setCurrentStep(DrawRaceStep.initial);
    } else {
      deselectAllPoints();
      deselectAllRaces();
      toggleDrawMod();

      setCurrentStep(DrawRaceStep.schoolSelection);
      displayAddRaceMessage();
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
      <header class="races-board-header">
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
        <div class="races-board-header-infos">
          <p>Total des courses: {getRaces().length}</p>
          <ButtonIcon icon={<PlusIcon />} onClick={addRace} />
        </div>

        <InputSearch onInput={onInputSearch} />
      </header>

      <RacesList races={filteredRaces()} />
    </section>
  );
}
