import { Show, createEffect, createSignal } from "solid-js";
import {
  defaultCourseUnderConstruction,
  useStateAction,
} from "../../../../../StateAction";

import SelectedSchool from "../atom/SelectedSchool";

import {
  CourseType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/course.entity";
import { BusCourseService } from "../../../../../_services/course.service";

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
import { setLines } from "../../../map/component/organism/BusLines";
import {
  getCourses,
  setCourses,
  updateBusCourses,
} from "../../../map/component/organism/Courses";
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

const setColorOnCourse = (color: string): CourseType | undefined => {
  const line: CourseUnderConstructionType | undefined =
    getCourseUnderConstruction();

  if (!line) return;

  line.course.setColor(color);

  return line.course;
};

const onInput = (color: string) => {
  const line: CourseType | undefined = setColorOnCourse(color);

  if (!line) return;
};

const onChange = async (color: string) => {
  const line: CourseType | undefined = setColorOnCourse(color);

  if (!line) return;
};

async function onClick() {
  if (displayCourseMode() == displayCourseModeEnum.straight) {
    if (getCourseUnderConstruction().course.points.length < 2) {
      return;
    }
    if (!getCourseUnderConstruction().course.waypoints) {
      const waypoints = WaypointEntity.createWaypointsFromPoints(
        getCourseUnderConstruction().course
      );
      setCourseUnderConstruction({
        ...getCourseUnderConstruction(),
        course: {
          ...getCourseUnderConstruction().course,
          waypoints,
        },
      });
    }
    await updatePolylineWithOsrm(getCourseUnderConstruction().course);

    setDisplayCourseMode(displayCourseModeEnum.onRoad);
  } else if (displayCourseMode() == displayCourseModeEnum.onRoad) {
    getCourseUnderConstruction().course.setLatLngs([]);

    setDisplayCourseMode(displayCourseModeEnum.straight);
  }
}

export const [displayCourseMode, setDisplayCourseMode] =
  createSignal<displayCourseModeEnum>(displayCourseModeEnum.straight);

export default function () {
  const [lineName, setCourseName] = createSignal<string>(
    getCourseUnderConstruction().course.name ??
      getCourseUnderConstruction().course.schools[0].name
  );

  const etablissementSelected = () => {
    return getCourseUnderConstruction().course.schools;
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
            schoolsName={getCourseUnderConstruction().course.schools.map(
              (school) => school.name
            )}
          />
          <Show when={getCourseUnderConstruction().course.points.length > 0}>
            <DrawHelperButton
              schools={getCourseUnderConstruction().course.schools}
            />
          </Show>
        </div>
        <CollapsibleElement title="Métriques">
          <Metrics line={getCourseUnderConstruction().course} />
        </CollapsibleElement>
        <LabeledInputField
          label="Nom de la course"
          value={lineName()}
          onInput={(e) => setCourseName(e.target.value)}
          name="line-name"
          placeholder="Entrer le nom de la course"
        />

        <div class="flex mt-4 justify-between">
          <ColorPicker
            defaultColor={getCourseUnderConstruction().course.color()}
            title="Couleur de la course"
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
            when={getCourseUnderConstruction().course.points.length > 0}
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
async function createOrUpdateBusCourse(course: CourseType) {
  course.setSelected(true);
  if (course.id == undefined) {
    await createBusCourse(course);
  } else {
    await updateBusCourse(course);
  }
  quitModeAddCourse();
  setCurrentStep(drawModeStep.start);
  setDisplayCourseMode((prev) =>
    prev == displayCourseModeEnum.straight
      ? prev
      : displayCourseModeEnum.straight
  );
  selectedUpdatedBusCourse(getCourses().at(-1) as CourseType);
}

function selectedUpdatedBusCourse(course: CourseType) {
  getCourses()
    .filter((line) => line.id === course.id)[0]
    .setSelected(true);
}

async function createBusCourse(course: CourseType) {
  // const newBusCourses: LineType[] =
  // updateBusCourses(newBusCourses);
  setLines((await BusCourseService.create(course)) ?? []);
}

async function updateBusCourse(course: CourseType) {
  const updatedBusCourse: CourseType = await BusCourseService.update(course);
  updateBusCourses(updatedBusCourse);
}

async function nextStep() {
  enableSpinningWheel();
  switch (currentStep()) {
    case drawModeStep.schoolSelection:
      if (getCourseUnderConstruction().course.schools.length < 1) {
        break;
      }
      setCurrentStep(drawModeStep.editCourse);
    case drawModeStep.editCourse:
      if (getCourseUnderConstruction().course.points.length < 2) {
        break;
      }
      if (!getCourseUnderConstruction().course.waypoints) {
        const waypoints = WaypointEntity.createWaypointsFromPoints(
          getCourseUnderConstruction().course
        );
        setCourseUnderConstruction({
          ...getCourseUnderConstruction(),
          course: {
            ...getCourseUnderConstruction().course,
            waypoints,
          },
        });
      }
      if (displayCourseMode() == displayCourseModeEnum.straight) {
        await updatePolylineWithOsrm(getCourseUnderConstruction().course);
      }

      await createOrUpdateBusCourse(getCourseUnderConstruction().course);
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
      const course = unmodifiedBusCourse();
      if (course) {
        setCourses((buscourses) => {
          buscourses = [
            ...buscourses.filter(
              (course) => course.id != getCourseUnderConstruction().course.id
            ),
          ];
          buscourses.push(course);
          return buscourses;
        });
        setUnmodifiedBusCourse(undefined);
      }

      setCourseUnderConstruction(defaultCourseUnderConstruction());

      if (displayCourseMode() == displayCourseModeEnum.onRoad) {
        getCourseUnderConstruction().course.setLatLngs([]);
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
