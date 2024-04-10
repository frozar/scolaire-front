import { TripType } from "../../../../../_entities/trip.entity";
import Button from "../../../../../component/atom/Button";
import { TripUtils } from "../../../../../utils/trip.utils";

interface InversedTripButton {
  trip: TripType;
}

export function InversedTripButton(props: InversedTripButton) {
  return (
    <Button
      label="Construire la course inverse"
      onClick={() => TripUtils.buildReversedTrip(props.trip)}
      size="sm"
    />
  );
}
