import _ from "lodash";
import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

// TODO: use onTile: enum;
type StateGuiType = {
  displayedMenu: boolean;
  selectedTab: string;
  displayedRightMenu: boolean;
  selectedTile: string;
};

const makeStateGuiContext = () => {
  const defaultStateGui: StateGuiType = {
    displayedMenu: false,
    selectedTab: "info",
    displayedRightMenu: false,
    selectedTile: "OpenStreetMap_Mapnik",
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

  function setOnTile(tileName: string) {
    setStateWrapper("onTile", tileName);
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

  return [
    state,
    {
      toggleDisplayedMenu,
      setSelectedTab,
      setOnTile,
      toggleDisplayedRightMenu,
      getDisplayedRightMenu,
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
