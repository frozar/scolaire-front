import { Setter } from "solid-js";
import { OrganizationMapBoundType } from "../../../../_entities/organization.entity";
import { LabeledInputNumber } from "../../board/component/molecule/LabeledInputNumber";
import "./OrganizationMapEdit.css";

interface OrganizationAddMapBoundProps {
  mapBounds: OrganizationMapBoundType;
  setter: Setter<OrganizationMapBoundType>;
}

export function OrganizationMapEdit(props: OrganizationAddMapBoundProps) {
  function onTopLat(value: number) {
    props.setter((prev) => {
      return { ...prev, corner1: { lat: value, lng: prev.corner1.lng } };
    });
  }

  function onTopLng(value: number) {
    props.setter((prev) => {
      return { ...prev, corner1: { lat: prev.corner1.lat, lng: value } };
    });
  }

  function onBotLat(value: number) {
    props.setter((prev) => {
      return { ...prev, corner2: { lat: value, lng: prev.corner1.lng } };
    });
  }

  function onBotLng(value: number) {
    props.setter((prev) => {
      return { ...prev, corner2: { lat: prev.corner2.lat, lng: value } };
    });
  }

  return (
    <div>
      <p class="map-bounds-header">Map Bounds</p>
      <div class="map-bounds-inputs">
        <div>
          <p>Coin Nord-Est</p>
          <LabeledInputNumber
            label="Lattitude"
            name="lat1"
            value={props.mapBounds.corner1.lat}
            onInput={(e) => onTopLat(Number(e.target.value))}
          />
          <LabeledInputNumber
            label="Longitude"
            name="lng1"
            onInput={(e) => onTopLng(Number(e.target.value))}
            value={props.mapBounds.corner1.lng}
          />
        </div>
        <div>
          <p>Coin Sud-Ouest</p>
          <LabeledInputNumber
            label="Lattitude"
            name="lat2"
            value={props.mapBounds.corner2.lat}
            onInput={(e) => onBotLat(Number(e.target.value))}
          />
          <LabeledInputNumber
            label="Longitude"
            name="lng2"
            onInput={(e) => onBotLng(Number(e.target.value))}
            value={props.mapBounds.corner2.lng}
          />
        </div>
      </div>
    </div>
  );
}
