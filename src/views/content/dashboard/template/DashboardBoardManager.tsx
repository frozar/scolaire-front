import { Match, Switch } from "solid-js";
import { MapBoardTags } from "../../_component/template/MapBoardManager";
import { Dashboard } from "./Dashboard";

export function DashboardBoardManager(props: { board: MapBoardTags }) {
  // console.log("blbibi");

  return (
    <Switch>
      <Match when={props.board == "dashboard"}>
        <Dashboard />
      </Match>
    </Switch>
  );
}
