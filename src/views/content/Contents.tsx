import { Match, Show, Switch } from "solid-js";
import { useStateGui } from "../../StateGui";
import { authenticated } from "../../_stores/authenticated-user.store";
import InnerModal from "../../component/molecule/InnerModal";
import UnloggedUserInformation from "../../component/molecule/UnloggedUserInformation";
import UserInstruction from "../../component/molecule/UserInstruction";
import { MapBoardManager } from "./_component/template/MapBoardManager";
import { MapContainer } from "./_component/template/MapContainer";
import ContextManager from "./board/component/template/ContextManager";
import InformationBoardLayout from "./board/component/template/InformationBoardLayout";
import { Calendar } from "./calendar/template/Calendar";
import Map from "./map/Map";
import { Maps } from "./maps/Maps";
import { Market } from "./market/organism/Market";
import { OrganizationAdd } from "./organization/template/OrganizationAdd";
import { OrganizationDetails } from "./organization/template/OrganizationDetails";
import { OrganizationMembers } from "./organization/template/OrganizationMembers";
import { Organizations } from "./organization/template/Organizations";
import { Settings } from "./parameters/organism/Settings";
import { ServiceTemplate } from "./service/template/ServiceTemplate";
import AddPonderationWithConflictConfirmation from "./stops/component/organism/AddPonderationWithConflictConfirmation";
import Roadways, {
  displayedUpdateRoadwaysConfirmation,
} from "./stops/component/organism/Roadways";

const [, { getSelectedMenu }] = useStateGui();

export function Contents() {
  //TODO to refacto -> refacto ContextManager
  const isMapView = () => ["graphicage"].includes(getSelectedMenu());

  const mapView = () =>
    ["dashboard", "stops", "schools", "paths", "lines"].includes(
      getSelectedMenu()
    );

  return (
    <div id="layout-content">
      <Show when={authenticated()}>
        <Switch>
          <Match when={getSelectedMenu() == "maps"}>
            <Maps />
          </Match>

          <Match when={getSelectedMenu() == "calendar"}>
            <Calendar />
          </Match>

          <Match when={getSelectedMenu() == "organizations"}>
            <Organizations />
          </Match>

          <Match when={getSelectedMenu() == "organization-add"}>
            <OrganizationAdd />
          </Match>

          <Match when={getSelectedMenu() == "organization-users"}>
            <OrganizationMembers />
          </Match>

          <Match when={getSelectedMenu() == "organization-details"}>
            <OrganizationDetails />
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

          <Match when={getSelectedMenu() == "roadways"}>
            <Map />

            <InformationBoardLayout>
              <Show when={displayedUpdateRoadwaysConfirmation().display}>
                <AddPonderationWithConflictConfirmation
                // carteToDelete={displayedDeleteMapConfirmation()}
                />
              </Show>
              <Roadways />
            </InformationBoardLayout>
            {/* <ContextManager /> */}
          </Match>
        </Switch>
      </Show>

      <InnerModal show={!authenticated()}>
        <div class="flex h-full w-full items-center justify-center">
          <UnloggedUserInformation />
        </div>
      </InnerModal>

      <UserInstruction />
    </div>
  );
}
