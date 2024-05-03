import { For } from "solid-js";
import { PathType } from "../../../../_entities/road.entity";
import { RoadListItem } from "../molecule/RoadListItem";

interface RoadListProps {
  roads: PathType[];
}

export function RoadList(props: RoadListProps) {
  return (
    <For each={props.roads}>
      {(item) => {
        return <RoadListItem road={item} />;
      }}
    </For>
  );
}
