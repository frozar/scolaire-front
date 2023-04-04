import _ from "lodash";
import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { createHistory, record } from "solid-record";

import { PointIdentity, ModeEnum } from "./type";

const history = createHistory();

type StateActionType = {
  // Field which keep the select circle on the map
  altimetry: { animation: boolean };
  lineUnderConstruction: { id: number | null; stops: PointIdentity[] };
  mode: ModeEnum;
};

const makeStateActionContext = () => {
  const defaultState: StateActionType = {
    altimetry: { animation: true },
    lineUnderConstruction: { id: null, stops: [] },
    mode: ModeEnum.read,
  };

  const [state, setState] = record(createStore(defaultState), history);

  function toggleAltimetryAnimation() {
    setState("altimetry", "animation", (animation: boolean) => !animation);
  }

  function addPointToLineUnderConstruction(point: PointIdentity) {
    setState("lineUnderConstruction", "stops", (line: PointIdentity[]) => {
      if (line.length === 0) {
        return [point];
      } else if (_.isEqual(line.at(-1)!, point)) {
        return line;
      } else {
        return [...line, point];
      }
    });
  }

  function setLineUnderConstructionId(id: number) {
    setState("lineUnderConstruction", "id", id);
  }

  function getLineUnderConstruction() {
    return state.lineUnderConstruction;
  }

  function setModeRemoveLine() {
    setState("mode", (currentMode) => {
      if (currentMode !== ModeEnum.removeLine) {
        return ModeEnum.removeLine;
      }
      return currentMode;
    });
  }

  function setModeRead() {
    setState("mode", (currentMode) => {
      if (currentMode !== ModeEnum.read) {
        return ModeEnum.read;
      }
      return currentMode;
    });
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
      setLineUnderConstructionId,
      setModeRemoveLine,
      setModeRead,
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
