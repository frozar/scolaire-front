import { JSXElement, Match, Switch, createSignal } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { TripType } from "../../../../../_entities/trip.entity";
import { StopUtils } from "../../../../../utils/stop.utils";
import { TripUtils } from "../../../../../utils/trip.utils";
import { StopList } from "./StopList";
import { TripsList } from "./TripsList";

// TODO: Refactor all panels files (tsx, css)
enum GradeDetailsPanelEnum {
  stops = "stops",
  trips = "trips",
}

export function GradeDetailsPanels(props: { grade: GradeType }): JSXElement {
  const [onPanel, setOnPanel] = createSignal<GradeDetailsPanelEnum>(
    GradeDetailsPanelEnum.stops
  );

  function linkedTrips(): TripType[] {
    return TripUtils.getByLinkedGrade(props.grade.id as number);
  }

  function linkedStops(): StopType[] {
    return StopUtils.getByLinkedGrade(props.grade.id as number);
  }

  return (
    <>
      <div class="panel-actions">
        <div class="school-details-panels-buttons">
          <button
            class="panel-button"
            classList={{ active: onPanel() == GradeDetailsPanelEnum.stops }}
            onClick={() => setOnPanel(GradeDetailsPanelEnum.stops)}
          >
            {`Arrếts (${linkedStops().length})`}
          </button>

          <button
            class="panel-button"
            classList={{ active: onPanel() == GradeDetailsPanelEnum.trips }}
            onClick={() => setOnPanel(GradeDetailsPanelEnum.trips)}
          >
            {`Courses (${linkedTrips().length})`}
          </button>
        </div>
      </div>
      <div class="board-content">
        <Switch>
          <Match when={onPanel() == GradeDetailsPanelEnum.stops}>
            <StopList stops={linkedStops()} />
          </Match>
          <Match when={onPanel() == GradeDetailsPanelEnum.trips}>
            <TripsList trips={linkedTrips()} />
          </Match>
        </Switch>
      </div>
    </>
  );
}
