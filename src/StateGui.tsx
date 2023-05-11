import _ from "lodash";
import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { TileId } from "./type";

type StateGuiType = {
  displayedMenu: boolean;
  selectedMenu: string;
  selectedTab: string;
  displayedRightMenu: boolean;
  selectedReadModeTile: TileId;
  selectedEditModeTile: TileId;
};

const makeStateGuiContext = () => {
  const defaultStateGui: StateGuiType = {
    displayedMenu: false,
    selectedMenu: "graphicage",
    selectedTab: "info",
    displayedRightMenu: false,
    selectedReadModeTile: "OpenStreetMap_Mapnik",
    selectedEditModeTile: "Stadia_AlidadeSmoothDark",
  };

  const stateGuiString = localStorage.getItem("stateGui");
  let initStateGui = defaultStateGui;

  if (stateGuiString) {
    const stateGuiFromLocalStorage: StateGuiType = JSON.parse(stateGuiString);
    initStateGui = _.merge(defaultStateGui, stateGuiFromLocalStorage);
  }

  const [state, setState] = createStore(initStateGui);

  function setStateWrapper(...args: any[]): void {
    // @ts-expect-error
    setState.apply(null, args);
    localStorage.setItem("stateGui", JSON.stringify(state));
  }

  function toggleDisplayedMenu() {
    setStateWrapper("displayedMenu", (currentValue: boolean) => !currentValue);
  }

  function setSelectedTab(tabName: string) {
    setStateWrapper("selectedTab", tabName);
  }

  function setSelectedReadModeTile(tileId: TileId) {
    setStateWrapper("selectedReadModeTile", tileId);
  }

  function getSelectedReadModeTile() {
    return state.selectedReadModeTile;
  }

  function setSelectedEditModeTile(tileId: TileId) {
    setStateWrapper("selectedEditModeTile", tileId);
  }

  function getSelectedEditModeTile() {
    return state.selectedEditModeTile;
  }

  function toggleDisplayedRightMenu() {
    setStateWrapper(
      "displayedRightMenu",
      (currentValue: boolean) => !currentValue
    );
  }

  function getDisplayedRightMenu() {
    return state.displayedRightMenu;
  }

  function setSelectedMenu(window: string) {
    setState("selectedMenu", window);
  }

  function getSelectedMenu() {
    return state.selectedMenu;
  }

  function getDisplayedMenu() {
    return state.displayedMenu;
  }

  return [
    state,
    {
      toggleDisplayedMenu,
      setSelectedTab,
      setSelectedReadModeTile,
      getSelectedReadModeTile,
      setSelectedEditModeTile,
      getSelectedEditModeTile,
      toggleDisplayedRightMenu,
      getDisplayedRightMenu,
      setSelectedMenu,
      getSelectedMenu,
      getDisplayedMenu,
    },
  ] as const;
};

type StateGuiContextType = ReturnType<typeof makeStateGuiContext>;
const StateGuiContext = createContext<StateGuiContextType>(
  makeStateGuiContext()
);

export function StateGuiProvider(props: any) {
  return (
    <StateGuiContext.Provider value={makeStateGuiContext()}>
      {props.children}
    </StateGuiContext.Provider>
  );
}

export const useStateGui = () => useContext(StateGuiContext);
