import { createEffect, Switch, Match } from "solid-js";
import SpinningWheel from "./component/SpinningWheel";
import Map from "./views/content/graphicage/Map";
import { useStateAction } from "./StateAction";
import DisplayUserInformation from "./userInformation/DisplayUserInformation";
import RemoveConfirmation from "./userInformation/RemoveConfirmation";
import ExportConfirmation from "./views/content/graphicage/rightMapMenu/export/ExportModal";

import DragAndDrop from "./userInformation/DragAndDrop";
import TopMenu from "./views/layout/topMenu/TopMenu";
import LeftMenu from "./views/layout/leftMenu/LeftMenu";
import { useStateGui } from "./StateGui";
import ClearConfirmation from "./userInformation/ClearConfirmation";
import GeneratorDialogueBox from "./userInformation/GeneratorDialogueBox";
import Arret from "./views/content/ramassage/Ramassage";
import Etablissement from "./views/content/etablissement/Etablissement";

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
      <TopMenu />

      <div id="app-content">
        <LeftMenu />

        <Switch fallback={<p>Page not found</p>}>
          <Match when={getSelectedMenu() == "graphicage"}>
            <Map />
          </Match>

          <Match when={getSelectedMenu() == "ramassages"}>
            <Arret />
          </Match>

          <Match when={getSelectedMenu() == "etablissements"}>
            <Etablissement />
          </Match>
        </Switch>

        <DisplayUserInformation />
        <DragAndDrop />
        <RemoveConfirmation />
        <ClearConfirmation />
        <ExportConfirmation />
        <GeneratorDialogueBox />
        <SpinningWheel />
      </div>
    </div>
  );
};
