import { Accessor, Match, Setter, Show, Switch } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import { TripEntity } from "../../../../../_entities/trip.entity";
import { TripsList } from "../../../schools/component/organism/TripsList";
import EditStudentSchoolGradeItem from "../molecul/EditStudentSchoolGradeItem";
import { StopPanels } from "../template/StopDetails";
import { StudentSchoolGradeList } from "./StudentSchoolGradeList";

interface StopContentPanelsProps {
  stop: StopType;
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
          <TripsList trips={TripEntity.getStopTrips(props.stop.id as number)} />
        </Match>
      </Switch>
    </div>
  );
}
