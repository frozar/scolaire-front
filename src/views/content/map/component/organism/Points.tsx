import L from "leaflet";
import { createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { SchoolPoints, getSchools } from "./SchoolPoints";
import { StopPoints, getStops } from "./StopPoints";

const [, { getLineUnderConstruction, setLineUnderConstruction }] =
  useStateAction();

export const linkMap = new Map<number, L.CircleMarker>();

export const [blinkingStops, setBlinkingStops] = createSignal<number[]>([]);

export const [blinkingSchools, setBlinkingSchools] = createSignal<number[]>([]);

export const [cursorIsOverPoint, setCursorIsOverPoint] =
  createSignal<boolean>(false);

export function deselectAllPoints() {
  getSchools().map((point) => point.setSelected(false));
  getStops().map((point) => point.setSelected(false));
}
export const [pointsReady, setPointsReady] = createSignal(false);

interface PointsProps {
  leafletMap: L.Map;
}

export function updateWaypoints(point: StopType | SchoolType) {
  const waypoints = getLineUnderConstruction().busLine.waypoints;
  if (!waypoints) {
    return;
  }
  const newWaypoints = [...waypoints];

  const index = getLineUnderConstruction().busLine.points.findIndex(
    (actualPoint) => actualPoint.id == point.id
  );
  if (getLineUnderConstruction().busLine.points.length < index + 2) {
    newWaypoints.push({
      idStop: point.id,
      lat: point.lat,
      lon: point.lon,
    });

    setLineUnderConstruction({
      ...getLineUnderConstruction(),
      busLine: {
        ...getLineUnderConstruction().busLine,
        waypoints: newWaypoints,
      },
    });
    return;
  }

  const indexPreviousWaypoint =
    index > 0
      ? waypoints.findIndex(
          (actualPoint) =>
            actualPoint.idStop ==
            getLineUnderConstruction().busLine.points[index - 1].id
        )
      : -1;

  const indexNextWaypoint = waypoints.findIndex(
    (actualPoint) =>
      actualPoint.idStop ==
        getLineUnderConstruction().busLine.points[index + 1].id ||
      actualPoint.idSchool ==
        getLineUnderConstruction().busLine.points[index + 1].id
  );

  const difference = indexNextWaypoint - indexPreviousWaypoint;

  const toDelete = difference > 1 ? difference - 1 : 0;

  newWaypoints.splice(indexPreviousWaypoint + 1, toDelete, {
    idStop: point.id,
    lat: point.lat,
    lon: point.lon,
  });

  setLineUnderConstruction({
    ...getLineUnderConstruction(),
    busLine: {
      ...getLineUnderConstruction().busLine,
      waypoints: newWaypoints,
    },
  });
}

export function Points(props: PointsProps) {
  createEffect(() => {
    if (getSchools().length == 0 || getStops().length == 0) {
      return;
    }

    setPointsReady(true);
  });
  return (
    <div>
      <StopPoints leafletMap={props.leafletMap} />
      <SchoolPoints leafletMap={props.leafletMap} />
    </div>
  );
}
