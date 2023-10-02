import { Show, createEffect, createSignal } from "solid-js";
import {
  defaultCourseUnderConstruction,
  useStateAction,
} from "../../../../../StateAction";

import SelectedSchool from "../atom/SelectedSchool";

import {
  BusCourseType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-course.entity";
import { BusCourseService } from "../../../../../_services/bus-course.service";

import BoardFooterActions from "../molecule/BoardFooterActions";

import "../../../../../css/timeline.css";
import { CourseUnderConstructionType } from "../../../../../type";
import { ColorPicker } from "../../../board/component/atom/ColorPicker";

import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import CurvedLine from "../../../../../icons/CurvedLine";
import SimpleCourse from "../../../../../icons/SimpleLine";
import { updatePointColor } from "../../../../../leafletUtils";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import {
  getBusCourses,
  setBusCourses,
  updateBusCourses,
} from "../../../map/component/organism/BusCourses";
import { quitModeAddCourse } from "../../../map/shortcut";
import { DrawHelperButton } from "../atom/DrawHelperButton";
import {
  setUnmodifiedBusCourse,
  unmodifiedBusCourse,
} from "../atom/UpdateCourseButton";
import ButtonIcon from "../molecule/ButtonIcon";
import LabeledInputField from "../molecule/LabeledInputField";
import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import { changeBoard } from "../template/ContextManager";
import CollapsibleElement from "./CollapsibleElement";
import "./DrawModeBoardContent.css";
import Metrics from "./Metrics";
import Timeline from "./Timeline";

const [
  ,
  {
    getCourseUnderConstruction,
    setCourseUnderConstruction,
    updateNameCourseUnderConstruction,
  },
] = useStateAction();

export enum drawModeStep {
  start,
  schoolSelection,
  editCourse,
}

export const [currentStep, setCurrentStep] = createSignal<drawModeStep>(
  drawModeStep.start
);

export enum displayCourseModeEnum {
  straight = "straight",
  onRoad = "onRoad",
}

const setColorOnCourse = (color: string): BusCourseType | undefined => {
  const line: CourseUnderConstructionType | undefined =
    getCourseUnderConstruction();

  if (!line) return;

  line.busCourse.setColor(color);

  return line.busCourse;
};

const onInput = (color: string) => {
  const line: BusCourseType | undefined = setColorOnCourse(color);

  if (!line) return;
};

const onChange = async (color: string) => {
  const line: BusCourseType | undefined = setColorOnCourse(color);

  if (!line) return;
};

async function onClick() {
  console.log("test");
  if (displayCourseMode() == displayCourseModeEnum.straight) {
    if (getCourseUnderConstruction().busCourse.points.length < 2) {
      return;
    }
    if (!getCourseUnderConstruction().busCourse.waypoints) {
      const waypoints = WaypointEntity.createWaypointsFromPoints(
        getCourseUnderConstruction().busCourse
      );
      setCourseUnderConstruction({
        ...getCourseUnderConstruction(),
        busCourse: {
          ...getCourseUnderConstruction().busCourse,
          waypoints,
        },
      });
    }
    await updatePolylineWithOsrm(getCourseUnderConstruction().busCourse);

    setDisplayCourseMode(displayCourseModeEnum.onRoad);
  } else if (displayCourseMode() == displayCourseModeEnum.onRoad) {
    getCourseUnderConstruction().busCourse.setLatLngs([]);

    setDisplayCourseMode(displayCourseModeEnum.straight);
  }
}

export const [displayCourseMode, setDisplayCourseMode] =
  createSignal<displayCourseModeEnum>(displayCourseModeEnum.straight);

export default function () {
  const [lineName, setCourseName] = createSignal<string>(
    getCourseUnderConstruction().busCourse.name ??
      getCourseUnderConstruction().busCourse.schools[0].name
  );

  const etablissementSelected = () => {
    return getCourseUnderConstruction().busCourse.schools;
  };

  createEffect(() => {
    updateNameCourseUnderConstruction(lineName());
  });

  return (
    <div class="add-line-information-board-content">
      <Show when={currentStep() == drawModeStep.schoolSelection}>
        <SelectedSchool schoolSelected={etablissementSelected()} />
      </Show>

      <Show when={currentStep() == drawModeStep.editCourse}>
        <div class="bus-course-information-board-content-schools">
          <SchoolsEnumeration
            schoolsName={getCourseUnderConstruction().busCourse.schools.map(
              (school) => school.name
            )}
          />
          <Show when={getCourseUnderConstruction().busCourse.points.length > 0}>
            <DrawHelperButton
              schools={getCourseUnderConstruction().busCourse.schools}
            />
          </Show>
        </div>
        <CollapsibleElement title="Métriques">
          <Metrics line={getCourseUnderConstruction().busCourse} />
        </CollapsibleElement>
        <LabeledInputField
          label="Nom de la ligne"
          value={lineName()}
          onInput={(e) => setCourseName(e.target.value)}
          name="line-name"
          placeholder="Entrer le nom de la ligne"
        />

        <div class="flex mt-4 justify-between">
          <ColorPicker
            defaultColor={getCourseUnderConstruction().busCourse.color()}
            title="Couleur de la ligne"
            onInput={onInput}
            onChange={onChange}
          />

          <Show
            when={displayCourseMode() == displayCourseModeEnum.straight}
            fallback={
              <ButtonIcon
                icon={<SimpleCourse />}
                onClick={onClick}
                class="line-to-road-btn-icon"
              />
            }
          >
            <ButtonIcon
              icon={<CurvedLine />}
              onClick={onClick}
              class="line-to-road-btn-icon"
            />
          </Show>
        </div>
      </Show>

      <Show when={currentStep() == drawModeStep.editCourse}>
        <div class="bus-course-information-board-content">
          <Show
            when={getCourseUnderConstruction().busCourse.points.length > 0}
            fallback={
              <div class="flex w-4/5 text-xs justify-center absolute bottom-[500px]">
                Veuillez sélectionner des points sur la carte
              </div>
            }
          >
            <Timeline />
          </Show>
        </div>
      </Show>

      <BoardFooterActions
        nextStep={{
          callback: nextStep,
          label:
            currentStep() == drawModeStep.editCourse ? "Valider" : "Suivant",
        }}
        previousStep={{
          callback: prevStep,
          label:
            currentStep() === drawModeStep.schoolSelection
              ? "Annuler"
              : "Précédant",
        }}
      />
    </div>
  );
}
async function createOrUpdateBusCourse(busCourse: BusCourseType) {
  busCourse.setSelected(true);
  if (busCourse.id == undefined) {
    await createBusCourse(busCourse);
  } else {
    await updateBusCourse(busCourse);
  }
  quitModeAddCourse();
  setCurrentStep(drawModeStep.start);
  setDisplayCourseMode((prev) =>
    prev == displayCourseModeEnum.straight
      ? prev
      : displayCourseModeEnum.straight
  );
  selectedUpdatedBusCourse(getBusCourses().at(-1) as BusCourseType);
}

function selectedUpdatedBusCourse(busCourse: BusCourseType) {
  getBusCourses()
    .filter((line) => line.id === busCourse.id)[0]
    .setSelected(true);
}

async function createBusCourse(busCourse: BusCourseType) {
  const newBusCourse: BusCourseType = await BusCourseService.create(busCourse);
  updateBusCourses(newBusCourse);
}

async function updateBusCourse(busCourse: BusCourseType) {
  const updatedBusCourse: BusCourseType = await BusCourseService.update(
    busCourse
  );
  updateBusCourses(updatedBusCourse);
}

async function nextStep() {
  enableSpinningWheel();
  switch (currentStep()) {
    case drawModeStep.schoolSelection:
      if (getCourseUnderConstruction().busCourse.schools.length < 1) {
        break;
      }
      setCurrentStep(drawModeStep.editCourse);
    case drawModeStep.editCourse:
      if (getCourseUnderConstruction().busCourse.points.length < 2) {
        break;
      }
      if (!getCourseUnderConstruction().busCourse.waypoints) {
        const waypoints = WaypointEntity.createWaypointsFromPoints(
          getCourseUnderConstruction().busCourse
        );
        setCourseUnderConstruction({
          ...getCourseUnderConstruction(),
          busCourse: {
            ...getCourseUnderConstruction().busCourse,
            waypoints,
          },
        });
      }
      if (displayCourseMode() == displayCourseModeEnum.straight) {
        await updatePolylineWithOsrm(getCourseUnderConstruction().busCourse);
      }

      await createOrUpdateBusCourse(getCourseUnderConstruction().busCourse);
      changeBoard("line-details");
      updatePointColor();
  }
  disableSpinningWheel();
}

function prevStep() {
  switch (currentStep()) {
    case drawModeStep.schoolSelection:
      setCourseUnderConstruction(defaultCourseUnderConstruction());
      quitModeAddCourse();

      setCurrentStep(drawModeStep.start);
      changeBoard("line");
      MapElementUtils.deselectAllPointsAndBusCourses();

      break;
    case drawModeStep.editCourse:
      const busCourse = unmodifiedBusCourse();
      if (busCourse) {
        setBusCourses((buscourses) => {
          buscourses = [
            ...buscourses.filter(
              (busCourse) =>
                busCourse.id != getCourseUnderConstruction().busCourse.id
            ),
          ];
          buscourses.push(busCourse);
          return buscourses;
        });
        setUnmodifiedBusCourse(undefined);
      }

      setCourseUnderConstruction(defaultCourseUnderConstruction());

      if (displayCourseMode() == displayCourseModeEnum.onRoad) {
        getCourseUnderConstruction().busCourse.setLatLngs([]);
      }

      setCurrentStep(drawModeStep.schoolSelection);
      break;
  }
  setDisplayCourseMode((prev) =>
    prev == displayCourseModeEnum.straight
      ? prev
      : displayCourseModeEnum.straight
  );
}
