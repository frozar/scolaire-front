import _ from "lodash";
import { JSX, createContext, createEffect, useContext } from "solid-js";
import { SetStoreFunction, Store, createStore } from "solid-js/store";
import { SelectedMenuType, TileId } from "./type";
import { informationBoardTabIdType } from "./views/content/board/component/organism/InformationBoardTabs";
import { xanoUser } from "./views/layout/authentication";

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
  activeOrganizationId: number;
  loggedUser: string;
};

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
  activeOrganizationId: 0,
  loggedUser: "",
};

// Check if the local storage has the correct keys
// TODO: Check if the activeMapId exist
function isSafe(stateGuiFromLocalStorage: StateGuiType) {
  const keysByDefault = Object.keys(defaultStateGui);

  const currentLocalStorageKey = Object.keys(stateGuiFromLocalStorage);
  return _.isEqual(keysByDefault.sort(), currentLocalStorageKey.sort());
}

// TODO : Initialiser correctement le ContextManager en fonction de la valeur
//        restaurer depuis le localStorage

// TODO [begin rebase] To keep post rebase ??
// console.log("StateGuiType keys", Object.keys(defaultStateGui));

// // Check if the local storage has the correct keys
// function isSafe(stateGuiFromLocalStorage: StateGuiType) {
//   const keysByDefault = Object.keys(defaultStateGui);
//   let res = true;

//   // If the current local storage has more keys than the default one,
//   // it's not safe
//   for (const key of Object.keys(stateGuiFromLocalStorage)) {
//     if (!keysByDefault.includes(key)) {
//       res = false;
//       break;
//     }
//   }

//   return res;
// }
// TODO [end of rebase]

// Documentation link:
// https://stackoverflow.com/questions/70030144/how-to-update-local-storage-values-in-solidjs-using-hooks#answer-72339551
function createLocalStore<T extends object>(
  initState: T
): [Store<T>, SetStoreFunction<T>] {
  const [state, setState] = createStore<T>(initState);

  const stateGuiString = localStorage.getItem("stateGui");

  if (!stateGuiString) {
    setState(() => initState);
  } else {
    try {
      const stateGuiFromLocalStorage: StateGuiType = JSON.parse(stateGuiString);

      if (!isSafe(stateGuiFromLocalStorage)) {
        setState(() => initState);
      } else {
        const mergeState = _.merge(initState, stateGuiFromLocalStorage);
        setState(mergeState);
      }
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

  function setActiveMapId(id: number | null) {
    setState("activeMapId", id);
  }

  function getActiveOrganizationId() {
    return state.activeOrganizationId;
  }

  function setActiveOrganizationId(id: number) {
    setState("activeOrganizationId", id);
  }

  function getLoggedUser() {
    if (state.loggedUser != "") return JSON.parse(state.loggedUser);
    return undefined;
  }

  function setLoggedUser(user: xanoUser | undefined) {
    if (user) setState("loggedUser", JSON.stringify(user));
    else setState("loggedUser", "");
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

  //TODO passer toute la logique du menu dans menuItemFields
  function setSelectedMenu(itemMenu: SelectedMenuType) {
    setState("selectedMenu", itemMenu);
  }

  //TODO passer toute la logique du menu dans menuItemFields
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

  function resetState() {
    localStorage.stateGui = JSON.stringify(state);
    setState("activeMapId", null);
    setState("displayedInformationBoard", false);
    setState("displayedLeftMenu", false);
    setState("nextLeafletPointId", 0);
    setState("selectedMenu", "maps");
  }

  return [
    state,
    {
      getInformationBoardSelectedTab,
      setInformationBoardSelectedTab,
      getActiveMapId,
      setActiveMapId,
      getActiveOrganizationId,
      setActiveOrganizationId,
      getLoggedUser,
      setLoggedUser,
      setSelectedReadModeTile,
      getSelectedReadModeTile,
      setSelectedEditModeTile,
      getSelectedEditModeTile,
      toggleDisplayedRightMenu,
      getDisplayedRightMenu,

      //TODO passer toute la logique du menu dans menuItemFields
      setSelectedMenu,
      //TODO passer toute la logique du menu dans menuItemFields
      getSelectedMenu,
      getDisplayedLeftMenu,
      toggleDisplayedLeftMenu,
      getDisplayedInformationBoard,
      toggleDisplayedInformationBoard,
      setDisplayedInformationBoard,
      nextLeafletPointId,
      resetState,
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
