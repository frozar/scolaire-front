import { Match, Show, Switch } from "solid-js";
import { useStateGui } from "../../StateGui";
import InnerModal from "../../component/molecule/InnerModal";
import UnloggedUserInformation from "../../component/molecule/UnloggedUserInformation";
import UserInstruction from "../../component/molecule/UserInstruction";
import { getAuthenticatedUser } from "../../signaux";
import { MapBoardManager } from "./_component/template/MapBoardManager";
import { MapContainer } from "./_component/template/MapContainer";
import ContextManager from "./board/component/template/ContextManager";
import InformationBoardLayout from "./board/component/template/InformationBoardLayout";
import { Calendar } from "./calendar/template/Calendar";
import { Users } from "./calendar/template/Organisation";
import Map from "./map/Map";
import { Maps } from "./maps/Maps";
import { Market } from "./market/organism/Market";
import { Settings } from "./parameters/organism/Settings";
import { ServiceTemplate } from "./service/template/ServiceTemplate";
import WayDetails from "./stops/component/organism/WayDetails";

const [, { getSelectedMenu }] = useStateGui();

export function Contents() {
  //TODO to refacto -> refacto ContextManager
  const isMapView = () => ["graphicage", "schools"].includes(getSelectedMenu());

  const mapView = () => ["dashboard", "stops"].includes(getSelectedMenu());

  const logged = () => (getAuthenticatedUser() ? true : false);

  return (
    <div id="layout-content">
      <Show when={getAuthenticatedUser()}>
        <Switch>
          <Match when={getSelectedMenu() == "maps"}>
            <Maps />
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

          <Match when={mapView()}>
            <MapContainer />
            <MapBoardManager />
          </Match>

          <Match when={isMapView()}>
            <Map />
            <ContextManager />
          </Match>

          <Match when={getSelectedMenu() == "parametres"}>
            <Settings />
          </Match>

          <Match when={getSelectedMenu() == "voirie"}>
            <Map />

            <InformationBoardLayout>
              <WayDetails />
            </InformationBoardLayout>
            {/* <ContextManager /> */}
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
