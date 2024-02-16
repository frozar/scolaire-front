import { Setter, createEffect, createSignal, on } from "solid-js";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../../_entities/trip-direction.entity";
import { TripPointType, TripType } from "../../../../../_entities/trip.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { NatureEnum } from "../../../../../type";
import { CurrentDrawTripUtils } from "../../../../../utils/currentDrawTrip.utils";
import { QuantityUtils } from "../../../../../utils/quantity.utils";
import { TripUtils } from "../../../../../utils/trip.utils";
import { linkMap } from "../../../map/component/organism/Points";
import { COLOR_SCHOOL_FOCUS, COLOR_STOP_FOCUS } from "../../../map/constant";
import { TripTimelineItem } from "../atom/TripTimelineItem";
import { setCurrentDrawTrip } from "../organism/DrawTripBoard";

interface TripTimelineItemWrapperProps {
  setTrip?: Setter<TripType>;
  tripPoint: TripPointType;
  trip: TripType;
  indice: number;
}

export function TripTimelineItemWrapper(props: TripTimelineItemWrapperProps) {
  const [quantity, setQuantity] = createSignal<number>(0);
  const trippoints = () => props.trip.tripPoints;

  createEffect(on(trippoints, () => getQuantity()));

  const tripDirection = () =>
    TripDirectionEntity.FindDirectionById(props.trip.tripDirectionId);

  function getQuantity() {
    const append = tripDirection().type == TripDirectionEnum.going;
    if (append) {
      setQuantity(
        QuantityUtils.SumQuantity(props.trip.tripPoints, props.indice)
      );
    } else {
      setQuantity(
        QuantityUtils.DropQuantity(props.trip.tripPoints, props.indice)
      );
    }
  }

  function getToAppendQuantity() {
    if (props.tripPoint.nature === NatureEnum.stop)
      return (
        "+ " +
        props.tripPoint.grades
          .map((grade) => grade.quantity)
          .reduce((total, quantity) => total + quantity, 0)
      );
    else
      return (
        QuantityUtils.SumQuantity(props.trip.tripPoints, props.indice - 1) * -1
      );
  }

  function getTotalDropped(points: TripPointType[], indice: number) {
    let total = 0;
    points.every((item, index) => {
      if (index < indice) {
        total += item.grades.reduce((total, grade) => {
          return total + grade.quantity;
        }, 0);
        return true;
      } else return false;
    });
    return total;
  }

  function getToDropQuantity() {
    const points = TripUtils.getSplitedTripPointsAtFirstSchoolPosition(
      props.trip.tripPoints
    );
    const tripTotalQuantity = QuantityUtils.getTripTotalQuantities(points);
    const indice = points.findIndex(
      (item) => item.id == props.trip.tripPoints[props.indice].id
    );
    let bufferTotal = tripTotalQuantity - getTotalDropped(points, indice);

    if (props.tripPoint.nature === NatureEnum.stop) {
      const result = bufferTotal - quantity();
      bufferTotal -= result;
      return result;
    } else return "+ " + tripTotalQuantity;
  }

  // * The left side of timeline
  function getToCalculQuantity(): string {
    const appendQuantity = tripDirection().type == TripDirectionEnum.going;
    if (appendQuantity) {
      return getToAppendQuantity() + "";
    } else {
      if (
        !QuantityUtils.haveSchoolBefore(props.trip.tripPoints, props.indice)
      ) {
        if (props.tripPoint.nature == NatureEnum.school) {
          const slicedTripPoint =
            TripUtils.getSplitedTripPointsAtFirstSchoolPosition(
              props.trip.tripPoints
            );
          return "+" + QuantityUtils.getTripTotalQuantities(slicedTripPoint);
        }
        return "--";
      }

      return "-" + getToDropQuantity();
    }
  }

  function deletePoint(indice: number) {
    if (props.setTrip) {
      const points = [...props.trip.tripPoints];
      const pointId = points[indice].id;
      const pointNature = points[indice].nature;

      if (
        pointNature == NatureEnum.school &&
        TripUtils.canRemoveSchoolPointFromTrip(points[indice].leafletId)
      ) {
        return;
      }
      if (
        pointNature == NatureEnum.school &&
        TripUtils.canRemoveSchoolPointFromTrip(points[indice].leafletId)
      ) {
        return;
      }
      // TODO pas de l'ordre de la timeline !!
      const circle = linkMap.get(props.trip.tripPoints[indice].leafletId);
      pointNature == NatureEnum.stop
        ? circle?.setStyle({ fillColor: COLOR_STOP_FOCUS })
        : circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });

      points.splice(indice, 1);

      props.setTrip((trip) => {
        return { ...trip, points };
      });

      // Update waypoints array
      const waypoints = props.trip.waypoints;
      if (waypoints) {
        let newWaypoints = [...waypoints];

        newWaypoints = WaypointEntity.deleteSchoolOrStopWaypoint(
          waypoints,
          pointId,
          pointNature
        );

        CurrentDrawTripUtils.updateWaypoints(newWaypoints);
        CurrentDrawTripUtils.removeTripPoint(pointId, pointNature);
      }
    }
  }

  function onClickWaitingTime(indice: number, newValue: number) {
    const points = [...props.trip.tripPoints];
    const point = points[indice];
    setCurrentDrawTrip((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tripPoints: prev.tripPoints.map((point_) => {
          if (point_.id == point.id) point_.waitingTime = newValue;

          return point_;
        }),
      };
    });
  }

  return (
    <TripTimelineItem
      pointNature={props.tripPoint.nature}
      pointName={props.tripPoint.name}
      tripColor={props.trip.color}
      timePassage={TripUtils.getTimePassage(
        props.indice,
        props.trip,
        props.tripPoint
      )}
      calculatedQuantity={quantity()}
      quantityToGetOrDrop={getToCalculQuantity()}
      onClickRemovePointFromTrip={() => deletePoint(props.indice)}
      waitingTime={props.tripPoint.waitingTime}
      onClickWaitingTime={(value: number) =>
        onClickWaitingTime(props.indice, value)
      }
    />
  );
}
