import { useStateAction } from "../../../StateAction";
import { useStateGui } from "../../../StateGui";
import {
  setSchoolPointsColor,
  setStopPointsColor,
} from "../../../leafletUtils";
import {
  displayedClearConfirmationDialogBox,
  getDisplayedGeneratorDialogBox,
  getExportConfirmationDialogBox,
  getRemoveConfirmation,
} from "../../../signaux";
import { setCurrentRace } from "../board/component/organism/DrawRaceBoard";
import { toggleDrawMod } from "../board/component/template/ContextManager";

import { COLOR_SCHOOL_FOCUS, COLOR_STOP_FOCUS } from "./constant";

const [, { setModeDrawRace, isInDrawRaceMode, setModeRead }, history] =
  useStateAction();

const isOpenedModal = () =>
  getExportConfirmationDialogBox().displayed ||
  getDisplayedGeneratorDialogBox() ||
  displayedClearConfirmationDialogBox().displayed ||
  getRemoveConfirmation().displayed;
// TODO MAYBE_ERROR
// || displayedConfirmStopDrawRace();

const [, { getSelectedMenu }] = useStateGui();

const disable_shortcut = () =>
  getSelectedMenu() != "graphicage" || isOpenedModal();

// Handler the Undo/Redo from the user
function undoRedoHandler({ ctrlKey, shiftKey, code }: KeyboardEvent) {
  // if (disable_shortcut()) {
  //   return;
  // }
  // if (ctrlKey) {
  //   // @ts-expect-error: Currently the 'keyboard' field doesn't exist on 'navigator'
  //   const keyboard = navigator.keyboard;
  //   // @ts-expect-error: The type 'KeyboardLayoutMap' is not available
  //   keyboard.getLayoutMap().then((keyboardLayoutMap) => {
  //     const upKey = keyboardLayoutMap.get(code);
  //     if (upKey === "z") {
  //       if (!shiftKey && history.isUndoable()) {
  //         history.undo();
  //       } else if (shiftKey && history.isRedoable()) {
  //         history.redo();
  //       }
  //     }
  //   });
  // }
}

function escapeHandler({ code }: KeyboardEvent) {
  // if (disable_shortcut()) {
  //   return;
  // }
  // if (code === "Escape") {
  //   if (onBoard() == "race-draw") {
  //     quitModeDrawRace();
  //     setCurrentStep(DrawModeStep.start);
  //   }
  //   changeBoard("line");
  //   MapElementUtils.deselectAllPointsAndBusRaces();
  //   //TODO voir l'impact de la suppression
  //   // fetchBusRaces();
  // }
}

export function quitModeDrawRace() {
  // setModeRead();
  setCurrentRace({});
  setStopPointsColor([], COLOR_STOP_FOCUS);
  setSchoolPointsColor([], COLOR_SCHOOL_FOCUS);
  toggleDrawMod();
}

function enterHandler({ code }: KeyboardEvent) {
  // if (disable_shortcut()) {
  //   return;
  // }
  // if (code === "Enter") {
  // if (!isInDrawRaceMode() || currentStep() === DrawModeStep.schoolSelection) {
  //   return;
  // }
  // const resourceInfo = getRaceUnderConstruction().course.points.map(
  //   function (value) {
  //     return {
  //       id_resource: value["id"],
  //       nature: value["nature"].toLowerCase(),
  //     };
  //   }
  // );
  // addBusRace(resourceInfo).then(async (res) => {
  //   if (!res) {
  //     console.error("addBusRace failed");
  //     return;
  //   }
  //   await res.json();
  //   resetRaceUnderConstruction();
  //   setModeRead();
  //   //TODO voir l'impact de la suppression
  //   // fetchBusRaces();
  // });
  // }
}

function toggleRaceUnderConstruction({ code }: KeyboardEvent) {
  // if (disable_shortcut()) {
  //   return;
  // }
  // // @ts-expect-error: Currently the 'keyboard' field doesn't exist on 'navigator'
  // const keyboard = navigator.keyboard;
  // // @ts-expect-error: The type 'KeyboardLayoutMap' is not available
  // keyboard.getLayoutMap().then((keyboardLayoutMap) => {
  //   const upKey = keyboardLayoutMap.get(code);
  //   if (upKey === "l") {
  //     if (isInDrawRaceMode()) {
  //       setModeRead();
  //     } else {
  //       deselectAllPoints();
  //       setModeDrawRace();
  //       // TODO MAYBE_ERROR
  //       // displayDrawRaceMessage();
  //     }
  //   }
  // });
}

export const listHandlerLMap = [
  undoRedoHandler,
  escapeHandler,
  enterHandler,
  toggleRaceUnderConstruction,
];
