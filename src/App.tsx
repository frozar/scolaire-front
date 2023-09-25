import { Match, Switch, createEffect, onMount } from "solid-js";
import { useStateAction } from "./StateAction";
import { useStateGui } from "./StateGui";

import Layout from "./views/layout/component/template/Layout";

import SpinningWheel from "./component/SpinningWheel";
import ClearConfirmationDialogBox from "./userInformation/ClearConfirmationDialogBox";
import DisplayUserInformation from "./userInformation/DisplayUserInformation";
import DragAndDropSummary from "./userInformation/DragAndDropSummary";
import GeneratorDialogBox from "./userInformation/GeneratorDialogBox";
import RemoveConfirmationDialogBox from "./userInformation/RemoveConfirmationDialogBox";
import ContextManager from "./views/content/board/component/template/ContextManager";
import Dashboard from "./views/content/dashboard/Dashboard";
import Map from "./views/content/map/Map";
import { setPointsReady } from "./views/content/map/component/organism/Points";
import ExportConfirmationDialogBox from "./views/content/map/rightMapMenu/export/ExportConfirmationDialogBox";
import { tryConnection } from "./views/layout/authentication";

const [, { isInAddLineMode }] = useStateAction();
const [, { getSelectedMenu }] = useStateGui();

export default () => {
  let refApp!: HTMLDivElement;

  onMount(async () => {
    await tryConnection();
  });

  createEffect(() => {
    // This line is to disable right click menu, necessary to remove point in line under construction with the right click
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    const [, { getLineUnderConstruction }] = useStateAction();

    if (
      isInAddLineMode() &&
      0 < getLineUnderConstruction().busLine.points.length
    ) {
      if (
        refApp &&
        String(refApp.style) !== "cursor: url('/pencil.png'), auto;"
      ) {
        // @ts-expect-error: 'style' field should not be assigned
        refApp.style = "cursor: url('/pencil.png'), auto;";
      }
    } else {
      if (refApp && String(refApp.style) !== "") {
        // @ts-expect-error: 'style' field should not be assigned
        refApp.style = "";
      }
    }
  });

  createEffect(() => {
    if (getSelectedMenu() !== "graphicage") {
      setPointsReady(false);
    }
  });

  return (
    <div ref={refApp}>
      <Layout>
        <Switch>
          <Match when={getSelectedMenu() == "dashboard"}>
            <Dashboard />
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
        <RemoveConfirmationDialogBox />
        <ClearConfirmationDialogBox />
        <ExportConfirmationDialogBox />
        <GeneratorDialogBox />
      </Layout>
      <SpinningWheel />
    </div>
  );
};
