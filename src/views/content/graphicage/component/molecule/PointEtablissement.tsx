import { LeafletMouseEvent } from "leaflet";
import { blinkingStopPoint } from "../../PointsRamassageAndEtablissement";
import Point, { PointInterface } from "../atom/Point";

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
      isBlinking={blinkingStopPoint().includes(props.point.idPoint)}
      borderColor="green"
      fillColor="white"
      radius={12}
      weight={4}
    />
  );
}
