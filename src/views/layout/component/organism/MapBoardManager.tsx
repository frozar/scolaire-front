import { Match, Switch, createSignal } from "solid-js";
import DrawModeBoardContent from "../../../content/map/component/organism/DrawModeBoardContent";
import InformationContent from "../../../content/map/informationBoard/InformationContent";
type SubMapBoard = "selected-informations" | "draw-line" | "nothing";

export const [onSubMapBoard, setOnSubMapBoard] =
  createSignal<SubMapBoard>("nothing");

/**
 * This function is used in:
 *   - BusLine.tsx : onClick() like changeSubMapBoard("selected-informations")
 *   - Point.tsx : onClick()   like changeSubMapBoard("selected-informations")
 *   - DrawModeBoardContent.tsx : nextStep() like changeSubMapBoard("selected-informations", true)*
 *      - in DrawModeBoardContent it is used at the end of create/editing steps
 * @param boardName
 * @param showLine
 * @returns
 */

export const changeSubMapBoard = (boardName: SubMapBoard, showLine = false) => {
  if (onSubMapBoard() == "draw-line" && showLine) {
    setOnSubMapBoard("selected-informations");
    return;
  }

  if (onSubMapBoard() == "draw-line" && boardName == "selected-informations") {
    return;
  }
  setOnSubMapBoard(boardName);
};

export default function (props: { subBoard: SubMapBoard }) {
  return (
    <Switch>
      <Match when={props.subBoard == "nothing"}>Aucun item sélectionner</Match>
      <Match when={props.subBoard == "selected-informations"}>
        <InformationContent />
      </Match>
      <Match when={props.subBoard == "draw-line"}>
        <DrawModeBoardContent />
      </Match>
    </Switch>
  );
}
