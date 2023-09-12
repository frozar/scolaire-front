import { Match, Switch, createEffect, createSignal } from "solid-js";

import SchoolsBoard from "../../../schools/component/organism/SchoolBoard";
import SchoolDetails from "../../../schools/component/organism/SchoolDetails";
import DrawModeBoardContent from "../organism/DrawModeBoardContent";
import InformationBoardLayout from "./InformationBoardLayout";
import InformationContent from "./InformationContent";

//TODO utiliser ou supprimer "schools" et "stops"
export type BoardsType =
  | "schools"
  | "school-details"
  | "scool-class"
  | "stops"
  | "draw-line"
  | "line";

export const [isInDrawMod, setIsDrawMod] = createSignal<boolean>(false);
export const toggleDrawMod = () => setIsDrawMod((bool) => !bool);

export const [onBoard, setOnBoard] = createSignal<BoardsType>("line");
export const changeBoard = (boardName: BoardsType) => setOnBoard(boardName);

export default function () {
  createEffect(() => {
    if (isInDrawMod()) {
      changeBoard("draw-line");
    } else {
      changeBoard("line");
    }
  });

  return (
    <section>
      <InformationBoardLayout>
        <Switch>
          <Match when={onBoard() == "line"}>
            <InformationContent />
          </Match>
          <Match when={onBoard() == "draw-line"}>
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
          <Match when={onBoard() == "stops"}>Liste des arrêts</Match>
        </Switch>
      </InformationBoardLayout>
    </section>
  );
}
