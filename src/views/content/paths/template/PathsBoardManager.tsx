import { Match, Switch } from "solid-js";
import { MapBoardTags } from "../../_component/template/MapBoardManager";
import { PathAdd } from "./PathAdd";
import { Paths } from "./Paths";

export function PathsBoardManager(props: { board: MapBoardTags }) {
  return (
    <Switch>
      <Match when={props.board == "paths"}>
        <Paths />
      </Match>
      <Match when={props.board == "path-add"}>
        <PathAdd />
      </Match>
    </Switch>
  );
}
