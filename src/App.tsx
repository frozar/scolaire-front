import { Match, Switch, createEffect } from "solid-js";
import { useStateAction } from "./StateAction";
import { useStateGui } from "./StateGui";

import Layout from "./views/layout/component/template/Layout";

import SpinningWheel from "./component/SpinningWheel";
import ClearConfirmationDialogBox from "./userInformation/ClearConfirmationDialogBox";
import DisplayUserInformation from "./userInformation/DisplayUserInformation";
import DragAndDropSummary from "./userInformation/DragAndDropSummary";
import GeneratorDialogBox from "./userInformation/GeneratorDialogBox";
import RemoveConfirmationDialogBox from "./userInformation/RemoveConfirmationDialogBox";
import Dashboard from "./views/content/dashboard/Dashboard";
import Graphicage from "./views/content/graphicage/Graphicage";
import { setPointsReady } from "./views/content/graphicage/component/organism/Points";
import ExportConfirmationDialogBox from "./views/content/graphicage/rightMapMenu/export/ExportConfirmationDialogBox";
import ContextManager from "./views/layout/component/organism/ContextManager";

const [, { isInAddLineMode }] = useStateAction();
const [, { getSelectedMenu }] = useStateGui();

export default () => {
  let refApp!: HTMLDivElement;

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

          <Match when={getSelectedMenu() == "graphicage"}>
            <Graphicage />
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
