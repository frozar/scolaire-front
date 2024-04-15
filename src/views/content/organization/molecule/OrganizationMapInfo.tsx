import { OrganizationMapBoundType } from "../../../../_entities/organization.entity";
import "./OrganizationMapInfo.css";

interface OrganizationMapInfoProps {
  mapBounds: OrganizationMapBoundType;
}

export function OrganizationMapInfo(props: OrganizationMapInfoProps) {
  return (
    <div>
      <p class="map-info-title">Map Bounds</p>
      <div class="map-info-container">
        <p class="map-info-subtitle">Coin Nord-Est :</p>
        <p class="map-info-item">Lattitude : {props.mapBounds.corner1.lat}</p>
        <p class="map-info-item">Longitude : {props.mapBounds.corner1.lng}</p>
      </div>
      <div class="map-info-container">
        <p class="map-info-subtitle">Coin Sud-Ouest</p>
        <p class="map-info-item">Lattitude : {props.mapBounds.corner2.lat}</p>
        <p class="map-info-item">Longitude : {props.mapBounds.corner2.lng}</p>
      </div>
    </div>
  );
}
