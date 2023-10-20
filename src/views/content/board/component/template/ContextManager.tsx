import { Match, Switch, createEffect, createSignal } from "solid-js";

import { LineType } from "../../../../../_entities/line.entity";
import { getSelectedLine } from "../../../map/component/organism/BusLines";
import ClasseBoard from "../../../schools/component/organism/ClasseBoard";
import SchoolsBoard from "../../../schools/component/organism/SchoolBoard";
import SchoolDetails from "../../../schools/component/organism/SchoolDetails";
import StopBoard from "../../../stops/component/organism/StopBoard";
import StopDetails from "../../../stops/component/organism/StopDetails";
import AddLineBoardContent from "../organism/AddLineBoardContent";
import BusLinesBoard from "../organism/BusLinesBoard";
import { DrawTripBoard } from "../organism/DrawTripBoard";
import { TripBoard } from "../organism/TripBoard";
import { TripsBoard } from "../organism/TripsBoard";
import InformationBoardLayout from "./InformationBoardLayout";

//TODO utiliser ou supprimer "schools" et "stops"
export type BoardTags =
  | "schools"
  | "school-details"
  | "school-class-add"
  | "school-class-modify"
  | "stops"
  | "stop-details"
  | "trip"
  | "trip-draw"
  | "line"
  | "line-add"
  | "line-details"
  | undefined;

export const [isInDrawMod, setIsDrawMod] = createSignal<boolean>(false);
export const toggleDrawMod = () => setIsDrawMod((bool) => !bool);

export const [onBoard, setOnBoard] = createSignal<BoardTags>("line");
export const changeBoard = (boardName: BoardTags) => setOnBoard(boardName);

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
      <InformationBoardLayout>
        <Switch>
          <Match when={onBoard() == "line"}>
            {/* <TripsBoard /> */}
            <BusLinesBoard />
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
              onBoard() == "school-class-add" ||
              onBoard() == "school-class-modify"
            }
          >
            <ClasseBoard />
          </Match>

          {/* Stops */}
          <Match when={onBoard() == "stops"}>
            <StopBoard />
          </Match>

          <Match when={onBoard() == "stop-details"}>
            <StopDetails />
          </Match>

          <Match when={onBoard() == "line-details"}>
            <TripBoard />
          </Match>
        </Switch>
      </InformationBoardLayout>
    </section>
  );
}
