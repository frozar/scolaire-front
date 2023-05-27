import { createEffect, Switch, Match } from "solid-js";
import SpinningWheel from "./SpinningWheel";
import Map from "./views/graphicage/Map";
import { useStateAction } from "./StateAction";
import DisplayUserInformation from "./userInformation/DisplayUserInformation";
import RemoveConfirmation from "./userInformation/RemoveConfirmation";
import ExportConfirmation from "./views/graphicage/rightMapMenu/export/ExportModal";

import DragAndDrop from "./userInformation/DragAndDrop";
import NavTop from "./layout/NavTop";
import NavLateral from "./layout/NavLateral";
import { useStateGui } from "./StateGui";
import ClearConfirmation from "./userInformation/ClearConfirmation";
import GeneratorDialogueBox from "./userInformation/GeneratorDialogueBox";
import Arret from "./views/ramassage/Ramassage";
import Etablissement from "./views/etablissement/Etablissement";

const [, { isInAddLineMode }] = useStateAction();
const [, { getSelectedMenu }] = useStateGui();

let refApp: HTMLDivElement;

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

export default () => {
  return (
    <div ref={refApp}>
      <NavTop />

      <div id="app-content">
        <NavLateral />

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
