import L from "leaflet";
import { createEffect, createSignal, onMount } from "solid-js";
import { TripType } from "../../../../_entities/trip.entity";
import { TripMapUtils } from "../../../../utils/tripMap.utils";
import Line from "../../map/component/atom/Line";
import { linkMap } from "../../map/component/organism/Points";
import {
  COLOR_SCHOOL_FOCUS,
  COLOR_STOP_EMPHASE,
  COLOR_STOP_FOCUS,
} from "../../map/constant";
import { displaySchools } from "../organisme/SchoolPoints";
import { displayStops } from "../organisme/StopPoints";

export const [draggingTrip, setDraggingTrip] = createSignal<boolean>(false);

export function Trip(props: { trip: TripType; map: L.Map; onRoad: boolean }) {
  const [localLatLngs, setLocalLatLngs] = createSignal<L.LatLng[]>([]);
  const [localOpacity, setLocalOpacity] = createSignal<number>(1);

  onMount(() => {
    setTrip(props.onRoad);
  });

  createEffect(() => {
    setTrip(props.onRoad);
  });

  function setTrip(onroad: boolean) {
    if (onroad) {
      setLocalLatLngs(props.trip.latLngs);
      setLocalOpacity(1);
    } else {
      setLocalLatLngs(TripMapUtils.getLatLngsFromPoint(props.trip.tripPoints));
      setLocalOpacity(1);
    }
  }

  createEffect(() => {
    displayStops().map((stop) => {
      const circle = linkMap.get(stop.leafletId);
      circle?.setStyle({ fillColor: COLOR_STOP_FOCUS });
    });
    displaySchools().map((school) => {
      const circle = linkMap.get(school.leafletId);
      circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });
    });

    props.trip.tripPoints.map((point) => {
      const circle = linkMap.get(point.leafletId);
      circle?.setStyle({ fillColor: COLOR_STOP_EMPHASE });
    });
  });

  //TODO revoir le code avec l'ancienne version
  return (
    <>
      <Line
        latlngs={localLatLngs()}
        leafletMap={props.map}
        color={props.trip.color}
        opacity={localOpacity()}
        lineId={props.trip.id}
      />
    </>
  );
}

//TODO ajouter les PolylineDragMarker pour la partie edit
{
  /* <For each={localLatLngs()}>
{(latLng: L.LatLng, i) => {
  return (
    <PolylineDragMarker map={props.map} latlngs={latLng} index={i()} />
  );
}}
</For> */
}
