import { Match, Switch } from "solid-js";
import { MapBoardTags } from "../../../_component/template/MapBoardManager";
import { StopAdd } from "./StopAdd";
import { StopDetails } from "./StopDetails";
import { Stops } from "./Stops";

export function StopsBoardManager(props: { board: MapBoardTags }) {
  return (
    <Switch>
      <Match when={props.board == "stops"}>
        <Stops />
      </Match>
      <Match when={props.board == "stop-details"}>
        <StopDetails />
      </Match>
      <Match when={props.board == "stop-add"}>
        <StopAdd />
      </Match>
    </Switch>
  );
}
