import { Match, Show, Switch, createSignal, onMount } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import { RaceEntity } from "../../../../../_entities/race.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { getStops } from "../../../map/component/organism/StopPoints";
import { RacesList } from "../../../schools/component/organism/RacesList";
import EditStudentSchoolClassItem from "../molecul/EditStudentSchoolClassItem";
import StopDetailsHeader from "../molecul/StopDetailsHeader";
import StopDetailsPanelsButton from "../molecul/StopDetailsPanelsButton";
import "./StopDetails.css";
import ClassStudentToSchoolList from "./StudentSchoolClassList";

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
  classes = "schools",
  races = "races",
}

export default function () {
  const [onPanel, setOnPanel] = createSignal<StopPanels>(StopPanels.classes);
  const [editItem, setEditItem] = createSignal<boolean>(false);

  onMount(() => {
    if (stopDetailsItem() == undefined) {
      changeBoard("schools");
      MapElementUtils.deselectAllPointsAndBusRaces();
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
          NbRaces={
            RaceEntity.getStopRaces(stopDetailsItem()?.id as number).length
          }
        />

        <Show when={onPanel() == "schools"}>
          <ButtonIcon icon={<PlusIcon />} onClick={toggleEditItem} />
        </Show>
      </div>

      <div class="content mt-2">
        <Switch>
          <Match when={onPanel() == StopPanels.classes}>
            <ClassStudentToSchoolList
              schools={stopDetailsItem()?.associated as AssociatedSchoolType[]}
            />

            <Show when={editItem()}>
              <EditStudentSchoolClassItem close={toggleEditItem} />
            </Show>
          </Match>
          <Match when={onPanel() == StopPanels.races}>
            <RacesList
              races={RaceEntity.getStopRaces(stopDetailsItem()?.id as number)}
            />
          </Match>
        </Switch>
      </div>
    </section>
  );
}
