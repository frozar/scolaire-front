import { Match, Switch, createSignal } from "solid-js";
import { LineType } from "../../../../../_entities/line.entity";
import { BusLineService } from "../../../../../_services/line.service";
import { getLines, setLines } from "../../../../../_stores/line.store";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import { getTrips } from "../../../map/component/organism/Trips";
import { PathsList } from "../../../path/component/organism/PathsList";
import InputSearch from "../../../schools/component/molecule/InputSearch";
import { TripsList } from "../../../schools/component/organism/TripsList";
import BoardTitle from "../atom/BoardTitle";
import ButtonIcon from "../molecule/ButtonIcon";
import { changeBoard } from "../template/ContextManager";
import { TripBoardPanelButtons } from "./TripBoardPanelButtons";
import "./TripsBoard.css";

export enum TripBoardPanels {
  trips,
  paths,
}

export const [onTripBoardPanel, setOnTripBoardPanel] =
  createSignal<TripBoardPanels>(TripBoardPanels.trips);

export function TripsBoard(props: { line: LineType }) {
  const [searchKeyword, setSearchKeyword] = createSignal<string>("");

  const filteredTrips = () =>
    getTrips().filter((line) => line.name?.includes(searchKeyword()));

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
            <ButtonIcon
              icon={<PencilIcon />}
              onClick={onClickUpdateLine}
              disable={true}
            />
          </div>
        </div>
        <div class="trips-board-header-infos">
          <p>Nombre de courses: {getTrips().length}</p>
        </div>

        <InputSearch onInput={onInputSearch} />
      </header>

      <TripBoardPanelButtons />

      <Switch>
        <Match when={onTripBoardPanel() == TripBoardPanels.trips}>
          <TripsList trips={filteredTrips()} />
        </Match>
        <Match when={onTripBoardPanel() == TripBoardPanels.paths}>
          <PathsList line={props.line} />
        </Match>
      </Switch>
    </section>
  );
}
