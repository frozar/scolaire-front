import { createEffect, Component, onCleanup, onMount } from "solid-js";
import styles from "./App.module.css";
import SpinningWheel from "./SpinningWheel";
import Map from "./Map";
import Menu from "./menu/Menu";
import { useStateAction } from "./StateAction";
import DisplayUserInformation from "./userInformation/DisplayUserInformation";
import RemoveConfirmation from "./userInformation/RemoveConfirmation";
import {
  fetchBusLines,
  lineUnderConstructionState,
  setLineUnderConstructionState,
  setUserInformations,
} from "./signaux";

const [
  ,
  {
    setModeRead,
    setModeAddLine,
    isInAddLineMode,
    setLineUnderConstruction,
    getLineUnderConstruction,
  },
  history,
] = useStateAction();

// Handler the Undo/Redo from the user
function undoRedoHandler({ ctrlKey, shiftKey, code }: KeyboardEvent) {
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
  if (code === "Escape" || code === "Enter") {
    setModeRead();
    setUserInformations([]);
    setLineUnderConstructionState((lineState) =>
      lineState.active ? { ...lineState, active: false } : lineState
    );
    fetchBusLines();
    setLineUnderConstruction({ id_bus_line: null, stops: [] });
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
    document.addEventListener("keydown", toggleLineUnderConstruction);
  });

  onCleanup(() => {
    document.removeEventListener("keydown", undoRedoHandler);
    document.removeEventListener("keydown", escapeHandler);
    document.removeEventListener("keydown", toggleLineUnderConstruction);
  });

  return (
    <div class={styles.App} ref={refApp}>
      <DisplayUserInformation />
      <RemoveConfirmation />
      <Menu />
      <Map />
      <SpinningWheel />
    </div>
  );
};

export default App;
