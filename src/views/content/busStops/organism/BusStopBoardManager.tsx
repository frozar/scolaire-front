import { Match, Switch } from "solid-js";
import { MapBoardTags } from "../../_component/template/MapBoardManager";
import { BusStopAdd } from "./BusStopAdd";

export function BusStopBoardManager(props: { board: MapBoardTags }) {
  return (
    <Switch>
      <Match when={props.board == "bus-stop-add"}>
        <BusStopAdd />
      </Match>
    </Switch>
  );
}
