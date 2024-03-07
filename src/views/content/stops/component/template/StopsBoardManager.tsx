import { Match, Switch } from "solid-js";
import { MapBoardTags } from "../../../_component/template/MapBoardManager";
import { Stops } from "./Stops";
import { StopDetails } from "./StopDetails";

export function StopsBoardManager(props: { board: MapBoardTags }) {
  return (
    <Switch>
      <Match when={props.board == "stops"}>
        <Stops />
      </Match>
      <Match when={props.board == "stop-details"}>
        <StopDetails />
      </Match>
    </Switch>
  );
}
