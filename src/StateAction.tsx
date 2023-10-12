import { JSXElement, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { createHistory, record } from "solid-record";

import { setUserInformations } from "./signaux";
import { MessageTypeEnum, ModeEnum } from "./type";

import { useStateGui } from "./StateGui";

const [, { setDisplayedInformationBoard }] = useStateGui();

const history = createHistory();

type StateActionType = {
  // Field which keep the select circle on the map
  //TODO May be the name of "altimetry" is not the good one, "settings" is more appropriate
  altimetry: { animation: boolean };
  mode: ModeEnum;
};

const makeStateActionContext = () => {
  const defaultState: StateActionType = {
    altimetry: { animation: true },
    mode: ModeEnum.read,
  };

  // eslint-disable-next-line solid/reactivity
  const [state, setState] = record(createStore(defaultState), history);

  function toggleAltimetryAnimation() {
    setState("altimetry", "animation", (animation: boolean) => !animation);
  }

  function getAnimationSettings() {
    return state.altimetry.animation;
  }

  const types: { [key in ModeEnum]: MessageTypeEnum[] } = {
    [ModeEnum.read]: [MessageTypeEnum.global],
    [ModeEnum.addRace]: [MessageTypeEnum.addRace, MessageTypeEnum.enterAddRace],
    [ModeEnum.removeRace]: [
      MessageTypeEnum.removeRace,
      MessageTypeEnum.enterRemoveRace,
    ],
  };

  function clearMessage(mode: ModeEnum) {
    const messageTypesToKeep = types[mode];
    setUserInformations((userInformations) =>
      userInformations.filter(
        (userInformation) =>
          messageTypesToKeep.includes(userInformation.type) ||
          userInformation.type === MessageTypeEnum.global
      )
    );
  }

  function changeMode(mode: ModeEnum) {
    clearMessage(mode);
    setState("mode", (currentMode) => {
      if (currentMode !== mode) {
        return mode;
      }
      return currentMode;
    });
  }

  function setModeDrawRace() {
    setDisplayedInformationBoard(true);
    changeMode(ModeEnum.addRace);
  }

  function setModeRead() {
    changeMode(ModeEnum.read);
  }

  function isInDrawRaceMode() {
    return state.mode === ModeEnum.addRace;
  }

  function isInReadMode() {
    return state.mode === ModeEnum.read;
  }

  return [
    state,
    {
      toggleAltimetryAnimation,
      getAnimationSettings,
      setModeDrawRace,
      setModeRead,
      isInDrawRaceMode,
      isInReadMode,
    },
    history,
  ] as const;
};

type StateActionContextType = ReturnType<typeof makeStateActionContext>;
const StateActionContext = createContext<StateActionContextType>(
  makeStateActionContext()
);

export function StateActionProvider(props: { children: JSXElement }) {
  return (
    <StateActionContext.Provider value={makeStateActionContext()}>
      {props.children}
    </StateActionContext.Provider>
  );
}

export const useStateAction = () => useContext(StateActionContext);
