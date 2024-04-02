import L from "leaflet";
import { createEffect } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import {
  AddLineStep,
  addLineCurrentStep,
  addLineSelectedSchool,
} from "../../../line/template/LineAdd";
import { COLOR_SCHOOL_FOCUS, COLOR_SCHOOL_LIGHT } from "../../constant";
import Point from "../atom/Point";
import { blinkingSchools, linkMap } from "../organism/Points";
import { SchoolPointUtils } from "../schoolPoint.utils";

export interface SchoolPointProps {
  school: SchoolType;
  map: L.Map;
}

export function SchoolPoint(props: SchoolPointProps) {
  createEffect(() => {
    //TODO dont Work

    if (addLineCurrentStep() === AddLineStep.schoolSelection) {
      const stopFiltering = addLineSelectedSchool().filter(
        (school) => school.id == props.school.id
      );
      const circle = linkMap.get(props.school.leafletId);
      if (stopFiltering.length > 0) {
        circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });
      } else {
        circle?.setStyle({ fillColor: COLOR_SCHOOL_LIGHT });
      }
    }
  });

  return (
    <Point
      point={props.school}
      map={props.map}
      isBlinking={blinkingSchools().includes(props.school.id)}
      borderColor={COLOR_SCHOOL_FOCUS}
      fillColor={COLOR_SCHOOL_FOCUS}
      radius={12}
      weight={0}
      onClick={() => SchoolPointUtils.onClick(props.school)}
      onMouseOver={() => SchoolPointUtils.onMouseOver(props.school)}
      onMouseOut={() => SchoolPointUtils.onMouseOut()}
      onMouseUp={() => SchoolPointUtils.onMouseUp(props.school)}
      onRightClick={() => SchoolPointUtils.onRightClick(props.school)}
    />
  );
}
