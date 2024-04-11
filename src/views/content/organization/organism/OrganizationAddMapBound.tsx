import { Setter } from "solid-js";
import { OrganizationMapBoundType } from "../../../../_entities/organization.entity";
import { LabeledInputNumber } from "../../board/component/molecule/LabeledInputNumber";

interface OrganizationAddMapBoundProps {
  setter: Setter<OrganizationMapBoundType>;
}

export function OrganizationAddMapBound(props: OrganizationAddMapBoundProps) {
  function onTopLat(value: number) {
    props.setter((prev) => {
      const prevLon = prev.corner1 ? prev.corner1.lon : 0;
      return { ...prev, corner1: { lat: value, lon: prevLon } };
    });
  }

  function onTopLng(value: number) {
    props.setter((prev) => {
      const prevLat = prev.corner1 ? prev.corner1.lat : 0;
      return { ...prev, corner1: { lat: prevLat, lon: value } };
    });
  }

  function onBotLat(value: number) {
    props.setter((prev) => {
      const prevLon = prev.corner2 ? prev.corner1.lon : 0;
      return { ...prev, corner2: { lat: value, lon: prevLon } };
    });
  }

  function onBotLng(value: number) {
    props.setter((prev) => {
      const prevLat = prev.corner1 ? prev.corner2.lat : 0;
      return { ...prev, corner2: { lat: prevLat, lon: value } };
    });
  }

  return (
    <div>
      <div>
        <p>Coin supérieur</p>
        <LabeledInputNumber
          label="Lattitude"
          name="lat1"
          value={0}
          onInput={(e) => onTopLat(Number(e.target.value))}
        />
        <LabeledInputNumber
          label="Longitude"
          name="lng1"
          onInput={(e) => onTopLng(Number(e.target.value))}
          value={0}
        />
      </div>
      <div>
        <p>Coin inférieur</p>
        <LabeledInputNumber
          label="Lattitude"
          name="lat2"
          value={0}
          onInput={(e) => onBotLat(Number(e.target.value))}
        />
        <LabeledInputNumber
          label="Longitude"
          name="lng2"
          onInput={(e) => onBotLng(Number(e.target.value))}
          value={0}
        />
      </div>
    </div>
  );
}
