import { Match, Show, Switch, createSignal, onMount } from "solid-js";
import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { getCourses } from "../../../map/component/organism/Courses";
import CoursesList from "../../../schools/component/organism/CoursesList";
import EditStop from "../molecul/EditStudentSchoolClassItem";
import StopDetailsHeader from "../molecul/StopDetailsHeader";
import StopDetailsPanelsButton from "../molecul/StopDetailsPanelsButton";
import "./StopDetails.css";
import StudentSchoolClassList from "./StudentSchoolClassList";

export const [stopDetailsItem, setStopDetailsItem] = createSignal<StopType>();

export enum StopPanels {
  classes = "schools",
  lines = "lines",
}

export default function () {
  const [onPanel, setOnPanel] = createSignal<StopPanels>(StopPanels.classes);
  const [editItem, setEditItem] = createSignal<boolean>(false);

  onMount(() => {
    if (stopDetailsItem() == undefined) {
      changeBoard("schools");
      MapElementUtils.deselectAllPointsAndBusCourses();
    }
  });

  const toggleEditItem = () => setEditItem((bool) => !bool);

  function getStopCourses() {
    const lines = [];

    for (const line of getCourses()) {
      const _line = line.points.filter((l) => l.id == stopDetailsItem()?.id);
      if (_line.length > 0) lines.push(line);
    }

    return lines;
  }

  function appendClassToStop(classItem: AssociatedPointType) {
    setStopDetailsItem((prev) => {
      let currentItem;
      if (prev != undefined) {
        currentItem = { ...prev };
        currentItem?.associated.push(classItem);
      }

      return currentItem;
    });
  }

  function removeClassToSchool(id: number) {
    setStopDetailsItem((prev) => {
      let currentItem;
      if (prev != undefined) {
        currentItem = { ...prev };
        currentItem.associated = currentItem.associated.filter(
          (item) => item.studentSchoolId != id
        );
      }

      return currentItem;
    });
  }

  return (
    <section>
      <StopDetailsHeader stop={stopDetailsItem() as StopType} />

      <p>TODO élèves</p>

      <div class="stop-details-actions">
        <StopDetailsPanelsButton
          onPanel={onPanel}
          setOnPanel={setOnPanel}
          NbSchool={stopDetailsItem()?.associated.length as number}
          NbCourses={getStopCourses().length}
        />

        <Show when={onPanel() == "schools"}>
          <ButtonIcon icon={<PlusIcon />} onClick={toggleEditItem} />
        </Show>
      </div>

      <div class="content mt-2">
        <Switch>
          <Match when={onPanel() == StopPanels.classes}>
            <StudentSchoolClassList
              schools={stopDetailsItem()?.associated as AssociatedPointType[]}
              removeClassStudentToSchoolItem={removeClassToSchool}
            />

            <Show when={editItem()}>
              <EditStop
                appendClassToList={appendClassToStop}
                close={toggleEditItem}
                stopID={stopDetailsItem()?.id as number}
              />
            </Show>
          </Match>
          <Match when={onPanel() == StopPanels.lines}>
            <CoursesList courses={getStopCourses()} />
          </Match>
        </Switch>
      </div>
    </section>
  );
}
