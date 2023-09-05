import { useStateAction } from "../../../StateAction";
import { useStateGui } from "../../../StateGui";
import {
  setSchoolPointsColor,
  setStopPointsColor,
} from "../../../leafletUtils";
import { addBusLine } from "../../../request";
import {
  closeRemoveConfirmationBox,
  displayedClearConfirmationDialogBox,
  getDisplayedGeneratorDialogBox,
  getExportConfirmationDialogBox,
  getRemoveConfirmation,
} from "../../../signaux";
import {
  displayAddLineMessage,
  displayRemoveLineMessage,
} from "../../../userInformation/utils";
import {
  currentStep,
  drawModeStep,
  setCurrentStep,
} from "../board/component/organism/DrawModeBoardContent";
import {
  isInDrawMod,
  toggleDrawMod,
} from "../board/component/template/ContextManager";
import { displayedConfirmStopAddLine } from "./ConfirmStopAddLineBox";

import { deselectAllBusLines } from "./component/organism/BusLines";

import { deselectAllPoints } from "./component/organism/Points";
import { COLOR_SCHOOL_FOCUS, COLOR_STOP_FOCUS } from "./constant";

const [
  ,
  {
    setModeAddLine,
    setModeRemoveLine,
    isInAddLineMode,
    // isInReadMode,
    resetLineUnderConstruction,
    getLineUnderConstruction,
    setModeRead,
    isInRemoveLineMode,
  },
  history,
] = useStateAction();

const isOpenedModal = () =>
  getExportConfirmationDialogBox().displayed ||
  getDisplayedGeneratorDialogBox() ||
  displayedClearConfirmationDialogBox().displayed ||
  getRemoveConfirmation().displayed ||
  displayedConfirmStopAddLine();

const [, { getSelectedMenu }] = useStateGui();

const disable_shortcut = () =>
  getSelectedMenu() != "graphicage" || isOpenedModal();

// Handler the Undo/Redo from the user
function undoRedoHandler({ ctrlKey, shiftKey, code }: KeyboardEvent) {
  if (disable_shortcut()) {
    return;
  }

  if (ctrlKey) {
    // @ts-expect-error: Currently the 'keyboard' field doesn't exist on 'navigator'
    const keyboard = navigator.keyboard;
    // @ts-expect-error: The type 'KeyboardLayoutMap' is not available
    keyboard.getLayoutMap().then((keyboardLayoutMap) => {
      const upKey = keyboardLayoutMap.get(code);
      if (upKey === "z") {
        if (!shiftKey && history.isUndoable()) {
          history.undo();
        } else if (shiftKey && history.isRedoable()) {
          history.redo();
        }
      }
    });
  }
}

function escapeHandler({ code }: KeyboardEvent) {
  if (disable_shortcut()) {
    return;
  }

  if (code === "Escape") {
    deselectAllPoints();
    if (!isInDrawMod()) {
      deselectAllBusLines();
      setStopPointsColor([], COLOR_STOP_FOCUS);
      setSchoolPointsColor([], COLOR_SCHOOL_FOCUS);
      return;
    }

    quitModeAddLine();
    setCurrentStep(drawModeStep.start);
    //TODO voir l'impact de la suppression
    // fetchBusLines();
  }
}

export function quitModeAddLine() {
  // setModeRead();
  resetLineUnderConstruction();
  setStopPointsColor([], COLOR_STOP_FOCUS);
  setSchoolPointsColor([], COLOR_SCHOOL_FOCUS);
  toggleDrawMod();
}

function enterHandler({ code }: KeyboardEvent) {
  if (disable_shortcut()) {
    return;
  }

  if (code === "Enter") {
    if (!isInAddLineMode() || currentStep() === drawModeStep.schoolSelection) {
      return;
    }
    const resourceInfo = getLineUnderConstruction().busLine.points.map(
      function (value) {
        return {
          id_resource: value["id"],
          nature: value["nature"].toLowerCase(),
        };
      }
    );

    addBusLine(resourceInfo).then(async (res) => {
      if (!res) {
        console.error("addBusLine failed");
        return;
      }

      await res.json();

      resetLineUnderConstruction();
      setModeRead();
      //TODO voir l'impact de la suppression
      // fetchBusLines();
    });
  }
}

function toggleLineUnderConstruction({ code }: KeyboardEvent) {
  if (disable_shortcut()) {
    return;
  }

  // @ts-expect-error: Currently the 'keyboard' field doesn't exist on 'navigator'
  const keyboard = navigator.keyboard;
  // @ts-expect-error: The type 'KeyboardLayoutMap' is not available
  keyboard.getLayoutMap().then((keyboardLayoutMap) => {
    const upKey = keyboardLayoutMap.get(code);
    if (upKey === "l") {
      if (isInAddLineMode()) {
        setModeRead();
        //TODO voir l'impact de la suppression
        // fetchBusLines();
      } else {
        deselectAllPoints();
        setModeAddLine();
        //TODO voir l'impact de la suppression
        // fetchBusLines();
        displayAddLineMessage();
      }
    }
    if (upKey === "d") {
      // Toggle behavior
      deselectAllPoints();

      if (!isInRemoveLineMode()) {
        setModeRemoveLine();
        //TODO voir l'impact de la suppression
        // fetchBusLines();
        displayRemoveLineMessage();
      } else {
        setModeRead();
        //TODO voir l'impact de la suppression
        // fetchBusLines();
        closeRemoveConfirmationBox();
      }
    }
  });
}

export const listHandlerLMap = [
  undoRedoHandler,
  escapeHandler,
  enterHandler,
  toggleLineUnderConstruction,
];