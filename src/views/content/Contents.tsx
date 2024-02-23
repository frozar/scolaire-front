import { Match, Show, Switch } from "solid-js";
import { useStateGui } from "../../StateGui";
import InnerModal from "../../component/molecule/InnerModal";
import UnloggedUserInformation from "../../component/molecule/UnloggedUserInformation";
import UserInstruction from "../../component/molecule/UserInstruction";
import { getAuthenticatedUser } from "../../signaux";
import ContextManager from "./board/component/template/ContextManager";
import { Calendar } from "./calendar/template/Calendar";
import { Users } from "./calendar/template/Organisation";
import Dashboard from "./dashboard/Dashboard";
import Map from "./map/Map";
import { Maps } from "./maps/Maps";
import { Market } from "./market/organism/Market";
import { Settings } from "./parameters/organism/Settings";
import { ServiceTemplate } from "./service/template/ServiceTemplate";

const [, { getSelectedMenu }] = useStateGui();

export function Contents() {
  const inGraphicage = () =>
    ["graphicage", "schools", "stops"].includes(getSelectedMenu());

  const logged = () => (getAuthenticatedUser() ? true : false);

  return (
    <div id="layout-content">
      <Show when={getAuthenticatedUser()}>
        <Switch>
          <Match when={getSelectedMenu() == "maps"}>
            <Maps />
          </Match>
          <Match when={getSelectedMenu() == "dashboard"}>
            <Dashboard />
          </Match>

          <Match when={getSelectedMenu() == "calendar"}>
            <Calendar />
          </Match>

          <Match when={getSelectedMenu() == "users"}>
            <Users />
          </Match>

          <Match when={getSelectedMenu() == "service"}>
            <ServiceTemplate />
          </Match>

          <Match when={getSelectedMenu() == "market"}>
            <Market />
          </Match>

          <Match when={inGraphicage()}>
            <Map />
            <ContextManager />
          </Match>

          <Match when={getSelectedMenu() == "parametres"}>
            <Settings />
          </Match>
        </Switch>
      </Show>

      <InnerModal show={!logged()}>
        <div class="flex h-full w-full items-center justify-center">
          <UnloggedUserInformation />
        </div>
      </InnerModal>

      <UserInstruction />
    </div>
  );
}