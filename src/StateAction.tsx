import _ from "lodash";
import { JSXElement, createContext, createSignal, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { createHistory, record } from "solid-record";

import { setUserInformations } from "./signaux";
import { LineUnderConstructionType, MessageTypeEnum, ModeEnum } from "./type";

import { useStateGui } from "./StateGui";
import { BusLinePointType } from "./_entities/bus-line.entity";

const [, { setDisplayedInformationBoard }] = useStateGui();

const history = createHistory();

type StateActionType = {
  // Field which keep the select circle on the map
  //TODO May be the name of "altimetry" is not the good one, "settings" is more appropriate
  altimetry: { animation: boolean };
  lineUnderConstruction: LineUnderConstructionType;
  mode: ModeEnum;
};

export function defaultLineUnderConstruction() {
  const [latLngs, setLatLngs] = createSignal<L.LatLng[]>([]);
  const [color, setColor] = createSignal<string>("#000000");
  const [selected, setSelected] = createSignal<boolean>(false);
  return {
    confirmSelection: false,
    nextIndex: 0,
    busLine: {
      color: color,
      setColor: setColor,
      points: [],
      schools: [],
      currentIndex: 0,
      latLngs: latLngs,
      setLatLngs: setLatLngs,
      selected: selected,
      setSelected: setSelected,
    },
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

  function setPointsToLineUnderConstruction(points: BusLinePointType[]) {
    setState("lineUnderConstruction", "busLine", "points", points);
  }

  function addPointToLineUnderConstruction(point: BusLinePointType) {
    setState(
      "lineUnderConstruction",
      "busLine",
      "points",
      (line: BusLinePointType[]) => {
        const res = [...line];
        if (!_.isEqual(line.at(-1), point)) {
          const indice = state.lineUnderConstruction.nextIndex;
          res.splice(indice, 0, point);
        }

        setState("lineUnderConstruction", "nextIndex", res.length);

        return res;
      }
    );
  }

  function setLineUnderConstructionNextIndex(indicepoints: number) {
    setState("lineUnderConstruction", "nextIndex", indicepoints);
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
      setPointsToLineUnderConstruction,
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
      setLineUnderConstructionNextIndex,
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
