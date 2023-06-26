import { Match, Switch, createEffect } from "solid-js";
import { useStateAction } from "./StateAction";
import { useStateGui } from "./StateGui";

import Layout from "./component/template/Layout";

import { setPointsReady } from "./views/content/graphicage/PointsRamassageAndEtablissement";

import SpinningWheel from "./component/SpinningWheel";
import ClearConfirmationDialogBox from "./userInformation/ClearConfirmationDialogBox";
import DisplayUserInformation from "./userInformation/DisplayUserInformation";
import DragAndDropSummary from "./userInformation/DragAndDropSummary";
import GeneratorDialogBox from "./userInformation/GeneratorDialogBox";
import RemoveConfirmationDialogBox from "./userInformation/RemoveConfirmationDialogBox";
import Dashboard from "./views/content/dashboard/Dashboard";
import Etablissement from "./views/content/etablissement/Etablissement";
import Graphicage from "./views/content/graphicage/Graphicage";
import ExportConfirmationDialogBox from "./views/content/graphicage/rightMapMenu/export/ExportConfirmationDialogBox";
import Ramassage from "./views/content/ramassage/Ramassage";

const [, { isInAddLineMode }] = useStateAction();
const [, { getSelectedMenu }] = useStateGui();

export default () => {
  let refApp!: HTMLDivElement;

  createEffect(() => {
    const [, { getLineUnderConstruction }] = useStateAction();

    if (isInAddLineMode() && 0 < getLineUnderConstruction().stops.length) {
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
      <Layout />

      <div id="app-content">
        <Switch fallback={<p>Page not found</p>}>
          <Match when={getSelectedMenu() == "dashboard"}>
            <Dashboard />
          </Match>

          <Match when={getSelectedMenu() == "graphicage"}>
            <Graphicage />
          </Match>

          <Match when={getSelectedMenu() == "etablissements"}>
            <Etablissement />
          </Match>

          <Match when={getSelectedMenu() == "ramassages"}>
            <Ramassage />
          </Match>
        </Switch>

        <DisplayUserInformation />
        <DragAndDropSummary />
        <RemoveConfirmationDialogBox />
        <ClearConfirmationDialogBox />
        <ExportConfirmationDialogBox />
        <GeneratorDialogBox />
      </div>
      <SpinningWheel />
    </div>
  );
};
