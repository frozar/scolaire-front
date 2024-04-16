import L from "leaflet";
import { createEffect, createSignal, onMount } from "solid-js";
import { TripType } from "../../../../_entities/trip.entity";
import { NatureEnum } from "../../../../type";
import { TripMapUtils } from "../../../../utils/tripMap.utils";
import Line from "../../map/component/atom/Line";
import { linkMap } from "../../map/component/organism/Points";
import { COLOR_STOP_EMPHASE } from "../../map/constant";

export const [draggingTrip, setDraggingTrip] = createSignal<boolean>(false);

export function Trip(props: { trip: TripType; map: L.Map; onRoad: boolean }) {
  const [localLatLngs, setLocalLatLngs] = createSignal<L.LatLng[]>([]);
  const [localOpacity, setLocalOpacity] = createSignal<number>(1);

  onMount(() => {
    setTrip(props.onRoad);
    setLocalLatLngs(props.trip.latLngs);
  });

  createEffect(() => {
    setTrip(props.onRoad);
    setLocalLatLngs(props.trip.latLngs);
  });

  function setTrip(onroad: boolean) {
    if (onroad) {
      setLocalLatLngs(props.trip.latLngs);
      setLocalOpacity(0.7);
    } else {
      setLocalLatLngs(TripMapUtils.getLatLngsFromPoint(props.trip.tripPoints));
      setLocalOpacity(1);
    }
  }

  let pointFocus: { circle: L.CircleMarker; nature: NatureEnum }[] = [];

  createEffect(() => {
    if (props.onRoad) {
      pointFocus = [];
      props.trip.tripPoints.map((point) => {
        const circle = linkMap.get(point.leafletId);
        circle?.setStyle({ fillColor: COLOR_STOP_EMPHASE });
        pointFocus.push({
          circle: circle as L.CircleMarker,
          nature: point.nature,
        });
      });
    }
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
