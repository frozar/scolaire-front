import { createEffect, onMount } from "solid-js";
import { useStateGui } from "./StateGui";

import Layout from "./views/layout/component/template/Layout";

import SpinningWheel from "./component/SpinningWheel";
import {
  authenticated,
  disableSpinningWheel,
  enableSpinningWheel,
} from "./signaux";
import ClearConfirmationDialogBox from "./userInformation/ClearConfirmationDialogBox";
import DisplayUserInformation from "./userInformation/DisplayUserInformation";
import DragAndDropSummary from "./userInformation/DragAndDropSummary";
import GeneratorDialogBox from "./userInformation/GeneratorDialogBox";
import RemoveConfirmation from "./userInformation/RemoveConfirmation";
import { setPointsReady } from "./views/content/map/component/organism/Points";
import ExportConfirmationDialogBox from "./views/content/map/rightMapMenu/export/ExportConfirmationDialogBox";
import { tryConnection } from "./views/layout/authentication";

import "./App.css";
import { InitService } from "./_services/init.service";
import { inDuplication } from "./utils/duplicate.utils";
import { Contents } from "./views/content/Contents";
import { Dialogs } from "./views/content/board/component/organism/Dialogs";

const [, { getSelectedMenu, getActiveMapId }] = useStateGui();

export default () => {
  onMount(async () => await tryConnection());

  // This line is to disable right click menu, necessary to remove point in line under construction with the right click
  createEffect(() => {
    document.addEventListener("contextmenu", (e) => e.preventDefault());
  });

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (getActiveMapId() && authenticated() && !inDuplication()) {
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

  return (
    <div>
      <Layout>
        <Contents />

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
