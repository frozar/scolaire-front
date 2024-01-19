import { Show } from "solid-js";
import { TripType } from "../../../../../_entities/trip.entity";
import Button from "../../../../../component/atom/Button";
import { PathUtil } from "../../../../../utils/path.utils";
import { TripUtils } from "../../../../../utils/trip.utils";

interface InversedTripButton {
  trip: TripType;
}

export function InversedTripButton(props: InversedTripButton) {
  return (
    <Show when={!PathUtil.haveReversedTrip(props.trip)}>
      <Button
        label="Construire la course inverse"
        onClick={() => TripUtils.buildReversedTrip(props.trip)}
        size="sm"
      />
    </Show>
  );
}
