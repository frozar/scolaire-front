import L, { LeafletMouseEvent } from "leaflet";
import { useStateAction } from "../../../StateAction";
import { points } from "../../../signaux";
import { PointEtablissementType, PointIdentityType } from "../../../type";
import { renderAnimation } from "./animation";
import { deselectAllBusLines } from "./line/busLinesUtils";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
  },
] = useStateAction();

export const linkMap = new Map<number, L.CircleMarker>();

export function selectPointById(targerIdPoint: number) {
  points().map((point) => point.setSelected(targerIdPoint == point.idPoint));
}

export function deselectAllPoints() {
  points().map((point) => point.setSelected(false));
}

export const buildCircleEvent = {
  onClick: (point: PointEtablissementType) => {
    if (!isInAddLineMode()) {
      deselectAllBusLines();
      selectPointById(point.idPoint);
      return;
    }

    const pointIdentity: PointIdentityType = {
      id: point.id,
      idPoint: point.idPoint,
      nature: point.nature,
    };

    addPointToLineUnderConstruction(pointIdentity);

    if (!(1 < getLineUnderConstruction().stops.length)) {
      return;
    }

    // Highlight point ramassage
    for (const associatedPoint of point.associatedPoints()) {
      let element;
      if ((element = linkMap.get(associatedPoint.idPoint)?.getElement())) {
        renderAnimation(element);
      }
    }
  },

  onDBLClick: (event: LeafletMouseEvent) => L.DomEvent.stopPropagation(event),
};
