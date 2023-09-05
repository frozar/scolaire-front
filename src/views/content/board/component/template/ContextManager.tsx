import { Match, Switch, createEffect, createSignal } from "solid-js";

import DrawModeBoardContent from "../organism/DrawModeBoardContent";
import InformationBoardLayout from "./InformationBoardLayout";
import InformationContent from "./InformationContent";

export type BoardsType =
  | "schools"
  | "stops"
  | "draw-line"
  | "selected-informations";

export const [isInDrawMod, setIsDrawMod] = createSignal<boolean>(false);
export const toggleDrawMod = () => setIsDrawMod((bool) => !bool);

export const [onBoard, setOnBoard] = createSignal<BoardsType>(
  "selected-informations"
);
export const changeBoard = (boardName: BoardsType) => setOnBoard(boardName);

export default function () {
  createEffect(() => {
    if (isInDrawMod()) {
      changeBoard("draw-line");
    } else {
      changeBoard("selected-informations");
    }
  });

  return (
    <section>
      <InformationBoardLayout>
        <Switch>
          <Match when={onBoard() == "selected-informations"}>
            <InformationContent />
          </Match>
          <Match when={onBoard() == "draw-line"}>
            <DrawModeBoardContent />
          </Match>
          <Match when={onBoard() == "schools"}>Liste des écoles</Match>
          <Match when={onBoard() == "stops"}>Liste des arrêts</Match>
        </Switch>
      </InformationBoardLayout>
    </section>
  );
}
