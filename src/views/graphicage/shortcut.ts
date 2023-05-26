import { useStateAction } from "../../StateAction";
import { addBusLine } from "../../request";
import {
  closeRemoveConfirmationBox,
  fetchBusLines,
  getClearConfirmation,
  getDisplayedGeneratorDialogueBox,
  getExportConfirmation,
} from "../../signaux";
import {
  displayAddLineMessage,
  displayRemoveLineMessage,
} from "../../userInformation/utils";
import { dialogConfirmStopAddLine } from "./ConfirmStopAddLine";

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
  getExportConfirmation().displayed ||
  getDisplayedGeneratorDialogueBox() ||
  getClearConfirmation().displayed ||
  dialogConfirmStopAddLine();

// Handler the Undo/Redo from the user
function undoRedoHandler({ ctrlKey, shiftKey, code }: KeyboardEvent) {
  if (isOpenedModal()) {
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
  if (isOpenedModal()) {
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
  if (isOpenedModal()) {
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
  if (isOpenedModal()) {
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
