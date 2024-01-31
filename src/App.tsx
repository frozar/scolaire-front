import { Match, Show, Switch, createEffect, on, onMount } from "solid-js";
import { useStateGui } from "./StateGui";

import Layout from "./views/layout/component/template/Layout";

import SpinningWheel from "./component/SpinningWheel";
import InnerModal from "./component/molecule/InnerModal";
import { getAuthenticatedUser } from "./signaux";
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
import { Dialogs } from "./views/content/board/component/organism/Dialogs";
import { calendars } from "./views/content/calendar/calendar.manager";
import { Parameter } from "./views/content/calendar/template/Organisation";

const [, { getSelectedMenu, setSelectedMenu, getActiveMapId }] = useStateGui();

export default () => {
  setSelectedMenu("dashboard");
  onMount(async () => await tryConnection());

  // This line is to disable right click menu, necessary to remove point in line under construction with the right click
  createEffect(() =>
    document.addEventListener("contextmenu", (e) => e.preventDefault())
  );

  createEffect(
    on(getSelectedMenu, async () => {
      console.log("selected menu:", getSelectedMenu(), getActiveMapId());

      if (getActiveMapId() && getSelectedMenu() != "dashboard") {
        if (calendars().length > 0) return;
        else await InitService.getAll();
      }
    })
  );

  createEffect(() => {
    if (getSelectedMenu() != "graphicage") {
      setPointsReady(false);
    }
  });

  const logged = () => (getAuthenticatedUser() ? true : false);

  const inGraphicage = () =>
    getSelectedMenu() == "graphicage" ||
    getSelectedMenu() == "schools" ||
    getSelectedMenu() == "stops";

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

              <Match when={getSelectedMenu() == "parametres"}>
                <Parameter />
              </Match>

              <Match when={inGraphicage()}>
                <Map />
                <ContextManager />
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
