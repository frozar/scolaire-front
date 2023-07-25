import L from "leaflet";
import { For, createSignal, onMount } from "solid-js";
import { fetchSchool } from "../../point.service";
import PointEtablissement from "../molecule/PointEtablissement";

type PointEtablissementDBType = {
  id: number;
  id_point: number;
  lon: number;
  lat: number;
  name: string;
  quantity: number;
};

export interface PointsEtablissementProps {
  map: L.Map;
  mapID: number;
}

const [etablissements, setEtablissement] = createSignal<
  PointEtablissementDBType[]
>([]);

export default function (props: PointsEtablissementProps) {
  onMount(async () => {
    setEtablissement(await fetchSchool(props.mapID));
  });

  return (
    <For each={etablissements()}>
      {(point, i) => {
        console.log("in for", point.name);

        const onClick = () => "";
        const onIsLast = () => "";
        const onDBLClick = () => "";
        const onMouseOver = () => "";
        const onMouseOut = () => "";

        return (
          <PointEtablissement
            idPoint={point.id_point}
            lat={point.lat}
            lon={point.lon}
            map={props.map}
            isLast={i() === etablissements().length - 1}
            isBlinking={false}
            onIsLast={onIsLast}
            onClick={onClick}
            onDBLClick={onDBLClick}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
          />
        );
      }}
    </For>
  );
}
