import { createEffect, Switch, Match } from "solid-js";

import { useStateAction } from "./StateAction";
import { useStateGui } from "./StateGui";
import SpinningWheel from "./component/SpinningWheel";

// User information
import DisplayUserInformation from "./userInformation/DisplayUserInformation";
import RemoveConfirmation from "./userInformation/RemoveConfirmation";
import DragAndDropSummary from "./userInformation/DragAndDropSummary";
import ClearConfirmation from "./userInformation/ClearConfirmation";
import GeneratorDialogBox from "./userInformation/GeneratorDialogBox";

// Layout
import Layout from "./views/layout/Layout";

// Graphicage
import Graphicage from "./views/content/graphicage/Graphicage";
import ExportConfirmation from "./views/content/graphicage/rightMapMenu/export/ExportModal";

import Etablissement from "./views/content/etablissement/Etablissement";
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

  return (
    <div ref={refApp}>
      <Layout />

      <div id="app-content">
        <Switch fallback={<p>Page not found</p>}>
          <Match when={getSelectedMenu() == "graphicage"}>
            <Graphicage />
          </Match>

          <Match when={getSelectedMenu() == "ramassages"}>
            <Ramassage />
          </Match>

          <Match when={getSelectedMenu() == "etablissements"}>
            <Etablissement />
          </Match>
        </Switch>

        <DisplayUserInformation />
        <DragAndDropSummary />
        <RemoveConfirmation />
        <ClearConfirmation />
        <ExportConfirmation />
        <GeneratorDialogBox />
        <SpinningWheel />
      </div>
    </div>
  );
};
