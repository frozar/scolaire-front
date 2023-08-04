import _ from "lodash";
import { JSXElement, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { createHistory, record } from "solid-record";

import { setUserInformations } from "./signaux";
import {
  LineUnderConstructionType,
  MessageTypeEnum,
  ModeEnum,
  PointIdentityType,
} from "./type";

import { useStateGui } from "./StateGui";

const [, { setDisplayedInformationBoard }] = useStateGui();

const history = createHistory();

type StateActionType = {
  // Field which keep the select circle on the map
  //TODO May be the name of "altimetry" is not the good one, "settings" is more appropriate
  altimetry: { animation: boolean };
  lineUnderConstruction: LineUnderConstructionType;
  mode: ModeEnum;
};

function defaultLineUnderConstruction() {
  return {
    idBusLine: -1,
    color: "#000000",
    stops: [],
    etablissementSelected: [],
    confirmSelection: false,
    currentIndex: 0,
    nextIndex: 0,
  };
}

const makeStateActionContext = () => {
  const defaultState: StateActionType = {
    altimetry: { animation: true },
    lineUnderConstruction: defaultLineUnderConstruction(),
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

  function addPointToLineUnderConstruction(point: PointIdentityType) {
    setState("lineUnderConstruction", "stops", (line: PointIdentityType[]) => {
      if (line.length === 0) {
        return [point];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      } else if (_.isEqual(line.at(-1)!, point)) {
        return line;
      } else {
        return [...line, point];
      }
    });
  }

  function resetLineUnderConstruction() {
    setState("lineUnderConstruction", defaultLineUnderConstruction());
  }

  function setLineUnderConstruction(line: LineUnderConstructionType) {
    setState("lineUnderConstruction", line);
  }

  function getLineUnderConstruction() {
    return state.lineUnderConstruction;
  }

  function confirmEtablissementSelection() {
    setState("lineUnderConstruction", "confirmSelection", true);
  }

  const types: { [key in ModeEnum]: MessageTypeEnum[] } = {
    [ModeEnum.read]: [MessageTypeEnum.global],
    [ModeEnum.addLine]: [MessageTypeEnum.addLine, MessageTypeEnum.enterAddLine],
    [ModeEnum.removeLine]: [
      MessageTypeEnum.removeLine,
      MessageTypeEnum.enterRemoveLine,
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

  function setModeRemoveLine() {
    changeMode(ModeEnum.removeLine);
  }

  function setModeAddLine() {
    setDisplayedInformationBoard(true);
    changeMode(ModeEnum.addLine);
  }

  function setModeRead() {
    changeMode(ModeEnum.read);
  }

  function isInAddLineMode() {
    return state.mode === ModeEnum.addLine;
  }

  function isInRemoveLineMode() {
    return state.mode === ModeEnum.removeLine;
  }

  function isInReadMode() {
    return state.mode === ModeEnum.read;
  }

  return [
    state,
    {
      toggleAltimetryAnimation,
      getAnimationSettings,
      addPointToLineUnderConstruction,
      getLineUnderConstruction,
      resetLineUnderConstruction,
      setLineUnderConstruction,
      confirmEtablissementSelection,
      setModeRemoveLine,
      setModeAddLine,
      setModeRead,
      isInAddLineMode,
      isInRemoveLineMode,
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
