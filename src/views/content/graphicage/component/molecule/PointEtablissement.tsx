import { LeafletMouseEvent } from "leaflet";
import Point from "../atom/Point";

export interface PointEtablissementProps {
  idPoint: number;
  lat: number;
  lon: number;
  map: L.Map;
  isLast: boolean;
  isBlinking?: boolean;

  onIsLast: () => void;
  onClick: () => void;
  onDBLClick: (event: LeafletMouseEvent) => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
}

export default function (props: PointEtablissementProps) {
  return (
    <Point
      {...props}
      borderColor="green"
      fillColor="white"
      radius={12}
      weight={4}
    />
  );
}
