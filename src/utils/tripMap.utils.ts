import L, { LeafletMouseEvent } from "leaflet";
import { PathType } from "../_entities/path.entity";
import { TripPointType, TripType } from "../_entities/trip.entity";
import { updatePointColor } from "../leafletUtils";
import {
  changeBoard,
  onBoard,
} from "../views/content/board/component/template/ContextManager";
import { deselectAllPoints } from "../views/content/map/component/organism/Points";
import {
  deselectAllTrips,
  setselectedTrip,
} from "../views/content/map/component/organism/Trips";
import { setSelectedPath } from "../views/content/path/component/organism/PathDetail";
import { getLines } from "../_stores/line.store";

export namespace TripMapUtils {
  export function onClickPath(path: PathType) {
    if (onBoard() == "path-draw" || onBoard() == "path-details") return;

    setSelectedPath();
    deselectAllPoints();
    deselectAllTrips();

    setSelectedPath(path);
    changeBoard("path-details");
  }

  export function onClickBusTrip(trip: TripType) {
    switch (onBoard()) {
      case "line-details":
      case "trip-draw":
        return;

      default:
        deselectAllTrips();
        deselectAllPoints();

        // TODO: Factoriser
        getLines().forEach((line) => line.setSelected(false));
        getLines().forEach((line) => {
          if (line.trips.some((_trip) => _trip.id == trip.id)) {
            line.setSelected(true);
          }
        });

        setselectedTrip(trip);

        changeBoard("line-details");

        updatePointColor();
    }
  }

  export function pointToTripDistance(
    clickCoordinate: L.LatLng,
    point1: L.LatLng,
    point2: L.LatLng
  ): number {
    const x1 = clickCoordinate.lng;
    const y1 = clickCoordinate.lat;
    const x2 = point1.lng;
    const y2 = point1.lat;
    const x3 = point2.lng;
    const y3 = point2.lat;

    return (
      Math.abs((y3 - y2) * x1 - (x3 - x2) * y1 + x3 * y2 - y3 * x2) /
      Math.sqrt((point1.lat - point2.lat) ** 2 + (point1.lng - point2.lng) ** 2)
    );
  }

  export function getLatLngsFromPoint(points: TripPointType[]): L.LatLng[] {
    return points.map((point) => L.latLng(point.lat, point.lon));
  }

  export function bustripSetNormalStyle(
    polyline: L.Polyline,
    arrowsLinked: L.Marker[],
    color: string
  ) {
    polylineSetNormalStyle(polyline, color);
    arrowsSetNormalStyle(arrowsLinked, color);
  }

  export function bustripSetBoldStyle(
    polyline: L.Polyline,
    arrowsLinked: L.Marker[],
    color: string
  ) {
    polylineSetBoldStyle(polyline, color);
    arrowsSetBoldStyle(arrowsLinked, color);
  }

  function polylineSetBoldStyle(polyline: L.Polyline, color: string) {
    polyline.setStyle({ color, weight: 5 });
  }

  function polylineSetNormalStyle(polyline: L.Polyline, color: string) {
    polyline.setStyle({ color, weight: 3 });
  }

  function arrowsSetBoldStyle(arrows: L.Marker[], color: string) {
    arrowApplyStyle(arrows, color, "scale(3,3) ");
  }

  function arrowsSetNormalStyle(arrows: L.Marker[], color: string) {
    arrowApplyStyle(arrows, color, "scale(2,2) ");
  }

  function arrowApplyStyle(
    arrows: L.Marker[],
    color: string,
    transform: string
  ) {
    arrows.map((arrow) => {
      const element = arrow.getElement();
      if (!element) {
        return;
      }
      const elementChild = element.firstElementChild;
      if (!elementChild) {
        return;
      }
      elementChild.setAttribute("fill", color);
    });

    // Change size
    arrows.map((arrow) => {
      const element = arrow.getElement();
      if (!element) {
        return;
      }

      const elementChild = element.firstElementChild;
      if (!elementChild) {
        return;
      }

      const subChild = elementChild.firstElementChild;
      if (!subChild) {
        return;
      }

      // Keep first transformation value which should be a rotation
      const transformValue = subChild.getAttribute("transform");
      const rotation = transformValue;
      if (!rotation) {
        return;
      }

      const rotationValue = rotation.split(" ").at(1);
      const transformModifiedValue = transform + rotationValue;

      subChild.setAttribute("transform", transformModifiedValue);
    });
  }

  export function getIndexBetween2PointGrabbed(e: LeafletMouseEvent): number {
    // * Get index between 2 point grabbing
    const coordinates: L.LatLng[] = e.target._latlngs;

    let distance = TripMapUtils.pointToTripDistance(
      e.latlng,
      coordinates[0],
      coordinates[1]
    );

    console.log("distance:", distance);

    let indice = 0;

    for (let i = 1; i < coordinates.length - 1; i++) {
      const actualDistance = TripMapUtils.pointToTripDistance(
        e.latlng,
        coordinates[i],
        coordinates[i + 1]
      );
      if (actualDistance < distance) {
        distance = actualDistance;
        indice = i;
      }
    }

    return indice;
  }
}
