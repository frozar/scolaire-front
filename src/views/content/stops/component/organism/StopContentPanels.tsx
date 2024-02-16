import { Accessor, Match, Setter, Show, Switch } from "solid-js";
import { TripEntity } from "../../../../../_entities/trip.entity";
import { TripsList } from "../../../schools/component/organism/TripsList";
import EditStudentSchoolGradeItem from "../molecul/EditStudentSchoolGradeItem";
import { StopPanels, stopDetailsItem } from "./StopDetails";
import StudentSchoolGradeList from "./StudentSchoolGradeList";

interface StopContentPanelsProps {
  onPanel: Accessor<StopPanels>;
  setOnPanel: Setter<StopPanels>;
  inAddQuantity: Accessor<boolean>;
  toggleInAddQuantity: () => void;
}

export function StopContentPanels(props: StopContentPanelsProps) {
  return (
    <div class="content mt-2">
      <Switch>
        <Match when={props.onPanel() == StopPanels.grades}>
          <StudentSchoolGradeList />

          <Show when={props.inAddQuantity()}>
            <EditStudentSchoolGradeItem close={props.toggleInAddQuantity} />
          </Show>
        </Match>
        <Match when={props.onPanel() == StopPanels.trips}>
          <TripsList
            trips={TripEntity.getStopTrips(stopDetailsItem()?.id as number)}
          />
        </Match>
      </Switch>
    </div>
  );
}
