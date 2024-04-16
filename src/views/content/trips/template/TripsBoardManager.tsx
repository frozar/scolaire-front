import { Match, Switch } from "solid-js";
import { MapBoardTags } from "../../_component/template/MapBoardManager";
import { TripDetails } from "./TripDetails";
import { TripEdit } from "./TripEdit";

export function TripsBoardManager(props: { board: MapBoardTags }) {
  return (
    <Switch>
      <Match when={props.board == "trip-details"}>
        <TripDetails />
      </Match>
      <Match when={props.board == "trip-edit"}>
        <TripEdit />
      </Match>
    </Switch>
  );
}
