import L, { LeafletMouseEvent } from "leaflet";
import { Accessor, Setter, createEffect, onCleanup, onMount } from "solid-js";

import { BusStopType } from "../../../../../_entities/busStops.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { NatureEnum } from "../../../../../type";
import { linkMap } from "../organism/Points";
import "./Point.css";

export type PointIdentityType = {
  id: number;
  idPoint: number;
  nature: NatureEnum;
};

export interface PointInformation extends PointIdentityType {
  lon: number;
  lat: number;
  name: string;
  quantity?: number;
}

export type PointType = StopType | SchoolType | BusStopType;

// TODO probably to delete
export interface PointInterface extends PointInformation {
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
  associatedPoints: Accessor<PointIdentityType[]>;
  setAssociatedPoints: Setter<PointIdentityType[]>;
}

export interface PointProps {
  point: PointType;

  map: L.Map;
  isBlinking?: boolean;

  borderColor: string;
  fillColor: string;
  weight: number;
  radius: number;

  onClick: () => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
  onMouseUp: () => void;

  onRightClick?: () => void;
}

const onDBLClick = (event: LeafletMouseEvent) => {
  L.DomEvent.stopPropagation(event);
};

export default function (props: PointProps) {
  let circle: L.CircleMarker;

  const onRightClick = () => {
    if (props.onRightClick != undefined) {
      props.onRightClick();
    }
  };

  onMount(() => {
    if (props.point) {
      circle = L.circleMarker([props.point.lat, props.point.lon], {
        color: props.borderColor,
        fillColor: props.fillColor,
        radius: props.radius,
        fillOpacity: 1,
        weight: props.weight,
        pane: "markerPane",
        className: "map-point",
      })
        .on("click", props.onClick)
        .on("dblclick", onDBLClick)
        .on("mouseover", props.onMouseOver)
        .on("mouseout", props.onMouseOut)
        .on("mouseup", props.onMouseUp)
        .on("contextmenu", onRightClick)
        .addTo(props.map);

      const element = circle.getElement();
      if (element) {
        linkMap.set(props.point.leafletId, circle);
      }

      createEffect(() => {
        const element = linkMap
          .get(props.point.leafletId)
          ?.getElement() as HTMLElement;

        if (element) {
          element.style.setProperty("--stroke-color", props.borderColor);
        }

        if (element && props.isBlinking) {
          element.classList.add("circle-animation");
        } else if (element && !props.isBlinking) {
          element.classList.remove("circle-animation");
        } else return;
      });
    }
  });

  createEffect(() => {
    if (circle) {
      circle.setRadius(props.radius);
      circle
        .getElement()
        ?.setAttribute("stroke-width", props.weight.toString());
    }
  });

  // createEffect(() => {
  //   if (props.point.nature == NatureEnum.stop) {
  //     if (addLineCurrentStep() === AddLineStep.stopSelection) {
  //       circle?.setStyle({ fillColor: COLOR_STOP_LIGHT });
  //       if (
  //         addLineCheckableStop()
  //           .map((stop) => stop.item.id)
  //           .includes(props.point.id)
  //       ) {
  //         circle?.setStyle({ fillColor: COLOR_STOP_FOCUS });
  //       } else {
  //         circle?.setStyle({ fillColor: COLOR_STOP_LIGHT });
  //       }
  //     }
  //   }
  // });

  onCleanup(() => {
    if (props.point) {
      linkMap.delete(props.point.leafletId);
    }
    if (circle) circle.remove();
  });

  return <></>;
}
