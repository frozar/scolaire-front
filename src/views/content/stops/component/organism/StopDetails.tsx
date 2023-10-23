import { Match, Show, Switch, createSignal, onMount } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { TripEntity } from "../../../../../_entities/trip.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { getStops } from "../../../map/component/organism/StopPoints";
import { TripsList } from "../../../schools/component/organism/TripsList";
import EditStudentSchoolGradeItem from "../molecul/EditStudentSchoolGradeItem";
import StopDetailsHeader from "../molecul/StopDetailsHeader";
import StopDetailsPanelsButton from "../molecul/StopDetailsPanelsButton";
import "./StopDetails.css";
import ClassStudentToSchoolList from "./StudentSchoolGradeList";

export const [stopDetailsItem, setStopDetailsItem] = createSignal<StopType>();
export function updateStopDetailsItem(stopId: number) {
  if (stopDetailsItem() != undefined && stopDetailsItem()?.id == stopId) {
    const stopIndex = getStops().findIndex((prev) => prev.id == stopId);
    const stop = getStops()[stopIndex];

    setStopDetailsItem((prev) => {
      if (prev != undefined) {
        const currentItem = { ...stop };
        return currentItem;
      }
      return prev;
    });
  }
}
export enum StopPanels {
  grades = "grades",
  trips = "trips",
}

export default function () {
  const [onPanel, setOnPanel] = createSignal<StopPanels>(StopPanels.grades);
  const [editItem, setEditItem] = createSignal<boolean>(false);

  onMount(() => {
    if (stopDetailsItem() == undefined) {
      changeBoard("schools");
      MapElementUtils.deselectAllPointsAndBusTrips();
    }
  });

  const toggleEditItem = () => setEditItem((bool) => !bool);

  return (
    <section>
      <StopDetailsHeader stop={stopDetailsItem() as StopType} />

      <p>TODO élèves</p>

      <div class="stop-details-actions">
        <StopDetailsPanelsButton
          onPanel={onPanel}
          setOnPanel={setOnPanel}
          NbSchool={stopDetailsItem()?.associated.length as number}
          NbTrips={
            TripEntity.getStopTrips(stopDetailsItem()?.id as number).length
          }
        />

        <Show when={onPanel() == "grades"}>
          <ButtonIcon icon={<PlusIcon />} onClick={toggleEditItem} />
        </Show>
      </div>

      <div class="content mt-2">
        <Switch>
          <Match when={onPanel() == StopPanels.grades}>
            <ClassStudentToSchoolList
              schools={stopDetailsItem()?.associated as AssociatedSchoolType[]}
            />

            <Show when={editItem()}>
              <EditStudentSchoolGradeItem close={toggleEditItem} />
            </Show>
          </Match>
          <Match when={onPanel() == StopPanels.trips}>
            <TripsList
              trips={TripEntity.getStopTrips(stopDetailsItem()?.id as number)}
            />
          </Match>
        </Switch>
      </div>
    </section>
  );
}
