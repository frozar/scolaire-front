import { createEffect } from "solid-js";

interface RoadLinePointProps {
  latlng: L.LatLng;
}

export default function (props: RoadLinePointProps) {
  createEffect(() => {
    // Actualiser la position ici
    // OU dans busline car props passé est un signal !
  });
  return <></>;
}
