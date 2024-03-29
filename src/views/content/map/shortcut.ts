import {
  setSchoolPointsColor,
  setStopPointsColor,
} from "../../../leafletUtils";
import { toggleDrawMod } from "../board/component/template/ContextManager";

import { COLOR_SCHOOL_FOCUS, COLOR_STOP_FOCUS } from "./constant";

// const isOpenedModal = () =>
//   getExportConfirmationDialogBox().displayed ||
//   getDisplayedGeneratorDialogBox() ||
//   displayedClearConfirmationDialogBox().displayed ||
// getRemoveConfirmation().displayed;
// TODO MAYBE_ERROR
// || displayedConfirmStopDrawTrip();

// const disable_shortcut = () =>
//   getSelectedMenu() != "graphicage" || isOpenedModal();

// Handler the Undo/Redo from the user
function undoRedoHandler({ ctrlKey, shiftKey, code }: KeyboardEvent) {
  console.log(ctrlKey, shiftKey, code);
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
  console.log(code);
  // if (disable_shortcut()) {
  //   return;
  // }
  // if (code === "Escape") {
  //   if (onBoard() == "trip-draw") {
  //     quitModeDrawTrip();
  //     setCurrentStep(DrawModeStep.start);
  //   }
  //   changeBoard("line");
  //   MapElementUtils.deselectAllPointsAndBusTrips();
  //   //TODO voir l'impact de la suppression
  //   // fetchBusTrips();
  // }
}

export function quitModeDrawTrip() {
  // setModeRead();

  setStopPointsColor([], COLOR_STOP_FOCUS);
  setSchoolPointsColor([], COLOR_SCHOOL_FOCUS);
  toggleDrawMod();
}

function enterHandler({ code }: KeyboardEvent) {
  console.log(code);

  // if (disable_shortcut()) {
  //   return;
  // }
  // if (code === "Enter") {
  // if (!isInDrawTripMode() || currentStep() === DrawModeStep.schoolSelection) {
  //   return;
  // }
  // const resourceInfo = getTripUnderConstruction().trip.points.map(
  //   function (value) {
  //     return {
  //       id_resource: value["id"],
  //       nature: value["nature"].toLowerCase(),
  //     };
  //   }
  // );
  // addBusTrip(resourceInfo).then(async (res) => {
  //   if (!res) {
  //     console.error("addBusTrip failed");
  //     return;
  //   }
  //   await res.json();
  //   resetTripUnderConstruction();
  //   setModeRead();
  //   //TODO voir l'impact de la suppression
  //   // fetchBusTrips();
  // });
  // }
}

function toggleTripUnderConstruction({ code }: KeyboardEvent) {
  console.log(code);

  // if (disable_shortcut()) {
  //   return;
  // }
  // // @ts-expect-error: Currently the 'keyboard' field doesn't exist on 'navigator'
  // const keyboard = navigator.keyboard;
  // // @ts-expect-error: The type 'KeyboardLayoutMap' is not available
  // keyboard.getLayoutMap().then((keyboardLayoutMap) => {
  //   const upKey = keyboardLayoutMap.get(code);
  //   if (upKey === "l") {
  //     if (isInDrawTripMode()) {
  //       setModeRead();
  //     } else {
  //       deselectAllPoints();
  //       setModeDrawTrip();
  //       // TODO MAYBE_ERROR
  //       // displayDrawTripMessage();
  //     }
  //   }
  // });
}

export const listHandlerLMap = [
  undoRedoHandler,
  escapeHandler,
  enterHandler,
  toggleTripUnderConstruction,
];
