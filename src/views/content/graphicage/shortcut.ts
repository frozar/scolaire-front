import { useStateAction } from "../../../StateAction";
import { useStateGui } from "../../../StateGui";
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
import { displayedConfirmStopAddLine } from "./ConfirmStopAddLineBox";
import { deselectAllPoints } from "./component/organism/Points";
import { deselectAllBusLines } from "./line/BusLines";

const [
  ,
  {
    setModeAddLine,
    setModeRemoveLine,
    isInAddLineMode,
    isInReadMode,
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
    if (isInReadMode()) {
      deselectAllBusLines();
      return;
    }

    resetLineUnderConstruction();
    setModeRead();
    //TODO voir l'impact de la suppression
    // fetchBusLines();
  }
}

function enterHandler({ code }: KeyboardEvent) {
  if (disable_shortcut()) {
    return;
  }

  if (code === "Enter") {
    if (!isInAddLineMode() || !getLineUnderConstruction().confirmSelection) {
      return;
    }
    const resourceInfo = getLineUnderConstruction().stops.map(function (value) {
      return {
        id_resource: value["id"],
        nature: value["nature"].toLowerCase(),
      };
    });

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
