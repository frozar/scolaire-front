import { Match, Switch, createEffect, createSignal } from "solid-js";

import SchoolsBoard from "../../../schools/component/organism/SchoolBoard";
import SchoolDetails from "../../../schools/component/organism/SchoolDetails";
import StopBoard from "../../../stops/component/organism/StopBoard";
import StopDetails from "../../../stops/component/organism/StopDetails";
import { BusLineInformationBoardContent } from "../organism/BusLineInformationBoardContent";
import DrawModeBoardContent from "../organism/DrawModeBoardContent";
import LinesBoard from "../organism/LinesBoard";
import InformationBoardLayout from "./InformationBoardLayout";

//TODO utiliser ou supprimer "schools" et "stops"
export type BoardTags =
  | "schools"
  | "school-details"
  | "school-class"
  | "stops"
  | "stop-details"
  | "line-draw"
  | "line"
  | "line-details";

export const [isInDrawMod, setIsDrawMod] = createSignal<boolean>(false);
export const toggleDrawMod = () => setIsDrawMod((bool) => !bool);

export const [onBoard, setOnBoard] = createSignal<BoardTags>("line");
export const changeBoard = (boardName: BoardTags) => setOnBoard(boardName);

export default function () {
  createEffect(() => {
    if (isInDrawMod()) {
      changeBoard("line-draw");
    } else {
      changeBoard("line");
    }
  });

  return (
    <section>
      <InformationBoardLayout>
        <Switch>
          <Match when={onBoard() == "line"}>
            <LinesBoard />
          </Match>
          <Match when={onBoard() == "line-draw"}>
            <DrawModeBoardContent />
          </Match>

          {/* Schools */}
          <Match when={onBoard() == "schools"}>
            <SchoolsBoard />
          </Match>

          <Match when={onBoard() == "school-details"}>
            <SchoolDetails />
          </Match>

          {/* Stops */}
          <Match when={onBoard() == "stops"}>
            <StopBoard />
          </Match>

          <Match when={onBoard() == "stop-details"}>
            <StopDetails />
          </Match>

          <Match when={onBoard() == "line-details"}>
            <BusLineInformationBoardContent />
          </Match>
        </Switch>
      </InformationBoardLayout>
    </section>
  );
}
