import { Match, Switch, createEffect, createSignal } from "solid-js";
import { useStateAction } from "./StateAction";
import { useStateGui } from "./StateGui";

import Layout from "./views/layout/component/template/Layout";

import SpinningWheel from "./component/SpinningWheel";
import ClearConfirmationDialogBox from "./userInformation/ClearConfirmationDialogBox";
import DisplayUserInformation from "./userInformation/DisplayUserInformation";
import DragAndDropSummary from "./userInformation/DragAndDropSummary";
import GeneratorDialogBox from "./userInformation/GeneratorDialogBox";
import RemoveConfirmationDialogBox from "./userInformation/RemoveConfirmationDialogBox";
import Graphicage from "./views/content/graphicage/Graphicage";
import AddLineInformationBoardContent from "./views/content/graphicage/component/organism/AddLineInformationBoardContent";
import { setPointsReady } from "./views/content/graphicage/component/organism/Points";
import ExportConfirmationDialogBox from "./views/content/graphicage/rightMapMenu/export/ExportConfirmationDialogBox";
import { setFilAriane } from "./views/layout/component/atom/FilAriane";
import InformationBoardLayout from "./views/layout/component/template/InformationBoardLayout";

const [, { isInAddLineMode }] = useStateAction();
const [, { getSelectedMenu }] = useStateGui();

type boardContent = "add-line" | "home";
const [onBoardContent, setOnBoardContent] = createSignal<boardContent>();

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

  // Here i manage the arian fil and the display content of information board for add line modf
  createEffect(() => {
    if (isInAddLineMode()) {
      setFilAriane("Création d'une ligne");
      setOnBoardContent("add-line");
    } else {
      setFilAriane("Acceuil");
      setOnBoardContent("home");
    }
  });

  return (
    <div ref={refApp}>
      <Layout>
        <Graphicage />

        <InformationBoardLayout>
          <Switch>
            <Match when={onBoardContent() === "add-line"}>
              <AddLineInformationBoardContent />
            </Match>
          </Switch>
        </InformationBoardLayout>

        {/* <InformationBoardLayout>
          <Switch fallback={<p>Page not found</p>}>
            <Match when={getSelectedMenu() == "dashboard"}>
              <Dashboard />
            </Match>

            <Match when={getSelectedMenu() == "graphicage"}>
              <Graphicage />
            </Match>

            <Match when={getSelectedMenu() == "etablissements"}>
              <SchoolsBoard />
            </Match>

            <Match when={getSelectedMenu() == "ramassages"}>
              <Ramassage />
            </Match>
          </Switch>
        </InformationBoardLayout> */}

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
