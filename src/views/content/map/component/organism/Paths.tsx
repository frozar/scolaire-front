import { For } from "solid-js";
import { PathEntity, PathType } from "../../../../../_entities/path.entity";
import {
  TripBoardPanels,
  onTripBoardPanel,
} from "../../../board/component/organism/TripsBoard";
import { onBoard } from "../../../board/component/template/ContextManager";
import {
  DrawPathStep,
  currentDrawPath,
  onDrawPathStep,
} from "../../../path/component/drawPath.utils";
import { selectedPath } from "../../../path/component/organism/PathDetail";
import { Trip } from "../molecule/Trip";
import { getSelectedLine } from "./BusLines";

export function Paths(props: { map: L.Map }) {
  function pathFilter(): PathType[] {
    // * display only 1 path
    if (onDrawPathStep() == DrawPathStep.editPath)
      return [currentDrawPath() ?? PathEntity.defaultPath()];

    // * display path list of the line
    if (onBoard() == "trip" && onTripBoardPanel() == TripBoardPanels.paths)
      return getSelectedLine()?.paths ?? [];

    if (onBoard() == "path-details") return [selectedPath()] as PathType[];
    if (onBoard() == "path-draw") return [currentDrawPath()] as PathType[];
    return [];
  }
  return (
    <For each={pathFilter()}>
      {(path) => <Trip path={path} map={props.map} />}
    </For>
  );
}
