import _ from "lodash";
import { JSX, createContext, createEffect, useContext } from "solid-js";
import { SetStoreFunction, Store, createStore } from "solid-js/store";
import { SelectedMenuType, TileId } from "./type";
import { informationBoardTabIdType } from "./views/content/map/component/organism/InformationBoardTabs";

type StateGuiType = {
  selectedMenu: SelectedMenuType;
  informationBoardSelectedTab: informationBoardTabIdType;
  activeMapId: number | null;
  displayedLeftMenu: boolean;
  displayedRightMenu: boolean;
  selectedReadModeTile: TileId;
  selectedEditModeTile: TileId;
  displayedInformationBoard: boolean;
  nextLeafletPointId: number;
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
    informationBoardSelectedTab: "information",
    activeMapId: null,
    displayedLeftMenu: false,
    displayedRightMenu: false,
    selectedReadModeTile: "OpenStreetMap_Mapnik",
    selectedEditModeTile: "Stadia_AlidadeSmoothDark",
    displayedInformationBoard: false,
    nextLeafletPointId: 0,
  };

  const [state, setState] = createLocalStore(defaultStateGui);

  function nextLeafletPointId(): number {
    const nextLeafletPointId = state.nextLeafletPointId;
    setState("nextLeafletPointId", nextLeafletPointId + 1);
    return nextLeafletPointId;
  }

  function toggleDisplayedLeftMenu() {
    setState("displayedLeftMenu", (currentValue: boolean) => !currentValue);
  }

  function setInformationBoardSelectedTab(key: informationBoardTabIdType) {
    setState("informationBoardSelectedTab", key);
  }

  function getInformationBoardSelectedTab(): informationBoardTabIdType {
    return state.informationBoardSelectedTab;
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

  function setDisplayedInformationBoard(displayed: boolean) {
    setState("displayedInformationBoard", displayed);
  }

  return [
    state,
    {
      getInformationBoardSelectedTab,
      setInformationBoardSelectedTab,
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
      setDisplayedInformationBoard,
      nextLeafletPointId,
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
