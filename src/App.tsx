import { Match, Switch, createEffect, onMount } from "solid-js";
import { useStateGui } from "./StateGui";

import Layout from "./views/layout/component/template/Layout";

import SpinningWheel from "./component/SpinningWheel";
import ClearConfirmationDialogBox from "./userInformation/ClearConfirmationDialogBox";
import DisplayUserInformation from "./userInformation/DisplayUserInformation";
import DragAndDropSummary from "./userInformation/DragAndDropSummary";
import GeneratorDialogBox from "./userInformation/GeneratorDialogBox";
import RemoveConfirmation from "./userInformation/RemoveConfirmation";
import ContextManager from "./views/content/board/component/template/ContextManager";
import Calendar from "./views/content/calendar/template/Calendar";
import Dashboard from "./views/content/dashboard/Dashboard";
import Map from "./views/content/map/Map";
import { setPointsReady } from "./views/content/map/component/organism/Points";
import ExportConfirmationDialogBox from "./views/content/map/rightMapMenu/export/ExportConfirmationDialogBox";
import { tryConnection } from "./views/layout/authentication";

const [, { getSelectedMenu }] = useStateGui();

export default () => {
  onMount(async () => {
    await tryConnection();
  });

  createEffect(() => {
    // This line is to disable right click menu, necessary to remove point in line under construction with the right click
    document.addEventListener("contextmenu", (e) => e.preventDefault());
  });

  createEffect(() => {
    if (getSelectedMenu() != "graphicage") {
      setPointsReady(false);
    }
  });

  return (
    <div>
      <Layout>
        <Switch>
          <Match when={getSelectedMenu() == "dashboard"}>
            <Dashboard />
          </Match>

          <Match when={getSelectedMenu() == "calendar"}>
            <Calendar />
          </Match>

          <Match when={getSelectedMenu() != "dashboard"}>
            <Map />
            <ContextManager />
          </Match>
        </Switch>

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
      </Layout>
      <SpinningWheel />
    </div>
  );
};
