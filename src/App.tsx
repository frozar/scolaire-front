import { createEffect, Component, onCleanup, onMount } from "solid-js";
import styles from "./App.module.css";
import SpinningWheel from "./SpinningWheel";
import Map from "./Map";
import Menu from "./menu/Menu";
import { useStateAction } from "./StateAction";
import DisplayUserInformation from "./userInformation/DisplayUserInformation";
import RemoveConfirmation from "./userInformation/RemoveConfirmation";
import { closeRemoveConfirmationBox, fetchBusLines } from "./signaux";
import { ModeEnum } from "./type";
import {
  displayAddLineMessage,
  displayRemoveLineMessage,
} from "./userInformation/utils";
import { addBusLine, deleteBusLine } from "./request";
import { unwrap } from "solid-js/store";

const [
  state,
  {
    setModeRead,
    setModeAddLine,
    setModeRemoveLine,
    isInAddLineMode,
    resetLineUnderConstruction,
    getLineUnderConstruction,
    getMode,
    isInRemoveLineMode,
  },
  history,
] = useStateAction();

// Handler the Undo/Redo from the user
function undoRedoHandler({ ctrlKey, shiftKey, code }: KeyboardEvent) {
  // @ts-expect-error
  const keyboard = navigator.keyboard;
  // @ts-expect-error
  keyboard.getLayoutMap().then((keyboardLayoutMap) => {
    const upKey = keyboardLayoutMap.get(code);
    if (upKey === "x") {
      if (history.undos && history.undos[0] && history.undos[0][0]) {
        const anUndo = history.undos[0][0];
      }
    }
  });

  if (ctrlKey) {
    // @ts-expect-error
    const keyboard = navigator.keyboard;
    // @ts-expect-error
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
  if (code === "Escape") {
    if (!isInAddLineMode()) {
      return;
    }

    resetLineUnderConstruction();
    setModeRead();
  }
}

function enterHandler({ code }: KeyboardEvent) {
  if (code === "Enter") {
    if (!isInAddLineMode()) {
      return;
    }
    const ids_point = getLineUnderConstruction().stops.map(function (value) {
      return value["id_point"];
    });

    addBusLine(ids_point).then(async (res) => {
      await res.json();
      resetLineUnderConstruction();
      setModeRead();
      fetchBusLines();
    });
  }
}

function toggleLineUnderConstruction({ code }: KeyboardEvent) {
  // @ts-expect-error
  const keyboard = navigator.keyboard;
  // @ts-expect-error
  keyboard.getLayoutMap().then((keyboardLayoutMap) => {
    const upKey = keyboardLayoutMap.get(code);
    if (upKey === "l") {
      setModeAddLine();
      displayAddLineMessage();
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

let refApp: HTMLDivElement | undefined;

createEffect(() => {
  const [, { getLineUnderConstruction }] = useStateAction();

  if (isInAddLineMode() && 0 < getLineUnderConstruction().stops.length) {
    if (
      refApp &&
      String(refApp.style) !== "cursor: url('/pencil.png'), auto;"
    ) {
      // @ts-expect-error
      refApp.style = "cursor: url('/pencil.png'), auto;";
    }
  } else {
    if (refApp && String(refApp.style) !== "") {
      // @ts-expect-error
      refApp.style = "";
    }
  }
});

export default () => {
  onMount(() => {
    document.addEventListener("keydown", undoRedoHandler);
    document.addEventListener("keydown", escapeHandler);
    document.addEventListener("keydown", enterHandler);
    document.addEventListener("keydown", toggleLineUnderConstruction);
  });

  onCleanup(() => {
    document.removeEventListener("keydown", undoRedoHandler);
    document.removeEventListener("keydown", escapeHandler);
    document.removeEventListener("keydown", enterHandler);
    document.removeEventListener("keydown", toggleLineUnderConstruction);
  });

  return (
    <div ref={refApp}>
      <DisplayUserInformation />
      <RemoveConfirmation />
      <Menu />
      <Map />
      <SpinningWheel />
    </div>
  );
};
