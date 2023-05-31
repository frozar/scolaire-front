import { useStateAction } from "../../../StateAction";
import { useStateGui } from "../../../StateGui";
import { addBusLine } from "../../../request";
import {
  closeRemoveConfirmationBox,
  fetchBusLines,
  displayedClearConfirmationDialogBox,
  getDisplayedGeneratorDialogBox,
  getExportConfirmationDialogBox,
} from "../../../signaux";
import {
  displayAddLineMessage,
  displayRemoveLineMessage,
} from "../../../userInformation/utils";
import { displayedConfirmStopAddLine } from "./ConfirmStopAddLineBox";

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
    if (isInReadMode()) {
      return;
    }

    resetLineUnderConstruction();
    setModeRead();
  }
}

function enterHandler({ code }: KeyboardEvent) {
  if (disable_shortcut()) {
    return;
  }

  if (code === "Enter") {
    if (!isInAddLineMode()) {
      return;
    }
    const ids_point = getLineUnderConstruction().stops.map(function (value) {
      return value["id_point"];
    });

    addBusLine(ids_point).then(async (res) => {
      if (!res) {
        console.error("addBusLine failed");
        return;
      }

      await res.json();

      resetLineUnderConstruction();
      setModeRead();
      fetchBusLines();
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
      } else {
        setModeAddLine();
        displayAddLineMessage();
      }
    }
    if (upKey === "d") {
      // Toggle behavior
      if (!isInRemoveLineMode()) {
        setModeRemoveLine();
        displayRemoveLineMessage();
      } else {
        setModeRead();
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
