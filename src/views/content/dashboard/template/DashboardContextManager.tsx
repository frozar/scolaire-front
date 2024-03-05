import { Match, Switch } from "solid-js";
import { onBoard } from "../../board/component/template/ContextManager";
import { Dashboard } from "./Dashboard";

export function DashboardContextManager() {
  return (
    <Switch>
      <Match when={onBoard() == "dashboard"}>
        <Dashboard />
      </Match>
    </Switch>
  );
}
