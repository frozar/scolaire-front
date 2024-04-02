import { Match, Switch } from "solid-js";
import { MapBoardTags } from "../../_component/template/MapBoardManager";
import { Lines } from "./Lines";

export function LinesBoardManager(props: { board: MapBoardTags }) {
  return (
    <Switch>
      <Match when={props.board == "lines"}>
        <Lines />
      </Match>
    </Switch>
  );
}
