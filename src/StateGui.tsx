import _ from "lodash";
import { createContext, useContext } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

type StateGuiType = {
  onTile: string;
  displayedMenu: boolean;
  selectedTab: string;
};

const makeStateGuiContext = () => {
  const defaultStateGui: StateGuiType = {
    displayedMenu: false,
    selectedTab: "info",
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

  function setOnTile(tileName: string){
    setStateWrapper('onTile', tileName)
  }


  return [
    state,
    {
      toggleDisplayedMenu,
      setSelectedTab,
      setOnTile
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
