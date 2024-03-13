import { Match, Switch } from "solid-js";
import { MapBoardTags } from "../../_component/template/MapBoardManager";
import { Paths } from "../../paths/template/Paths";
import { Dashboard } from "./Dashboard";

export function DashboardBoardManager(props: { board: MapBoardTags }) {
  return (
    <Switch>
      <Match when={props.board == "dashboard"}>
        <Dashboard />
      </Match>
      <Match when={props.board == "paths"}>
        <Paths />
      </Match>
    </Switch>
  );
}
