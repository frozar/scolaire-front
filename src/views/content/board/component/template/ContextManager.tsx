import { Match, Switch, createEffect, createSignal } from "solid-js";

import SchoolsBoard from "../../../schools/component/organism/SchoolBoard";
import DrawModeBoardContent from "../organism/DrawModeBoardContent";
import InformationBoardLayout from "./InformationBoardLayout";
import InformationContent from "./InformationContent";

//TODO utiliser ou supprimer "schools" et "stops"
export type BoardsType = "schools" | "stops" | "draw-line" | "line";

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
          <Match when={onBoard() == "schools"}>
            <SchoolsBoard />
          </Match>
          <Match when={onBoard() == "stops"}>Liste des arrêts</Match>
        </Switch>
      </InformationBoardLayout>
    </section>
  );
}
