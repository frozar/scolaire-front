import _ from "lodash";
import { JSXElement, createContext, createSignal, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { createHistory, record } from "solid-record";

import { setUserInformations } from "./signaux";
import { CourseUnderConstructionType, MessageTypeEnum, ModeEnum } from "./type";

import { useStateGui } from "./StateGui";
import {
  BusCoursePointType,
  busCourseMetricType,
} from "./_entities/bus-course.entity";
import { SchoolType } from "./_entities/school.entity";
import { StopType } from "./_entities/stop.entity";
import { COLOR_LINE_UNDER_CONSTRUCTION } from "./views/content/map/constant";

const [, { setDisplayedInformationBoard }] = useStateGui();

const history = createHistory();

type StateActionType = {
  // Field which keep the select circle on the map
  //TODO May be the name of "altimetry" is not the good one, "settings" is more appropriate
  altimetry: { animation: boolean };
  courseUnderConstruction: CourseUnderConstructionType;
  mode: ModeEnum;
};

export function defaultCourseUnderConstruction(): CourseUnderConstructionType {
  const [latLngs, setLatLngs] = createSignal<L.LatLng[]>([]);
  const [color, setColor] = createSignal<string>(COLOR_LINE_UNDER_CONSTRUCTION);
  const [selected, setSelected] = createSignal<boolean>(false);
  const [metrics, setMetrics] = createSignal<busCourseMetricType>({});

  return {
    nextIndex: 0,
    busCourse: {
      color: color,
      setColor: setColor,
      points: [],
      schools: [],
      name: "my default name",
      latLngs: latLngs,
      setLatLngs: setLatLngs,
      selected: selected,
      setSelected: setSelected,
      metrics: metrics,
      setMetrics: setMetrics,
    },
  };
}

const makeStateActionContext = () => {
  const defaultState: StateActionType = {
    altimetry: { animation: true },
    courseUnderConstruction: defaultCourseUnderConstruction(),
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

  function setPointsToCourseUnderConstruction(points: BusCoursePointType[]) {
    setState("courseUnderConstruction", "busCourse", "points", points);
  }

  function addPointToCourseUnderConstruction(point: BusCoursePointType) {
    setState(
      "courseUnderConstruction",
      "busCourse",
      "points",
      (line: BusCoursePointType[]) => {
        const res = [...line];
        if (!_.isEqual(line.at(-1), point)) {
          const indice = state.courseUnderConstruction.nextIndex;
          res.splice(indice, 0, point);
        }

        setState("courseUnderConstruction", "nextIndex", res.length);

        return res;
      }
    );
  }

  // TODO: move all logic about line under construction in CourseUnderConstruction file
  function removePointToCourseUnderConstruction(point: StopType | SchoolType) {
    setState(
      "courseUnderConstruction",
      "busCourse",
      "points",
      (line: BusCoursePointType[]) => {
        return line.filter(
          (l) => l.id != point.id && l.lat != point.lat && l.lon != point.lon
        );
      }
    );
  }

  function removeSchoolToCourseUnderConstruction(point: StopType | SchoolType) {
    setState(
      "courseUnderConstruction",
      "busCourse",
      "schools",
      (line: SchoolType[]) => {
        return line.filter(
          (l) => l.id != point.id && l.lat != point.lat && l.lon != point.lon
        );
      }
    );
  }

  function setCourseUnderConstructionNextIndex(indicepoints: number) {
    setState("courseUnderConstruction", "nextIndex", indicepoints);
  }

  function resetCourseUnderConstruction() {
    setState("courseUnderConstruction", defaultCourseUnderConstruction());
  }

  function setCourseUnderConstruction(line: CourseUnderConstructionType) {
    setState("courseUnderConstruction", line);
  }

  function getCourseUnderConstruction() {
    return state.courseUnderConstruction;
  }

  function updateNameCourseUnderConstruction(name: string) {
    setState("courseUnderConstruction", "busCourse", "name", name);
  }

  const types: { [key in ModeEnum]: MessageTypeEnum[] } = {
    [ModeEnum.read]: [MessageTypeEnum.global],
    [ModeEnum.addCourse]: [
      MessageTypeEnum.addCourse,
      MessageTypeEnum.enterAddCourse,
    ],
    [ModeEnum.removeCourse]: [
      MessageTypeEnum.removeCourse,
      MessageTypeEnum.enterRemoveCourse,
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

  function setModeAddCourse() {
    setDisplayedInformationBoard(true);
    changeMode(ModeEnum.addCourse);
  }

  function setModeRead() {
    changeMode(ModeEnum.read);
  }

  function isInAddCourseMode() {
    return state.mode === ModeEnum.addCourse;
  }

  function isInReadMode() {
    return state.mode === ModeEnum.read;
  }

  return [
    state,
    {
      toggleAltimetryAnimation,
      getAnimationSettings,
      setPointsToCourseUnderConstruction,
      addPointToCourseUnderConstruction,
      getCourseUnderConstruction,
      resetCourseUnderConstruction,
      setCourseUnderConstruction,
      setModeAddCourse,
      setModeRead,
      isInAddCourseMode,
      isInReadMode,
      setCourseUnderConstructionNextIndex,
      removePointToCourseUnderConstruction,
      removeSchoolToCourseUnderConstruction,
      updateNameCourseUnderConstruction,
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
