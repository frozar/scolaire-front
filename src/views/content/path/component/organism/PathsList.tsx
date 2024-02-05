import { For } from "solid-js";
import { LineType } from "../../../../../_entities/line.entity";
import { PathItem } from "../molecule/PathItem";

interface PathsProps {
  line: LineType;
}

export function Paths(props: PathsProps) {
  const paths = () => props.line?.paths ?? [];
  return (
    <div class="line-list-content">
      <For each={paths()}>
        {(path) => <PathItem path={path} lineId={props.line.id as number} />}
      </For>
    </div>
  );
}
