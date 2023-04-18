import { createEffect, Component, onCleanup, onMount } from "solid-js";
import styles from "./App.module.css";
import SpinningWheel from "./SpinningWheel";
import Map from "./Map";
import Menu from "./menu/Menu";
import { useStateAction } from "./StateAction";
import DisplayUserInformation from "./userInformation/DisplayUserInformation";
import RemoveConfirmation from "./userInformation/RemoveConfirmation";
import { fetchBusLines } from "./signaux";
import { ModeEnum } from "./type";
import {
  displayAddLineMessage,
  displayRemoveLineMessage,
} from "./userInformation/utils";
import { deleteBusLine } from "./request";
import { unwrap } from "solid-js/store";

const [
  state,
  {
    setModeRead,
    setModeAddLine,
    setModeRemoveLine,
    isInAddLineMode,
    resetLineUnderConstruction,
    getLineUnderConstructionId,
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
      console.log("undos", history.undos);
      if (history.undos && history.undos[0] && history.undos[0][0]) {
        const anUndo = history.undos[0][0];
        console.log("anUndo", anUndo);
        console.log("anUndo.hasChanged()", anUndo.hasChanged());
        console.log("anUndo.new()", anUndo.new());
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
        console.log("history.isUndoable()", history.isUndoable());
        if (!shiftKey && history.isUndoable()) {
          console.log("BEFORE UNDO state", JSON.stringify(unwrap(state)));
          history.undo();
          console.log("AFTER  UNDO state", JSON.stringify(unwrap(state)));
        } else if (shiftKey && history.isRedoable()) {
          console.log("BEFORE REDO state", JSON.stringify(unwrap(state)));
          history.redo();
          console.log("AFTER  REDO state", JSON.stringify(unwrap(state)));
        }
      }
    });
  }
}

function escapeHandler({ code }: KeyboardEvent) {
  if (code === "Escape") {
    if (getMode() != ModeEnum.addLine) {
      return;
    }
    const idToRemove: number | null = getLineUnderConstructionId();
    resetLineUnderConstruction();
    setModeRead();
    if (idToRemove === null) {
      fetchBusLines();
      return;
    }
    deleteBusLine(idToRemove).then(() => {
      fetchBusLines();
    });
  }
}

function enterHandler({ code }: KeyboardEvent) {
  if (code === "Enter") {
    if (isInAddLineMode()) {
      resetLineUnderConstruction();
      setModeRead();
      fetchBusLines();
    }
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
      if (isInRemoveLineMode()) {
        setModeRead();
        return;
      }
      setModeRemoveLine();
      displayRemoveLineMessage();
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

const App: Component = () => {
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

export default App;
