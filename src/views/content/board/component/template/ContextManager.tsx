import { Match, Show, Switch, createEffect, createSignal } from "solid-js";

import { LineType } from "../../../../../_entities/line.entity";
import { getSelectedLine } from "../../../map/component/organism/BusLines";
import { PathDetail } from "../../../path/component/organism/PathDetail";
import { GradeBoardDetails } from "../../../schools/component/organism/GradeBoardDetails";
import { GradeEditBoard } from "../../../schools/component/organism/GradeEditBoard";
import SchoolsBoard from "../../../schools/component/organism/SchoolBoard";
import SchoolDetails from "../../../schools/component/organism/SchoolDetails";
import AddLineBoardContent from "../organism/AddLineBoardContent";
import BusLinesBoard from "../organism/BusLinesBoard";
import { DrawTripBoard } from "../organism/DrawTripBoard";
import { TripBoard } from "../organism/TripBoard";
import { TripsBoard } from "../organism/TripsBoard";
import InformationBoardLayout from "./InformationBoardLayout";

// TODO retirer le type "undefined" du type "BoardTags" : c'est une erreur de conception
//      le type "BoardTags" doit indiquer quel board est en train d'être utilisé.
// TODO utiliser ou supprimer "schools" et "stops"
export type BoardTags =
  | "schools"
  | "school-details"
  | "school-grade-details"
  | "school-grade-add"
  | "school-grade-modify"
  | "stops"
  | "stop-details"
  | "trip"
  | "trip-draw"
  | "line"
  | "line-add"
  | "line-details"
  | "path-details"
  | "path-draw"
  | "dashboard"
  | undefined;

export const [isInDrawMod, setIsDrawMod] = createSignal<boolean>(false);
export const toggleDrawMod = () => setIsDrawMod((bool) => !bool);

export const [onBoard, setOnBoard] = createSignal<BoardTags>(undefined);
export const changeBoard = (boardName: BoardTags) => setOnBoard(boardName);

//TODO rebaptiser MapBoardManager à placer dans content/_component
export default function () {
  createEffect(() => {
    if (isInDrawMod()) {
      switch (onBoard()) {
        case "trip": {
          changeBoard("trip-draw");
          break;
        }
        case "line": {
          changeBoard("line-add");
          break;
        }
      }
    } else {
      // setOnBoard((prev) => {
      //   return prev == "trip-draw" ? "line" : prev;
      // });
    }
  });

  return (
    <section>
      <Show when={onBoard()}>
        <InformationBoardLayout>
          <Switch>
            <Match when={onBoard() == "line"}>
              {/* <TripsBoard /> */}
              <BusLinesBoard />
            </Match>

            <Match when={onBoard() == "line-details"}>
              <TripBoard />
            </Match>

            <Match when={onBoard() == "line-add"}>
              {/* <TripsBoard /> */}
              <AddLineBoardContent />
            </Match>

            <Match when={onBoard() == "trip"}>
              <TripsBoard line={getSelectedLine() as LineType} />
            </Match>
            <Match when={onBoard() == "trip-draw"}>
              <DrawTripBoard />
            </Match>

            {/* Schools */}
            <Match when={onBoard() == "schools"}>
              <SchoolsBoard />
            </Match>

            <Match when={onBoard() == "school-details"}>
              <SchoolDetails />
            </Match>

            <Match
              when={
                onBoard() == "school-grade-add" ||
                onBoard() == "school-grade-modify"
              }
            >
              <GradeEditBoard />
            </Match>

            <Match when={onBoard() == "school-grade-details"}>
              <GradeBoardDetails />
            </Match>

            <Match when={onBoard() == "path-details"}>
              <PathDetail />
            </Match>
          </Switch>
        </InformationBoardLayout>
      </Show>
    </section>
  );
}
