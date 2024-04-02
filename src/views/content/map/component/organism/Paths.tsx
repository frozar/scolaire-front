import { For } from "solid-js";
import { PathEntity, PathType } from "../../../../../_entities/path.entity";
import { onBoard } from "../../../board/component/template/ContextManager";
import {
  DrawPathStep,
  currentDrawPath,
  onDrawPathStep,
} from "../../../path/component/drawPath.utils";
import { selectedPath } from "../../../path/component/organism/PathDetail";
import { Trip } from "../molecule/Trip";

//TODO toDelete
export function Paths(props: { map: L.Map }) {
  function pathFilter(): PathType[] {
    switch (onBoard()) {
      case "path-draw":
        if (onDrawPathStep() == DrawPathStep.editPath)
          return [currentDrawPath() ?? PathEntity.defaultPath()];
        else return [];

      // case "trip":
      //   if (onTripBoardPanel() == TripBoardPanels.paths)
      //     return getSelectedLine()?.paths ?? [];
      //   else return [];

      case "path-details":
        return [selectedPath()] as PathType[];

      default:
        return [];
    }
  }
  return (
    <For each={pathFilter()}>
      {(path) => <Trip path={path} map={props.map} />}
    </For>
  );
}
