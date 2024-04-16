import { Match, Show, Switch, createEffect, createSignal } from "solid-js";

import { DrawTripBoard } from "../organism/DrawTripBoard";
import InformationBoardLayout from "./InformationBoardLayout";

// TODO retirer le type "undefined" du type "BoardTags" : c'est une erreur de conception
//      le type "BoardTags" doit indiquer quel board est en train d'être utilisé.
// TODO utiliser ou supprimer "schools" et "stops"
export type BoardTags =
  | "schools"
  | "school-details"
  | "school-grade-details"
  | "school-grade-add"
  | "school-grade-edit"
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

//TODO toDelete
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
            <Match when={onBoard() == "trip-draw"}>
              <DrawTripBoard />
            </Match>
          </Switch>
        </InformationBoardLayout>
      </Show>
    </section>
  );
}
