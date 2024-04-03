import { Match, Switch } from "solid-js";
import { MapBoardTags } from "../../_component/template/MapBoardManager";
import { LineAdd } from "./LineAdd";
import { LineDetails } from "./LineDetails";
import { Lines } from "./Lines";
import { LineEdit } from "./LineEdit";

export function LinesBoardManager(props: { board: MapBoardTags }) {
  return (
    <Switch>
      <Match when={props.board == "lines"}>
        <Lines />
      </Match>
      <Match when={props.board == "line-details"}>
        <LineDetails />
      </Match>
      <Match when={props.board == "line-add"}>
        <LineAdd />
      </Match>
      <Match when={props.board == "line-edit"}>
        <LineEdit />
      </Match>
    </Switch>
  );
}
