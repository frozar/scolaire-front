import { Match, Switch } from "solid-js";
import { MapBoardTags } from "../../_component/template/MapBoardManager";
import { TripDetails } from "./TripDetails";

export function TripsBoardManager(props: { board: MapBoardTags }) {
  return (
    <Switch>
      <Match when={props.board == "trip-details"}>
        <TripDetails />
      </Match>
    </Switch>
  );
}
