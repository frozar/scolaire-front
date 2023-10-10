import { Match, Show, Switch, createSignal, onMount } from "solid-js";
import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { getRaces } from "../../../map/component/organism/Races";
import { RacesList } from "../../../schools/component/organism/RacesList";
import StopDetailsHeader from "../molecul/StopDetailsHeader";
import StopDetailsPanelsButton from "../molecul/StopDetailsPanelsButton";
import "./StopDetails.css";
import ClassStudentToSchoolList from "./StudentSchoolClassList";

export const [stopDetailsItem, setStopDetailsItem] = createSignal<StopType>();

export enum StopPanels {
  classes = "schools",
  lines = "lines",
}

export default function () {
  const [onPanel, setOnPanel] = createSignal<StopPanels>(StopPanels.classes);
  const [editItem, setEditItem] = createSignal<boolean>(false);

  onMount(() => {
    console.log("Stop details: ", stopDetailsItem());

    if (stopDetailsItem() == undefined) {
      changeBoard("schools");
      MapElementUtils.deselectAllPointsAndBusRaces();
    }
  });

  const toggleEditItem = () => setEditItem((bool) => !bool);

  function getStopRaces() {
    const races = [];

    for (const race of getRaces) {
      const _race = race.points.filter((r) => r.id == stopDetailsItem()?.id);
      if (_race.length > 0) races.push(race);
    }

    return races;
  }

  function appendClassStudentToSchoolOfStop(classItem: AssociatedPointType) {
    setStopDetailsItem((prev) => {
      let currentItem;
      if (prev != undefined) {
        currentItem = { ...prev };
        currentItem?.associated.push(classItem);
      }

      return currentItem;
    });
  }

  function updateClassStudentToSchoolOfStop(classItem: AssociatedPointType) {
    setStopDetailsItem((prev) => {
      let currentItem;
      if (prev != undefined) {
        currentItem = { ...prev };
        const index = currentItem?.associated.findIndex(
          (item) => item.id == classItem.id
        );
        currentItem.associated[index] = classItem;
      }

      return currentItem;
    });
  }

  function removeClassStudentToSchoolOfStop(id: number) {
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
          NbRaces={getStopRaces().length}
        />

        <Show when={onPanel() == "schools"}>
          <ButtonIcon icon={<PlusIcon />} onClick={toggleEditItem} />
        </Show>
      </div>

      <div class="content mt-2">
        <Switch>
          <Match when={onPanel() == StopPanels.classes}>
            <ClassStudentToSchoolList
              schools={stopDetailsItem()?.associated as AssociatedPointType[]}
              removeClassStudentToSchoolItem={removeClassStudentToSchoolOfStop}
              updateClassStudentToSchoolOfStop={
                updateClassStudentToSchoolOfStop
              }
            />

            <Show when={editItem()}>
              <EditStop
                appendClassToList={appendClassStudentToSchoolOfStop}
                close={toggleEditItem}
              />
            </Show>
          </Match>
          <Match when={onPanel() == StopPanels.lines}>
            <RacesList races={getStopRaces()} />
          </Match>
        </Switch>
      </div>
    </section>
  );
}
