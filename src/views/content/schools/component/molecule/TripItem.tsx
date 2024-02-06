import { TripType } from "../../../../../_entities/trip.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import Pellet from "../../../../../component/atom/Pellet";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import ArretsLogo from "../../../../../icons/ArretsLogo";
import { TripMapUtils } from "../../../map/component/molecule/tripMap.utils";
import GradeLinkedSchool from "../atom/GradeLinkedSchool";
import "./TripItem.css";

export function TripItem(props: { trip: TripType }) {
  const schoolNames = () => {
    return props.trip.schools.map((school) => school.name ?? "");
  };

  return (
    <CardWrapper
      class="trip-item"
      onClick={() => TripMapUtils.onClickBusTrip(props.trip)}
    >
      <Pellet color={props.trip.color} />
      <div class="trip-content">
        <CardTitle title={props.trip.name ?? "Pas de nom de trip"} />
        <GradeLinkedSchool schools={schoolNames()} />

        <div class="trip-stops-count">
          <div class="stop-logo">
            <ArretsLogo />
          </div>
          <p>{props.trip.tripPoints.length + " arrêts déservis"}</p>
        </div>
      </div>
    </CardWrapper>
  );
}
