import { LeafletMouseEvent } from "leaflet";
import Point, { PointInterface } from "../atom/Point";
import { blinkingPoints } from "../organism/Points";

export interface PointEtablissementProps {
  point: PointInterface;
  map: L.Map;
  isLast: boolean;

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
      isBlinking={blinkingPoints().includes(props.point.idPoint)}
      borderColor="green"
      fillColor="white"
      radius={12}
      weight={4}
    />
  );
}
