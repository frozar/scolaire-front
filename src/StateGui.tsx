import _ from "lodash";
import { JSX, createContext, createEffect, useContext } from "solid-js";
import { SetStoreFunction, Store, createStore } from "solid-js/store";
import { SelectedMenuType, TileId } from "./type";

type StateGuiType = {
  selectedMenu: SelectedMenuType;
  selectedTab: number;
  activeMapId: number | null;
  displayedLeftMenu: boolean;
  displayedRightMenu: boolean;
  selectedReadModeTile: TileId;
  selectedEditModeTile: TileId;
  displayedInformationBoard: boolean;
};

// Documentation link:
// https://stackoverflow.com/questions/70030144/how-to-update-local-storage-values-in-solidjs-using-hooks#answer-72339551
function createLocalStore<T extends object>(
  initState: T
): [Store<T>, SetStoreFunction<T>] {
  const [state, setState] = createStore<T>(initState);

  const stateGuiString = localStorage.getItem("stateGui");

  if (stateGuiString) {
    try {
      const stateGuiFromLocalStorage: StateGuiType = JSON.parse(stateGuiString);
      const mergeState = _.merge(initState, stateGuiFromLocalStorage);
      setState(mergeState);
    } catch (error) {
      setState(() => initState);
    }
  }

  createEffect(() => {
    localStorage.stateGui = JSON.stringify(state);
  });

  return [state, setState];
}

const makeStateGuiContext = () => {
  const defaultStateGui: StateGuiType = {
    selectedMenu: "dashboard",
    selectedTab: 0,
    activeMapId: null,
    displayedLeftMenu: false,
    displayedRightMenu: false,
    selectedReadModeTile: "OpenStreetMap_Mapnik",
    selectedEditModeTile: "Stadia_AlidadeSmoothDark",
    displayedInformationBoard: false,
  };

  const [state, setState] = createLocalStore(defaultStateGui);

  function toggleDisplayedLeftMenu() {
    setState("displayedLeftMenu", (currentValue: boolean) => !currentValue);
  }

  function setSelectedTab(key: number) {
    setState("selectedTab", key);
  }

  function getActiveMapId() {
    return state.activeMapId;
  }

  function setActiveMapId(id: number) {
    setState("activeMapId", id);
  }

  function setSelectedReadModeTile(tileId: TileId) {
    setState("selectedReadModeTile", tileId);
  }

  function getSelectedReadModeTile() {
    return state.selectedReadModeTile;
  }

  function setSelectedEditModeTile(tileId: TileId) {
    setState("selectedEditModeTile", tileId);
  }

  function getSelectedEditModeTile() {
    return state.selectedEditModeTile;
  }

  function toggleDisplayedRightMenu() {
    setState("displayedRightMenu", (currentValue: boolean) => !currentValue);
  }

  function getDisplayedRightMenu() {
    return state.displayedRightMenu;
  }

  function setSelectedMenu(itemMenu: SelectedMenuType) {
    setState("selectedMenu", itemMenu);
  }

  function getSelectedMenu() {
    return state.selectedMenu;
  }

  function getDisplayedLeftMenu() {
    return state.displayedLeftMenu;
  }

  function getDisplayedInformationBoard() {
    return state.displayedInformationBoard;
  }

  function toggleDisplayedInformationBoard() {
    setState(
      "displayedInformationBoard",
      (currentValue: boolean) => !currentValue
    );
  }

  return [
    state,
    {
      setSelectedTab,
      getActiveMapId,
      setActiveMapId,
      setSelectedReadModeTile,
      getSelectedReadModeTile,
      setSelectedEditModeTile,
      getSelectedEditModeTile,
      toggleDisplayedRightMenu,
      getDisplayedRightMenu,
      setSelectedMenu,
      getSelectedMenu,
      getDisplayedLeftMenu,
      toggleDisplayedLeftMenu,
      getDisplayedInformationBoard,
      toggleDisplayedInformationBoard,
    },
  ] as const;
};

type StateGuiContextType = ReturnType<typeof makeStateGuiContext>;
const StateGuiContext = createContext<StateGuiContextType>(
  makeStateGuiContext()
);

export function StateGuiProvider(props: { children: JSX.Element }) {
  return (
    <StateGuiContext.Provider value={makeStateGuiContext()}>
      {props.children}
    </StateGuiContext.Provider>
  );
}

export const useStateGui = () => useContext(StateGuiContext);
