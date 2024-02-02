import { For } from "solid-js";
import { PathType } from "../../../../../_entities/path.entity";
import { PathTimeLineItem } from "../molecule/PathTimeLineItem";

import { PathUtil } from "../../../../../utils/path.utils";
import "./PathTimeLine.css";

interface PathLineProps {
  path: PathType;
}

export function PathTimeLine(props: PathLineProps) {
  // * process each point to get neccessary informations like name, calculated quantity, time passage, quantity to get or drop
  // * then save each processed point in new array
  // ! reactivity is important

  const points = () =>
    props.path.points.map((point) => PathUtil.getPathPoint(point));

  return (
    <div class="path-timeline">
      <For each={points()}>
        {(point) => (
          <PathTimeLineItem
            name={point.name}
            calculated={5}
            quantity={5}
            timePassage="8:00"
            lineColor={props.path.color}
            pointNature={point.nature}
          />
        )}
      </For>
    </div>
  );
}
