import _ from "lodash";
import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { createHistory, record } from "solid-record";

import {
  PointIdentityType,
  ModeEnum,
  LineUnderConstructionType,
  MessageTypeEnum,
} from "./type";
import { setUserInformations } from "./signaux";

const history = createHistory();

type StateActionType = {
  // Field which keep the select circle on the map
  altimetry: { animation: boolean };
  lineUnderConstruction: LineUnderConstructionType;
  mode: ModeEnum;
};

function defaultLineUnderConstruction() {
  return {
    id_bus_line: -1,
    color: "#000000",
    stops: [],
  };
}

const makeStateActionContext = () => {
  const defaultState: StateActionType = {
    altimetry: { animation: true },
    lineUnderConstruction: defaultLineUnderConstruction(),
    mode: ModeEnum.read,
  };

  const [state, setState] = record(createStore(defaultState), history);

  function toggleAltimetryAnimation() {
    setState("altimetry", "animation", (animation: boolean) => !animation);
  }

  function addPointToLineUnderConstruction(point: PointIdentityType) {
    setState("lineUnderConstruction", "stops", (line: PointIdentityType[]) => {
      if (line.length === 0) {
        return [point];
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

  function getMode() {
    return state.mode;
  }

  return [
    state,
    {
      toggleAltimetryAnimation,
      addPointToLineUnderConstruction,
      getLineUnderConstruction,
      resetLineUnderConstruction,
      setLineUnderConstruction,
      setModeRemoveLine,
      setModeAddLine,
      setModeRead,
      isInAddLineMode,
      isInRemoveLineMode,
      isInReadMode,
      getMode,
    },
    history,
  ] as const;
};

type StateActionContextType = ReturnType<typeof makeStateActionContext>;
const StateActionContext = createContext<StateActionContextType>(
  makeStateActionContext()
);

export function StateActionProvider(props: any) {
  return (
    <StateActionContext.Provider value={makeStateActionContext()}>
      {props.children}
    </StateActionContext.Provider>
  );
}

export const useStateAction = () => useContext(StateActionContext);
