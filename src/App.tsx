import { Match, Show, Switch, createEffect, onMount } from "solid-js";
import { useStateGui } from "./StateGui";

import Layout from "./views/layout/component/template/Layout";

import SpinningWheel from "./component/SpinningWheel";
import InnerModal from "./component/molecule/InnerModal";
import {
  authenticated,
  disableSpinningWheel,
  enableSpinningWheel,
  getAuthenticatedUser,
} from "./signaux";
import ClearConfirmationDialogBox from "./userInformation/ClearConfirmationDialogBox";
import DisplayUserInformation from "./userInformation/DisplayUserInformation";
import DragAndDropSummary from "./userInformation/DragAndDropSummary";
import GeneratorDialogBox from "./userInformation/GeneratorDialogBox";
import RemoveConfirmation from "./userInformation/RemoveConfirmation";
import ContextManager from "./views/content/board/component/template/ContextManager";
import { Calendar } from "./views/content/calendar/template/Calendar";
import Dashboard from "./views/content/dashboard/Dashboard";
import Map from "./views/content/map/Map";
import { setPointsReady } from "./views/content/map/component/organism/Points";
import ExportConfirmationDialogBox from "./views/content/map/rightMapMenu/export/ExportConfirmationDialogBox";
import { tryConnection } from "./views/layout/authentication";

import "./App.css";
import { InitService } from "./_services/init.service";
import UnloggedUserInformation from "./component/molecule/UnloggedUserInformation";
import UserInstruction from "./component/molecule/UserInstruction";
import { Allotment } from "./views/content/allotment/organism/Allotment";
import { Dialogs } from "./views/content/board/component/organism/Dialogs";
import { Bus } from "./views/content/bus/organism/Bus";
import { Users } from "./views/content/calendar/template/Organisation";
import { Settings } from "./views/content/parameters/organism/Settings";
import { ServiceTemplate } from "./views/content/service/template/ServiceTemplate";

const [, { getSelectedMenu, setSelectedMenu, getActiveMapId }] = useStateGui();

export default () => {
  setSelectedMenu("dashboard");
  onMount(async () => await tryConnection());

  // This line is to disable right click menu, necessary to remove point in line under construction with the right click
  createEffect(() =>
    document.addEventListener("contextmenu", (e) => e.preventDefault())
  );

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (getActiveMapId() && authenticated()) {
      enableSpinningWheel();
      await InitService.getAll();
      disableSpinningWheel();
    }
  });

  createEffect(() => {
    if (getSelectedMenu() != "graphicage") {
      setPointsReady(false);
    }
  });

  const logged = () => (getAuthenticatedUser() ? true : false);

  const inGraphicage = () =>
    ["graphicage", "schools", "stops"].includes(getSelectedMenu());

  return (
    <div>
      <Layout>
        <div id="layout-content">
          <Show when={getAuthenticatedUser()}>
            <Switch>
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

              <Match when={getSelectedMenu() == "bus"}>
                <Bus />
              </Match>

              <Match when={getSelectedMenu() == "allotment"}>
                <Allotment />
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

        {/* <InformationBoardLayout>
              <InformationBoard />
            </InformationBoardLayout> */}
        {/* </Match>

          <Match when={getSelectedMenu() == "etablissements"}>
            <SchoolsBoard />
          </Match>

          <Match when={getSelectedMenu() == "ramassages"}>
            <Ramassage />
          </Match>
        </Switch> */}

        <DisplayUserInformation />
        <DragAndDropSummary />
        <ClearConfirmationDialogBox />
        <ExportConfirmationDialogBox />
        <GeneratorDialogBox />
        <RemoveConfirmation />
        <Dialogs />
      </Layout>
      <SpinningWheel />
    </div>
  );
};
